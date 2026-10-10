import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { UserEntity } from '../modules/users/user.entity';
import { MarketEntity } from '../modules/markets/market.entity';
import { InitialMigration1728560000000 } from './migrations/1728560000000-InitialMigration';

// Load .env
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx !== -1) {
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'marketapp_user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'marketapp',
  entities: [UserEntity, MarketEntity],
  migrations: [InitialMigration1728560000000],
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
});
