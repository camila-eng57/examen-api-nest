import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'super_secreto_para_el_examen_123',
    });
  }

  async validate(payload: any) {
    // Esto inyecta el id, username y role en cada petición protegida
    return { id: payload.id, username: payload.username, role: payload.role };
  }
}