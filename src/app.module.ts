import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres', // Cambiado a postgres
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '24974', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      ssl: true, // Requerido por Aiven
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    }),
  ],
})
export class AppModule {}