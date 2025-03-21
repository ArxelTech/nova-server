import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  app.use(morgan('combined'));
  app.enableCors();

  const configService = app.get(ConfigService);
  const PORT = +configService.get('PORT');

  const config = new DocumentBuilder()
    .setTitle('Nova API example')
    .setDescription('The Nova API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentation', app, document);

  await app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
bootstrap();
