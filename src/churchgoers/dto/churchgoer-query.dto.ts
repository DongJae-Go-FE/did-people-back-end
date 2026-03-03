import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class ChurchgoerQueryDto {
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

  @ApiPropertyOptional({ example: '명동본당' })
  @IsOptional()
  @IsString()
  parish?: string;

  @ApiPropertyOptional({ description: '홈스테이 가능 여부: true / false' })
  @IsOptional()
  @IsString()
  homestayAvailable?: string;
}
