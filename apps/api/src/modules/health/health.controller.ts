import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DataSource } from 'typeorm';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @ApiOperation({ summary: 'Check API and database health status' })
  async check() {
    try {
      if (!this.dataSource.isInitialized) {
        throw new HttpException(
          {
            status: 'error',
            database: 'not_initialized',
            timestamp: new Date().toISOString(),
          },
          HttpStatus.SERVICE_UNAVAILABLE
        );
      }

      // Test database connection
      await this.dataSource.query('SELECT 1');

      // Check PostGIS extension
      let postgisVersion: string | null = null;
      try {
        const postgisRes = await this.dataSource.query('SELECT PostGIS_Version() as version');
        postgisVersion = postgisRes[0]?.version ?? null;
      } catch {
        postgisVersion = 'not installed or disabled';
      }

      return {
        status: 'ok',
        database: 'connected',
        postgis: postgisVersion,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      throw new HttpException(
        {
          status: 'error',
          database: 'disconnected',
          error: error?.message || 'Database connection error',
          timestamp: new Date().toISOString(),
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}
