import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({
       whitelist: true, // automatically remove field ouside DTO
      forbidNonWhitelisted: true, // will give error to extra unexpected field 
      transform: true, // help to payload transform 
  }));  

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

   
  await app.listen(process.env.PORT ?? 3000);
  console.log("Server Running On: http://localhost:3000")
}
bootstrap();
