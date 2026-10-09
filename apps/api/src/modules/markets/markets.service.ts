import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { MarketEntity } from './market.entity';

@Injectable()
export class MarketsService {
  constructor(
    @InjectRepository(MarketEntity)
    private readonly marketRepo: Repository<MarketEntity>
  ) {}

  async findAll(params: { city?: string; page: number; limit: number }) {
    const { city, page, limit } = params;
    const skip = (page - 1) * limit;

    const where = city ? { city: ILike(`%${city}%`), isActive: true } : { isActive: true };

    const [data, total] = await this.marketRepo.findAndCount({
      where,
      order: { name: 'ASC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      hasMore: skip + data.length < total,
    };
  }

  async findOne(idOrSlug: string) {
    const market = await this.marketRepo.findOne({
      where: [{ id: idOrSlug }, { slug: idOrSlug }],
    });

    if (!market) {
      throw new NotFoundException(`Market "${idOrSlug}" not found`);
    }

    return { data: market, success: true };
  }

  async findStalls(marketId: string, page: number, limit: number) {
    // TODO: wire up StallEntity once created
    return { data: [], total: 0, page, limit, hasMore: false };
  }

  async findPanoramas(marketId: string) {
    // TODO: wire up PanoramaEntity once created
    return { data: [], success: true };
  }

  async calculateRoute(
    marketId: string,
    fromNodeId: string,
    toNodeId: string
  ) {
    // TODO: implement Dijkstra/pgRouting-based indoor routing
    // For now return a placeholder
    return {
      data: {
        steps: [
          { nodeId: fromNodeId, nodeLabel: 'Start', instruction: 'Head forward', distanceMeters: 0 },
          { nodeId: toNodeId, nodeLabel: 'Destination', instruction: 'You have arrived', distanceMeters: 50 },
        ],
        totalDistanceMeters: 50,
        estimatedMinutes: 1,
      },
      success: true,
    };
  }
}
