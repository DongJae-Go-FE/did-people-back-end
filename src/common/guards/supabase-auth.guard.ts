import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../../prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization 헤더가 없습니다');
    }

    const token = authHeader.slice(7);
    const secret = this.config.getOrThrow<string>('JWT_ACCESS_SECRET');

    let payload: jwt.JwtPayload;
    try {
      payload = jwt.verify(token, secret) as jwt.JwtPayload;
    } catch {
      throw new UnauthorizedException('유효하지 않거나 만료된 토큰입니다');
    }

    const user = await this.prisma.loginData.findFirst({
      where: { id: BigInt(payload.sub!), accessToken: token },
    });

    if (!user) {
      throw new UnauthorizedException('토큰이 무효화되었습니다. 다시 로그인해주세요');
    }

    request.user = {
      id: user.id.toString(),
      email: user.idEmail,
      role: user.role ?? 'manager',
      region: user.region ?? null,
    };

    return true;
  }
}
