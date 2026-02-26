import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { MemberQueryDto } from './dto/member-query.dto';
import { UpdateMemberDto } from './dto/update-member.dto';

export interface RequestUser {
  id: string;
  email: string;
  role: string;
  region: string | null;
}

function serializeMember(row: Record<string, unknown>): Record<string, unknown> {
  return {
    ...row,
    id: row.id !== undefined ? Number(row.id) : row.id,
    age: row.age !== undefined && row.age !== null ? Number(row.age) : row.age,
  };
}

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: MemberQueryDto, user: RequestUser) {
    const { pageIndex = 0, pageSize = 20, name, parish, cathedral, chosenDiocese, region } = query;
    const skip = pageIndex * pageSize;

    const where: Record<string, unknown> = {};

    // region 필터: manager는 본인 지역만, admin은 요청 region 또는 전체
    if (user.role === 'manager') {
      where.region = user.region;
    } else if (region) {
      where.region = region;
    }

    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (parish) where.parish = { contains: parish, mode: 'insensitive' };
    if (cathedral) where.cathedral = { contains: cathedral, mode: 'insensitive' };
    if (chosenDiocese) where.chosenDiocese = { contains: chosenDiocese, mode: 'insensitive' };

    const [data, totalCount] = await Promise.all([
      this.prisma.member.findMany({ where, skip, take: pageSize, orderBy: { id: 'asc' } }),
      this.prisma.member.count({ where }),
    ]);

    return {
      data: data.map((row) => serializeMember(row as unknown as Record<string, unknown>)),
      meta: {
        totalCount,
        pageIndex,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }

  async findOne(id: number, user: RequestUser) {
    const row = await this.prisma.member.findUnique({ where: { id: BigInt(id) } });
    if (!row) throw new NotFoundException(`ID ${id}에 해당하는 데이터가 없습니다`);
    return serializeMember(row as unknown as Record<string, unknown>);
  }

  async create(dto: CreateMemberDto, user: RequestUser) {
    // manager는 본인 지역으로만 등록
    const region = user.role === 'manager' ? user.region : (dto.region ?? null);

    const created = await this.prisma.member.create({
      data: {
        name: dto.name,
        age: dto.age !== undefined ? BigInt(dto.age) : undefined,
        nation: dto.nation,
        parish: dto.parish,
        cathedral: dto.cathedral,
        phone: dto.phone,
        emergencyNum: dto.emergencyNum,
        profile: dto.profile,
        qr: dto.qr,
        chosenDiocese: dto.chosenDiocese,
        region,
      },
    });
    return serializeMember(created as unknown as Record<string, unknown>);
  }

  async update(id: number, dto: UpdateMemberDto, user: RequestUser) {
    const row = await this.findOne(id, user);

    // manager는 본인 지역 데이터만 수정 가능
    if (user.role === 'manager' && row.region !== user.region) {
      throw new ForbiddenException('본인 지역의 데이터만 수정할 수 있습니다');
    }

    const updated = await this.prisma.member.update({
      where: { id: BigInt(id) },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.age !== undefined && { age: BigInt(dto.age) }),
        ...(dto.nation !== undefined && { nation: dto.nation }),
        ...(dto.parish !== undefined && { parish: dto.parish }),
        ...(dto.cathedral !== undefined && { cathedral: dto.cathedral }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.emergencyNum !== undefined && { emergencyNum: dto.emergencyNum }),
        ...(dto.profile !== undefined && { profile: dto.profile }),
        ...(dto.qr !== undefined && { qr: dto.qr }),
        ...(dto.chosenDiocese !== undefined && { chosenDiocese: dto.chosenDiocese }),
        ...(user.role === 'admin' && dto.region !== undefined && { region: dto.region }),
      },
    });
    return serializeMember(updated as unknown as Record<string, unknown>);
  }

  async remove(id: number, user: RequestUser) {
    const row = await this.findOne(id, user);

    // manager는 본인 지역 데이터만 삭제 가능
    if (user.role === 'manager' && row.region !== user.region) {
      throw new ForbiddenException('본인 지역의 데이터만 삭제할 수 있습니다');
    }

    await this.prisma.member.delete({ where: { id: BigInt(id) } });
    return { message: `ID ${id} 삭제 완료` };
  }
}
