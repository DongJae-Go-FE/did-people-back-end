import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class MemberQueryDto {
  @ApiPropertyOptional({ default: 0, description: '페이지 인덱스 (0부터 시작)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  pageIndex?: number = 0;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;

  @ApiPropertyOptional({ example: '홍길동' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '답동본당' })
  @IsOptional()
  @IsString()
  parish?: string;

  @ApiPropertyOptional({ example: '답동성당' })
  @IsOptional()
  @IsString()
  cathedral?: string;

  @ApiPropertyOptional({ example: '인천교구' })
  @IsOptional()
  @IsString()
  chosenDiocese?: string;

  @ApiPropertyOptional({ example: '인천', description: 'admin만 타지역 조회 가능' })
  @IsOptional()
  @IsString()
  region?: string;
}
