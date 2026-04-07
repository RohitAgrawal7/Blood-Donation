import { Module } from '@nestjs/common';
import { DonorsModule } from './donors/donors.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonorEntity } from './donors/donor.entity';
import * as path from 'path';

const sqlitePath = process.env.TYPEORM_DATABASE || path.resolve(process.cwd(), 'data', 'db.sqlite');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: sqlitePath,
      entities: [DonorEntity],
      synchronize: true, // dev only
      logging: false,
    }),
    DonorsModule,
    AuthModule,
  ],
})
export class AppModule {}
