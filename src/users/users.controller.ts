import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport'; // Este es el guard de JWT
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth() // Activa el candado de seguridad en Swagger
@UseGuards(AuthGuard('jwt'), RolesGuard) // Protege TODOS los endpoints de este controlador
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. POST /users -> Solo DEVELOPER
  @Post()
  @Roles('DEVELOPER')
  @ApiOperation({ summary: 'Crear usuario desde panel (Solo DEVELOPER)' })
  @ApiResponse({ status: 201, description: 'Usuario creado.' })
  @ApiResponse({ status: 403, description: 'Prohibido. Requiere rol DEVELOPER.' })
  create(@Body() createUserDto: Partial<User>) {
    // Nota: Como es parcial, el servicio ya se encarga del registro base
    return this.usersService.create(createUserDto);
  }

  // 2. GET /users -> Lógica especial: ADMIN/DEV ven todos, USER ve el suyo
  @Get()
  @ApiOperation({ summary: 'Consultar usuarios (Lógica según rol)' })
  async findAll(@Request() req) {
    const userRole = req.user.role;
    const userId = req.user.id;

    if (userRole === 'ADMIN' || userRole === 'DEVELOPER') {
      // Si es admin o dev, usamos el repositorio para traer a todos
      // (Aquí deberíamos tener un findAll en el servicio, lo simulamos pidiendo todos sin filtro)
      return "Para el examen: Retornar lista completa (implementar findAll en UsersService)";
    } 
    
    if (userRole === 'USER') {
      // Si es USER, solo retorna su propio perfil simulado
      return `Perfil de usuario ID: ${userId} (implementar findOneById en UsersService)`;
    }

    throw new ForbiddenException('Rol no reconocido');
  }

  // 3. PATCH /users/:id -> Solo DEVELOPER
  @Patch(':id')
  @Roles('DEVELOPER')
  @ApiOperation({ summary: 'Actualizar usuario (Solo DEVELOPER)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: Partial<User>) {
    return `Actualizar usuario ${id} (implementar update en UsersService)`;
  }

  // 4. DELETE /users/:id -> Solo ADMIN
  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Eliminar usuario (Solo ADMIN)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return `Eliminar usuario ${id} (implementar delete en UsersService)`;
  }

  // 5. PATCH /users/:id/make-admin -> Solo ADMIN promueve a ADMIN
  @Patch(':id/make-admin')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Promover usuario a ADMIN (Solo ADMIN)' })
  makeAdmin(@Param('id', ParseIntPipe) id: number) {
    return `Promover usuario ${id} a ADMIN (implementar lógica en UsersService)`;
  }
}