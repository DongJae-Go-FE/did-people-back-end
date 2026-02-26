import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private get accessSecret() {
    return this.config.getOrThrow<string>('JWT_ACCESS_SECRET');
  }

  private get refreshSecret() {
    return this.config.getOrThrow<string>('JWT_REFRESH_SECRET');
  }

  private generateTokens(userId: string, email: string, role: string, region: string | null) {
    const payload = { sub: userId, email, role, region };

    const accessToken = jwt.sign(payload, this.accessSecret, {
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '1h'),
    });

    const refreshExpiresIn = this.config.get('JWT_REFRESH_EXPIRES_IN', '30d');
    const refreshToken = jwt.sign(payload, this.refreshSecret, {
      expiresIn: refreshExpiresIn,
    });

    const decoded = jwt.decode(refreshToken) as { exp: number };
    const refreshTokenExpiresAt = new Date(decoded.exp * 1000);

    return { accessToken, refreshToken, refreshTokenExpiresAt };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.loginData.findFirst({
      where: { idEmail: dto.username },
    });

    const isValid = user?.password
      ? await bcrypt.compare(dto.password, user.password)
      : false;
    if (!user || !isValid) {
      throw new UnauthorizedException('아이디 또는 비밀번호가 올바르지 않습니다');
    }

    const { accessToken, refreshToken, refreshTokenExpiresAt } = this.generateTokens(
      user.id.toString(),
      user.idEmail ?? '',
      user.role ?? 'manager',
      user.region,
    );

    await this.prisma.loginData.update({
      where: { id: user.id },
      data: { accessToken, refreshToken, refreshTokenExpiresAt },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id.toString(),
        email: user.idEmail,
        role: user.role,
        region: user.region,
      },
    };
  }

  async refresh(dto: RefreshDto) {
    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(dto.refreshToken, this.refreshSecret) as jwt.JwtPayload;
    } catch {
      throw new UnauthorizedException('유효하지 않거나 만료된 refreshToken입니다');
    }

    const user = await this.prisma.loginData.findFirst({
      where: { id: BigInt(payload.sub!), refreshToken: dto.refreshToken },
    });

    if (!user) throw new UnauthorizedException('refreshToken이 일치하지 않습니다');

    if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
      throw new UnauthorizedException('refreshToken이 만료되었습니다. 다시 로그인해주세요');
    }

    const { accessToken, refreshToken, refreshTokenExpiresAt } = this.generateTokens(
      user.id.toString(),
      user.idEmail ?? '',
      user.role ?? 'manager',
      user.region,
    );

    await this.prisma.loginData.update({
      where: { id: user.id },
      data: { accessToken, refreshToken, refreshTokenExpiresAt },
    });

    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    await this.prisma.loginData.update({
      where: { id: BigInt(userId) },
      data: { accessToken: null, refreshToken: null, refreshTokenExpiresAt: null },
    });
    return { message: '로그아웃 완료' };
  }
}
