import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin_user' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'yourpassword' })
  @IsString()
  password: string;

  // 로그인 URL에 대응하는 요구 교구: 'incheon' | 'jeju' | 'super'.
  // 'super'는 region=null 계정만 허용.
  @ApiPropertyOptional({ example: 'incheon', enum: ['incheon', 'jeju', 'super'] })
  @IsOptional()
  @IsString()
  @IsIn(['incheon', 'jeju', 'super'])
  requiredRegion?: 'incheon' | 'jeju' | 'super';
}
