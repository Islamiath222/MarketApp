import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MarketsModule } from './modules/markets/markets.module';
import { StallsModule } from './modules/stalls/stalls.module';
import { NavigationModule } from './modules/navigation/navigation.module';
import { PanoramaModule } from './modules/panorama/panorama.module';
import { SellersModule } from './modules/sellers/sellers.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { SearchModule } from './modules/search/search.module';
import { ChatModule } from './modules/chat/chat.module';
import { OffersModule } from './modules/offers/offers.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { FulfillmentModule } from './modules/fulfillment/fulfillment.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { RiskModule } from './modules/risk/risk.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASSWORD', 'password'),
        database: config.get('DB_NAME', 'marketapp'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: false,
        logging: config.get('DB_LOGGING') === 'true',
        extra: {
          max: 20,
        },
      }),
    }),

    // Throttling (rate limiting)
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Event emitter
    EventEmitterModule.forRoot(),

    // Task scheduling
    ScheduleModule.forRoot(),

    // Feature modules
    HealthModule,
    AuthModule,
    UsersModule,
    MarketsModule,
    StallsModule,
    NavigationModule,
    PanoramaModule,
    SellersModule,
    CatalogModule,
    SearchModule,
    ChatModule,
    OffersModule,
    OrdersModule,
    PaymentsModule,
    FulfillmentModule,
    ReviewsModule,
    DisputesModule,
    NotificationsModule,
    AdminModule,
    RiskModule,
    AuditModule,
  ],
})
export class AppModule {}
