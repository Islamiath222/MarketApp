import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { AccountStatus, UserRole } from '@marketapp/types';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name' })
  fullName: string;

  @Index({ unique: true })
  @Column({ unique: true })
  email: string;

  @Index({ unique: true })
  @Column({ unique: true })
  phone: string; // E.164 format

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'simple-array',
    default: UserRole.CUSTOMER,
  })
  roles: UserRole[];

  @Column({
    name: 'account_status',
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.PENDING_VERIFICATION,
  })
  accountStatus: AccountStatus;

  @Column({ name: 'avatar_url', nullable: true, type: 'varchar' })
  avatarUrl: string | null;

  @Column({ name: 'last_login', nullable: true, type: 'timestamptz' })
  lastLogin: Date | null;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'phone_verified', default: false })
  phoneVerified: boolean;

  @Column({ name: 'two_factor_enabled', default: false })
  twoFactorEnabled: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
