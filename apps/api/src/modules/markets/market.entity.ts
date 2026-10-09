import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('markets')
export class MarketEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index({ unique: true })
  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ default: 'Nigeria' })
  country: string;

  // PostGIS point: stored as {lat, lng} JSON for now, migrate to PostGIS POINT later
  @Column({ type: 'jsonb' })
  location: { lat: number; lng: number };

  @Column({ type: 'jsonb', default: '[]' })
  boundary: Array<{ lat: number; lng: number }>;

  @Column({ name: 'thumbnail_url', nullable: true, type: 'varchar' })
  thumbnailUrl: string | null;

  @Column({ name: 'image_urls', type: 'simple-array', default: '' })
  imageUrls: string[];

  @Column({ type: 'simple-array', default: '' })
  categories: string[];

  @Column({ name: 'total_stalls', default: 0 })
  totalStalls: number;

  @Column({ name: 'mapped_stalls', default: 0 })
  mappedStalls: number;

  @Column({ name: 'verified_stalls', default: 0 })
  verifiedStalls: number;

  @Column({ name: 'has_navigation', default: false })
  hasNavigation: boolean;

  @Column({ name: 'operating_hours', type: 'jsonb' })
  operatingHours: Record<string, { open: string; close: string } | null>;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
