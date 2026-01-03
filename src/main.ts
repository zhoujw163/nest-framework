import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { VERSION_NEUTRAL, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 配置路由前缀、版本
  const prefix = configService.get<string>('PREFIX', '/api');
  app.setGlobalPrefix(prefix);

  const versionStr = configService.get<string>('VERSION');
  let version = [] as string[];
  if (versionStr && versionStr.indexOf(',')) {
    version = versionStr.split(',');
  }
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion:
      typeof versionStr === 'undefined' ? VERSION_NEUTRAL : version,
  });

  // 配置cors
  const corsFlag = configService.get<string>('CORS');
  if (corsFlag === 'true') {
    app.enableCors();
  }

  // 开启全局日志
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  // 开启全局异常过滤器
  const errorFilterFlag = configService.get<string>('ERROR_FILTER');
  if (errorFilterFlag === 'true') {
    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionFilter(httpAdapter));
  }

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}

bootstrap();
