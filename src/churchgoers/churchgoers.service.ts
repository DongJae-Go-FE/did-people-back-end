import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChurchgoerDto } from './dto/create-churchgoer.dto';
import { ChurchgoerQueryDto } from './dto/churchgoer-query.dto';
import { UpdateChurchgoerDto } from './dto/update-churchgoer.dto';
import { AssignMembersDto } from './dto/assign-members.dto';

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
    childrenCount:
      row.childrenCount !== undefined && row.childrenCount !== null
        ? Number(row.childrenCount)
        : row.childrenCount,
    bedCount:
      row.bedCount !== undefined && row.bedCount !== null
        ? Number(row.bedCount)
        : row.bedCount,
    futonCount:
      row.futonCount !== undefined && row.futonCount !== null
        ? Number(row.futonCount)
        : row.futonCount,
  };
}

@Injectable()
export class ChurchgoersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ChurchgoerQueryDto, user: RequestUser) {
    const { pageIndex = 0, pageSize = 20, name, parish } = query;
    const skip = pageIndex * pageSize;

    const where: Record<string, unknown> = {};

    // nave 기반 접근 제어: manager는 본인 nave(본당)의 데이터만 조회
    if (user.role === 'manager') {
      where.parish = user.nave;
    } else if (parish) {
      where.parish = { contains: parish, mode: 'insensitive' };
    }

    if (name) where.name = { contains: name, mode: 'insensitive' };

    const [data, totalCount] = await Promise.all([
      this.prisma.churchgoer.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { id: 'desc' },
        include: { _count: { select: { assignedMembers: true } } },
      }),
      this.prisma.churchgoer.count({ where }),
    ]);

    return {
      data: data.map((row) => {
        const { _count, ...rest } = row as Record<string, unknown> & { _count: { assignedMembers: number } };
        return { ...serializeChurchgoer(rest), assignedMemberCount: _count.assignedMembers };
      }),
      meta: {
        totalCount,
        pageIndex,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }

  async findOne(id: number, user: RequestUser): Promise<Record<string, unknown>> {
    const row = await this.prisma.churchgoer.findUnique({
      where: { id: BigInt(id) },
      include: {
        assignedMembers: {
          select: { id: true, name: true, age: true, nation: true, parish: true, phone: true },
        },
      },
    });
    if (!row) throw new NotFoundException(`ID ${id}에 해당하는 데이터가 없습니다`);
    const { assignedMembers, ...rest } = row as Record<string, unknown> & { assignedMembers: Array<Record<string, unknown>> };
    return {
      ...serializeChurchgoer(rest),
      assignedMembers: assignedMembers.map((m) => ({
        ...m,
        id: Number(m.id),
        age: m.age !== undefined && m.age !== null ? Number(m.age) : m.age,
      })),
    };
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
        district: dto.district,
        ban: dto.ban,
        familyType: dto.familyType,
        childrenCount: dto.childrenCount !== undefined ? BigInt(dto.childrenCount) : undefined,
        familyTypeOther: dto.familyTypeOther,
        housingType: dto.housingType,
        housingTypeOther: dto.housingTypeOther,
        pilgrimGender: dto.pilgrimGender,
        clergyAcceptable: dto.clergyAcceptable,
        bedroomType: dto.bedroomType,
        bedCount: dto.bedCount !== undefined ? BigInt(dto.bedCount) : undefined,
        futonCount: dto.futonCount !== undefined ? BigInt(dto.futonCount) : undefined,
        bathroomType: dto.bathroomType,
        hasPet: dto.hasPet,
        petType: dto.petType,
        petLocation: dto.petLocation,
        hasWifi: dto.hasWifi,
        hasWasher: dto.hasWasher,
        smokingPolicy: dto.smokingPolicy,
        transportationType: dto.transportationType,
        breakfastAvailable: dto.breakfastAvailable ?? false,
        dinnerAvailable: dto.dinnerAvailable ?? false,
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
        ...(dto.district !== undefined && { district: dto.district }),
        ...(dto.ban !== undefined && { ban: dto.ban }),
        ...(dto.familyType !== undefined && { familyType: dto.familyType }),
        ...(dto.childrenCount !== undefined && { childrenCount: BigInt(dto.childrenCount) }),
        ...(dto.familyTypeOther !== undefined && { familyTypeOther: dto.familyTypeOther }),
        ...(dto.housingType !== undefined && { housingType: dto.housingType }),
        ...(dto.housingTypeOther !== undefined && { housingTypeOther: dto.housingTypeOther }),
        ...(dto.pilgrimGender !== undefined && { pilgrimGender: dto.pilgrimGender }),
        ...(dto.clergyAcceptable !== undefined && { clergyAcceptable: dto.clergyAcceptable }),
        ...(dto.bedroomType !== undefined && { bedroomType: dto.bedroomType }),
        ...(dto.bedCount !== undefined && { bedCount: BigInt(dto.bedCount) }),
        ...(dto.futonCount !== undefined && { futonCount: BigInt(dto.futonCount) }),
        ...(dto.bathroomType !== undefined && { bathroomType: dto.bathroomType }),
        ...(dto.hasPet !== undefined && { hasPet: dto.hasPet }),
        ...(dto.petType !== undefined && { petType: dto.petType }),
        ...(dto.petLocation !== undefined && { petLocation: dto.petLocation }),
        ...(dto.hasWifi !== undefined && { hasWifi: dto.hasWifi }),
        ...(dto.hasWasher !== undefined && { hasWasher: dto.hasWasher }),
        ...(dto.smokingPolicy !== undefined && { smokingPolicy: dto.smokingPolicy }),
        ...(dto.transportationType !== undefined && { transportationType: dto.transportationType }),
        ...(dto.breakfastAvailable !== undefined && { breakfastAvailable: dto.breakfastAvailable }),
        ...(dto.dinnerAvailable !== undefined && { dinnerAvailable: dto.dinnerAvailable }),
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

  async assignMembers(churchgoerId: number, dto: AssignMembersDto, user: RequestUser) {
    await this.findOne(churchgoerId, user);
    await this.prisma.member.updateMany({
      where: { id: { in: dto.memberIds.map((id) => BigInt(id)) } },
      data: { assignedChurchgoerId: BigInt(churchgoerId) },
    });
    return this.findOne(churchgoerId, user);
  }

  async unassignMember(churchgoerId: number, memberId: number, user: RequestUser) {
    await this.findOne(churchgoerId, user);
    await this.prisma.member.update({
      where: { id: BigInt(memberId) },
      data: { assignedChurchgoerId: null },
    });
    return { message: `멤버 ${memberId} 배정 해제 완료` };
  }

  async getAssignedMembers(churchgoerId: number, user: RequestUser) {
    await this.findOne(churchgoerId, user);
    const members = await this.prisma.member.findMany({
      where: { assignedChurchgoerId: BigInt(churchgoerId) },
      select: { id: true, name: true, age: true, nation: true, parish: true, phone: true },
    });
    return members.map((m) => ({
      ...m,
      id: Number(m.id),
      age: m.age !== undefined && m.age !== null ? Number(m.age) : m.age,
    }));
  }
}
