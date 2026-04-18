import { Module } from '@nestjs/common';
import { DonorsModule } from './donors/donors.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonorEntity } from './donors/donor.entity';

// Enforce Postgres-only configuration: require DATABASE_URL for Supabase.
const databaseUrl = process.env.DATABASE_URL || process.env.TYPEORM_URL || process.env.SUPABASE_DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL (Supabase/Postgres) is required in environment. Set DATABASE_URL in backend/.env'
  );
}

const typeormConfig = {
  type: 'postgres' as const,
  url: databaseUrl,
  ssl: process.env.TYPEORM_SSL === 'false' ? false : { rejectUnauthorized: false },
  entities: [DonorEntity],
  synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
  logging: false,
};

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig as any), DonorsModule, AuthModule],
})
export class AppModule {}
