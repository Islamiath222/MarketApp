import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketsController } from './markets.controller';
import { MarketsService } from './markets.service';
import { MarketEntity } from './market.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MarketEntity])],
  controllers: [MarketsController],
  providers: [MarketsService],
  exports: [MarketsService],
})
export class MarketsModule {}
