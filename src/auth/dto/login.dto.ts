import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'juanito123' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'secreta123' })
  @IsString()
  @IsNotEmpty()
  password: string;
}