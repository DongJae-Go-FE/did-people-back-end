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
  nave: string | null;
}

function serializeMember(row: Record<string, unknown>): Record<string, unknown> {
  const { assignedChurchgoerId, assignedChurchgoer, ...rest } = row;
  const serialized: Record<string, unknown> = {
    ...rest,
    id: rest.id !== undefined ? Number(rest.id) : rest.id,
    age: rest.age !== undefined && rest.age !== null ? Number(rest.age) : rest.age,
  };
  if (assignedChurchgoer && typeof assignedChurchgoer === 'object') {
    const cg = assignedChurchgoer as Record<string, unknown>;
    serialized.assignedChurchgoer = {
      id: Number(cg.id),
      name: cg.name,
      parish: cg.parish,
      address: cg.address,
    };
  } else {
    serialized.assignedChurchgoer = null;
  }
  return serialized;
}

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: MemberQueryDto, user: RequestUser) {
    const { pageIndex = 0, pageSize = 20, name, parish, cathedral, diocese, chosenDiocese } = query;
    const skip = pageIndex * pageSize;

    const where: Record<string, unknown> = {};

    // region 스코핑: 본인 교구 데이터만. region이 null인 사용자(super-admin)는 전체 조회 가능
    if (user.region) {
      where.region = user.region;
    }

    // parish 필터: manager는 본인 본당만, admin은 요청 parish 또는 전체
    if (user.role === 'manager') {
      where.parish = user.nave;
    } else if (parish) {
      where.parish = { contains: parish, mode: 'insensitive' };
    }

    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (cathedral) where.cathedral = { contains: cathedral, mode: 'insensitive' };
    if (diocese) where.diocese = { contains: diocese, mode: 'insensitive' };
    if (chosenDiocese) where.chosenDiocese = { contains: chosenDiocese, mode: 'insensitive' };

    const [data, totalCount] = await Promise.all([
      this.prisma.member.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { id: 'desc' },
        include: { assignedChurchgoer: { select: { id: true, name: true, parish: true, address: true } } },
      }),
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
    const row = await this.prisma.member.findUnique({
      where: { id: BigInt(id) },
      include: { assignedChurchgoer: { select: { id: true, name: true, parish: true, address: true } } },
    });
    if (!row) throw new NotFoundException(`ID ${id}에 해당하는 데이터가 없습니다`);
    // 본인 교구 데이터만 조회 가능 (super-admin 제외)
    if (user.region && row.region && row.region !== user.region) {
      throw new ForbiddenException('본인 교구의 데이터만 조회할 수 있습니다');
    }
    return serializeMember(row as unknown as Record<string, unknown>);
  }

  async create(dto: CreateMemberDto, user: RequestUser) {
    // manager는 본인 본당으로만 등록
    const parish = user.role === 'manager' ? user.nave : (dto.parish ?? null);
    // region은 사용자 교구로 강제 (super-admin만 dto값 허용)
    const region = user.region ?? dto.region ?? null;

    const created = await this.prisma.member.create({
      data: {
        name: dto.name,
        age: dto.age !== undefined ? BigInt(dto.age) : undefined,
        nation: dto.nation,
        parish,
        cathedral: dto.cathedral,
        phone: dto.phone,
        emergencyNum: dto.emergencyNum,
        profile: dto.profile,
        qr: dto.qr,
        diocese: dto.diocese ?? null,
        chosenDiocese: dto.chosenDiocese,
        region,
      },
    });
    return serializeMember(created as unknown as Record<string, unknown>);
  }

  async update(id: number, dto: UpdateMemberDto, user: RequestUser) {
    const row = await this.findOne(id, user);

    // manager는 본인 본당 데이터만 수정 가능
    if (user.role === 'manager' && row.parish !== user.nave) {
      throw new ForbiddenException('본인 본당의 데이터만 수정할 수 있습니다');
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
        ...(dto.diocese !== undefined && { diocese: dto.diocese }),
        ...(dto.chosenDiocese !== undefined && { chosenDiocese: dto.chosenDiocese }),
        ...(dto.region !== undefined && { region: dto.region }),
      },
    });
    return serializeMember(updated as unknown as Record<string, unknown>);
  }

  async remove(id: number, user: RequestUser) {
    const row = await this.findOne(id, user);

    // manager는 본인 본당 데이터만 삭제 가능
    if (user.role === 'manager' && row.parish !== user.nave) {
      throw new ForbiddenException('본인 본당의 데이터만 삭제할 수 있습니다');
    }

    await this.prisma.member.delete({ where: { id: BigInt(id) } });
    return { message: `ID ${id} 삭제 완료` };
  }
}
