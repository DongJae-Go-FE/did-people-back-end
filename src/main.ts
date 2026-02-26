import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // BigInt 직렬화: 프로토타입 오염 없이 replacer로 처리
    bodyParser: true,
  });

  // BigInt → string 직렬화 (프로토타입 수정 없이 NestJS 응답 인터셉터 방식)
  const httpAdapter = app.getHttpAdapter();
  const expressInstance = httpAdapter.getInstance();
  expressInstance.set('json replacer', (_key: string, value: unknown) =>
    typeof value === 'bigint' ? value.toString() : value,
  );

  // CORS
  // CORS_ALLOW_ALL=true 일 때만 전체 허용 (개발 로컬 전용)
  // 스테이징/프로덕션은 ALLOWED_ORIGINS 목록으로 제한
  const allowAll = process.env.CORS_ALLOW_ALL === 'true';
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ?? 'http://localhost:3001'
  ).split(',').map((o) => o.trim());
  app.enableCors({
    origin: allowAll ? true : allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger (프로덕션에서는 비활성화)
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('did-db API')
      .setDescription('NestJS backend for did-db')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application running on http://localhost:${port}`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
}
bootstrap();
