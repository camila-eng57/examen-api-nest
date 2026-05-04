import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ unique: true })
  username: string;

  @Column({ select: false }) // RESTRICCIÓN: No exponer contraseñas
  password: string;

  @Column({ default: 'USER' }) // REGLA: Todos los nuevos -> USER
  role: string;
}