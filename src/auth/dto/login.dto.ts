import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin_user' })
  @IsString()
  username: string;

  @ApiProperty({ example: 'yourpassword' })
  @IsString()
  password: string;
}
