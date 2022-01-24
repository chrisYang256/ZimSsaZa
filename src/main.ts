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
      유저 testToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQzMDQwNjk0LCJleHAiOjE2NzQ1NzY2OTR9.tSS_uJkvgkwstqT6Voj7uJLCEYfZgSfB8pRejAG-39o
      사업자 testToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTY0MzA0MDczNSwiZXhwIjoxNjc0NTc2NzM1fQ.RXoAa2iaElz-qR5g9ed0iM2HEiuugrmcBmKxzEDLwnc
    `)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  
  app.useStaticAssets(join(__dirname, '..', 'img-uploads'), {
    prefix: '/img-uploads',
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  
  await app.listen(port);
  console.log('listening on port:::', port)
}
bootstrap();
