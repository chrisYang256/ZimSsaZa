import * as path from 'path';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { HttpExceptionFilter } from './http-exception.filter';
import { join } from 'path';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;

  app.useGlobalFilters(new HttpExceptionFilter());

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }
  
  if (process.env.NODE_ENV === 'production') { 
    app.enableCors({
      origin: ['https://zimssaza.com'],
      credentials: true,
    }); 
  } else {
    app.enableCors({
      origin: true,
      credentials: true,
    });
  }
  
  const config = new DocumentBuilder()
    .addBearerAuth({ 
      type: 'http', 
      scheme: 'bearer', 
      bearerFormat: 'JWT',
    }, 'User-JWT-Auth')
    .addBearerAuth({ 
      type: 'http', 
      scheme: 'bearer', 
      bearerFormat: 'JWT',
    }, 'BusinessPerson-JWT-Auth')
    .setTitle('ZimSsaZa')
    .setDescription(`짐싸자 이사 어플 APIs\n 
      유저 testToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQzMjEyNTg2LCJleHAiOjE2NzQ3NDg1ODZ9.AD18FE1O0-otiDIPZunQIZBN7ArMsmrLI1XLrUFFByc
      사업자 testToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTY0MzIxMjQ3OCwiZXhwIjoxNjc0NzQ4NDc4fQ.Uxk8FGootGAEgDpLLVfiWdY6Dm5JAqOCTqui-uhkUiQ
    `)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.useStaticAssets(join(__dirname, '..', 'img-uploads'), {
    prefix: '/img-uploads',
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  
  await app.listen(port);
  console.log('listening on port:::', port)
}
bootstrap();
