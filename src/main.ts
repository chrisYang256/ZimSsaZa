import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { HttpExceptionFilter } from './http-exception.filter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT || 3000;
  
  const config = new DocumentBuilder()
  .setTitle('ZimSsaZa')
  .setDescription('짐싸자 이사 어플 APIs')
  .setVersion('1.0')
  // .addTag('ZimSsaZa')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  app.useGlobalFilters(new HttpExceptionFilter());
  
  await app.listen(port);
  console.log('listening on port:::', port)
}
bootstrap();
