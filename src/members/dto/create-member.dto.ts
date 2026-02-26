import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateMemberDto {
  @ApiProperty({ example: '홍길동' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  age?: number;

  @ApiPropertyOptional({ example: '한국' })
  @IsOptional()
  @IsString()
  nation?: string;

  @ApiPropertyOptional({ example: '답동본당' })
  @IsOptional()
  @IsString()
  parish?: string;

  @ApiPropertyOptional({ example: '답동성당' })
  @IsOptional()
  @IsString()
  cathedral?: string;

  @ApiPropertyOptional({ example: '010-1234-5678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '010-9999-0000' })
  @IsOptional()
  @IsString()
  emergencyNum?: string;

  @ApiPropertyOptional({ example: 'https://...' })
  @IsOptional()
  @IsString()
  profile?: string;

  @ApiPropertyOptional({ example: 'https://...' })
  @IsOptional()
  @IsString()
  qr?: string;

  @ApiPropertyOptional({ example: '인천교구' })
  @IsOptional()
  @IsString()
  chosenDiocese?: string;

  @ApiPropertyOptional({ example: '인천' })
  @IsOptional()
  @IsString()
  region?: string;
}
