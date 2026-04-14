import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateChurchgoerDto {
  @ApiPropertyOptional({ example: '홍길동' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '프란치스코' })
  @IsOptional()
  @IsString()
  baptismalName?: string;

  @ApiPropertyOptional({ example: '010-1234-5678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '서울시 강남구' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '명동본당' })
  @IsOptional()
  @IsString()
  parish?: string;

  @ApiPropertyOptional({ example: '1구역' })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiPropertyOptional({ example: '3반' })
  @IsOptional()
  @IsString()
  ban?: string;

  @ApiPropertyOptional({ example: '부부+자녀' })
  @IsOptional()
  @IsString()
  familyType?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  childrenCount?: number;

  @ApiPropertyOptional({ example: '조부모 동거' })
  @IsOptional()
  @IsString()
  familyTypeOther?: string;

  @ApiPropertyOptional({ example: '아파트' })
  @IsOptional()
  @IsString()
  housingType?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  housingTypeOther?: string;

  @ApiPropertyOptional({ example: '상관없음' })
  @IsOptional()
  @IsString()
  pilgrimGender?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  clergyAcceptable?: boolean;

  @ApiPropertyOptional({ example: '독립된 방' })
  @IsOptional()
  @IsString()
  bedroomType?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  bedCount?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  futonCount?: number;

  @ApiPropertyOptional({ example: '단독' })
  @IsOptional()
  @IsString()
  bathroomType?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasPet?: boolean;

  @ApiPropertyOptional({ example: '강아지' })
  @IsOptional()
  @IsString()
  petType?: string;

  @ApiPropertyOptional({ example: '실내' })
  @IsOptional()
  @IsString()
  petLocation?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasWifi?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasWasher?: boolean;

  @ApiPropertyOptional({ example: '금연 가정' })
  @IsOptional()
  @IsString()
  smokingPolicy?: string;

  @ApiPropertyOptional({ example: '자가 차량' })
  @IsOptional()
  @IsString()
  transportationType?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  breakfastAvailable?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  dinnerAvailable?: boolean;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  availableRooms?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxCapacity?: number;

  @ApiPropertyOptional({ example: '비고 메모' })
  @IsOptional()
  @IsString()
  notes?: string;
}
