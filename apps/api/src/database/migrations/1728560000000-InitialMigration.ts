import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1728560000000 implements MigrationInterface {
  name = 'InitialMigration1728560000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS postgis;`);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "full_name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "phone" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "roles" text NOT NULL DEFAULT 'customer',
        "account_status" character varying NOT NULL DEFAULT 'pending_verification',
        "avatar_url" character varying,
        "last_login" TIMESTAMP WITH TIME ZONE,
        "email_verified" boolean NOT NULL DEFAULT false,
        "phone_verified" boolean NOT NULL DEFAULT false,
        "two_factor_enabled" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "UQ_users_phone" UNIQUE ("phone")
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_email" ON "users" ("email");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_users_phone" ON "users" ("phone");
    `);

    // Create markets table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "markets" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "description" text NOT NULL,
        "city" character varying NOT NULL,
        "state" character varying NOT NULL,
        "country" character varying NOT NULL DEFAULT 'Nigeria',
        "location" jsonb NOT NULL,
        "boundary" jsonb NOT NULL DEFAULT '[]',
        "thumbnail_url" character varying,
        "image_urls" text NOT NULL DEFAULT '',
        "categories" text NOT NULL DEFAULT '',
        "total_stalls" integer NOT NULL DEFAULT 0,
        "mapped_stalls" integer NOT NULL DEFAULT 0,
        "verified_stalls" integer NOT NULL DEFAULT 0,
        "has_navigation" boolean NOT NULL DEFAULT false,
        "operating_hours" jsonb NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_markets_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_markets_slug" UNIQUE ("slug")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "markets";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users";`);
  }
}
