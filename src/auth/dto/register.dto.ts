import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Juan Perez' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'juanito123' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'secreta123' })
  @IsString()
  @MinLength(6)
  password: string;
  // RESTRICCIÓN DEL EXAMEN: El rol NO se recibe aquí.
}
