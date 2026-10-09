import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // web
      'http://localhost:3001', // seller portal
      'http://localhost:3002', // market admin
      'http://localhost:3003', // platform admin
      process.env['FRONTEND_URL'] ?? '*',
    ],
    credentials: true,
  });

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('MarketApp API')
    .setDescription(
      'REST API for MarketApp — digital marketplace for physical markets'
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication and user management')
    .addTag('markets', 'Market discovery and data')
    .addTag('stalls', 'Stall and shop management')
    .addTag('navigation', 'Indoor navigation and routing')
    .addTag('panoramas', '360° imagery and hotspots')
    .addTag('catalog', 'Product catalog management')
    .addTag('search', 'Search and discovery')
    .addTag('chat', 'Customer-to-shop messaging')
    .addTag('offers', 'Price negotiation and offers')
    .addTag('orders', 'Order management')
    .addTag('payments', 'Payment processing')
    .addTag('fulfillment', 'Order fulfillment and delivery')
    .addTag('reviews', 'Ratings and reviews')
    .addTag('disputes', 'Dispute resolution')
    .addTag('notifications', 'Notification management')
    .addTag('admin', 'Platform administration')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env['PORT'] ?? 4000;
  await app.listen(port);
  console.log(`🚀 MarketApp API running on http://localhost:${port}/api/v1`);
  console.log(`📚 API docs at http://localhost:${port}/api/docs`);
}

bootstrap();
