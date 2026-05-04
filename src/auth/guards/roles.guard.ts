import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true; // Si la ruta no pide rol, lo deja pasar
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('Token inválido o ausente');
    }
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`Acceso denegado. Se requiere ser: ${requiredRoles.join(' o ')}`);
    }
    return true;
  }
}