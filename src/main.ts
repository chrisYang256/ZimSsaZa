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
    }, 'JWT-Auth')
    .setTitle('ZimSsaZa')
    .setDescription(`짐싸자 이사 어플 APIs\n 
      유저 testToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQyMzQwNzgzLCJleHAiOjE2NzM4NzY3ODN9.FDuK-fR6rLLFa4Tmb9uNZdPHeRRaohCPNDrd__O-DZU
      사업자 testToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjQyMDgxMDk1LCJleHAiOjE2NzM2MTcwOTV9.NNAi3TxKTQNLdFvYJHKCP1ornyw2qakG35bsbhI4A7A
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
