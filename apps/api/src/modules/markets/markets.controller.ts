import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MarketsService } from './markets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('markets')
@Controller('markets')
export class MarketsController {
  constructor(private readonly marketsService: MarketsService) {}

  @Get()
  @ApiOperation({ summary: 'List all participating markets' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async list(
    @Query('city') city?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20
  ) {
    return this.marketsService.findAll({ city, page: +page, limit: +limit });
  }

  @Get(':idOrSlug')
  @ApiOperation({ summary: 'Get market by ID or slug' })
  async get(@Param('idOrSlug') idOrSlug: string) {
    return this.marketsService.findOne(idOrSlug);
  }

  @Get(':marketId/stalls')
  @ApiOperation({ summary: 'List stalls in a market' })
  async getStalls(
    @Param('marketId') marketId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 50
  ) {
    return this.marketsService.findStalls(marketId, +page, +limit);
  }

  @Get(':marketId/panoramas')
  @ApiOperation({ summary: 'Get all published 360° panoramas for a market' })
  async getPanoramas(@Param('marketId') marketId: string) {
    return this.marketsService.findPanoramas(marketId);
  }

  @Get(':marketId/navigate')
  @ApiOperation({ summary: 'Calculate indoor route between two navigation nodes' })
  @ApiQuery({ name: 'from', required: true })
  @ApiQuery({ name: 'to', required: true })
  async navigate(
    @Param('marketId') marketId: string,
    @Query('from') fromNodeId: string,
    @Query('to') toNodeId: string
  ) {
    return this.marketsService.calculateRoute(marketId, fromNodeId, toNodeId);
  }
}
