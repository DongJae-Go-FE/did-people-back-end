import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChurchgoerDto } from './dto/create-churchgoer.dto';
import { ChurchgoerQueryDto } from './dto/churchgoer-query.dto';
import { UpdateChurchgoerDto } from './dto/update-churchgoer.dto';

export interface RequestUser {
  id: string;
  email: string;
  role: string;
  region: string | null;
  nave: string | null;
}

function serializeChurchgoer(row: Record<string, unknown>): Record<string, unknown> {
  return {
    ...row,
    id: row.id !== undefined ? Number(row.id) : row.id,
    availableRooms:
      row.availableRooms !== undefined && row.availableRooms !== null
        ? Number(row.availableRooms)
        : row.availableRooms,
    maxCapacity:
      row.maxCapacity !== undefined && row.maxCapacity !== null
        ? Number(row.maxCapacity)
        : row.maxCapacity,
  };
}

@Injectable()
export class ChurchgoersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ChurchgoerQueryDto, user: RequestUser) {
    const { pageIndex = 0, pageSize = 20, name, parish, homestayAvailable } = query;
    const skip = pageIndex * pageSize;

    const where: Record<string, unknown> = {};

    // nave 기반 접근 제어: manager는 본인 nave(본당)의 데이터만 조회
    if (user.role === 'manager') {
      where.parish = user.nave;
    } else if (parish) {
      where.parish = { contains: parish, mode: 'insensitive' };
    }

    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (homestayAvailable === 'true') where.homestayAvailable = true;
    if (homestayAvailable === 'false') where.homestayAvailable = false;

    const [data, totalCount] = await Promise.all([
      this.prisma.churchgoer.findMany({ where, skip, take: pageSize, orderBy: { id: 'desc' } }),
      this.prisma.churchgoer.count({ where }),
    ]);

    return {
      data: data.map((row) => serializeChurchgoer(row as unknown as Record<string, unknown>)),
      meta: {
        totalCount,
        pageIndex,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }

  async findOne(id: number, user: RequestUser) {
    const row = await this.prisma.churchgoer.findUnique({ where: { id: BigInt(id) } });
    if (!row) throw new NotFoundException(`ID ${id}에 해당하는 데이터가 없습니다`);
    return serializeChurchgoer(row as unknown as Record<string, unknown>);
  }

  async create(dto: CreateChurchgoerDto, user: RequestUser) {
    // manager는 본인 nave(본당)으로만 등록
    const parish = user.role === 'manager' ? user.nave : (dto.parish ?? null);

    const created = await this.prisma.churchgoer.create({
      data: {
        name: dto.name,
        baptismalName: dto.baptismalName,
        phone: dto.phone,
        address: dto.address,
        parish,
        breakfastAvailable: dto.breakfastAvailable ?? false,
        lunchAvailable: dto.lunchAvailable ?? false,
        dinnerAvailable: dto.dinnerAvailable ?? false,
        homestayAvailable: dto.homestayAvailable ?? false,
        mealOnlyAvailable: dto.mealOnlyAvailable ?? false,
        homestayDates: dto.homestayDates,
        availableRooms: dto.availableRooms !== undefined ? BigInt(dto.availableRooms) : undefined,
        maxCapacity: dto.maxCapacity !== undefined ? BigInt(dto.maxCapacity) : undefined,
        notes: dto.notes,
      },
    });
    return serializeChurchgoer(created as unknown as Record<string, unknown>);
  }

  async update(id: number, dto: UpdateChurchgoerDto, user: RequestUser) {
    const row = await this.findOne(id, user);

    // manager는 본인 nave(본당) 데이터만 수정 가능
    if (user.role === 'manager' && row.parish !== user.nave) {
      throw new ForbiddenException('본인 본당의 데이터만 수정할 수 있습니다');
    }

    const updated = await this.prisma.churchgoer.update({
      where: { id: BigInt(id) },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.baptismalName !== undefined && { baptismalName: dto.baptismalName }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.address !== undefined && { address: dto.address }),
        // admin만 parish 변경 가능
        ...(user.role === 'admin' && dto.parish !== undefined && { parish: dto.parish }),
        ...(dto.breakfastAvailable !== undefined && { breakfastAvailable: dto.breakfastAvailable }),
        ...(dto.lunchAvailable !== undefined && { lunchAvailable: dto.lunchAvailable }),
        ...(dto.dinnerAvailable !== undefined && { dinnerAvailable: dto.dinnerAvailable }),
        ...(dto.homestayAvailable !== undefined && { homestayAvailable: dto.homestayAvailable }),
        ...(dto.mealOnlyAvailable !== undefined && { mealOnlyAvailable: dto.mealOnlyAvailable }),
        ...(dto.homestayDates !== undefined && { homestayDates: dto.homestayDates }),
        ...(dto.availableRooms !== undefined && { availableRooms: BigInt(dto.availableRooms) }),
        ...(dto.maxCapacity !== undefined && { maxCapacity: BigInt(dto.maxCapacity) }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });
    return serializeChurchgoer(updated as unknown as Record<string, unknown>);
  }

  async remove(id: number, user: RequestUser) {
    const row = await this.findOne(id, user);

    // manager는 본인 nave(본당) 데이터만 삭제 가능
    if (user.role === 'manager' && row.parish !== user.nave) {
      throw new ForbiddenException('본인 본당의 데이터만 삭제할 수 있습니다');
    }

    await this.prisma.churchgoer.delete({ where: { id: BigInt(id) } });
    return { message: `ID ${id} 삭제 완료` };
  }
}
