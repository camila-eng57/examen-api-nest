import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const newUser = this.usersRepository.create(userData);
    return await this.usersRepository.save(newUser);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    // IMPORTANTE: Aquí sí pedimos el password a la BD para poder compararlo en el login, 
    // pero recuerda que por defecto (select: false) está oculto.
    return await this.usersRepository.findOne({ 
      where: { username },
      select: ['id', 'nombre', 'username', 'password', 'role'] 
    });
  }
}