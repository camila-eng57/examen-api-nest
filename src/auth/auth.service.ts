import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const userExists = await this.usersService.findOneByUsername(registerDto.username);
    if (userExists) {
      throw new BadRequestException('El usuario ya existe');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // Crear usuario (el rol se pondrá en 'USER' automáticamente por la entidad)
    const newUser = await this.usersService.create({
      nombre: registerDto.nombre,
      username: registerDto.username,
      password: hashedPassword,
    });

    // Separamos la contraseña para no devolverla en la respuesta
    const { password, ...result } = newUser;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByUsername(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña encriptada
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Crear el JWT con los datos exactos que pide el examen
    const payload = { id: user.id, username: user.username, role: user.role };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}