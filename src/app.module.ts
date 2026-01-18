import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './common/config/config.module';
import { LogsModule } from './common/logger/logs.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService } from '@nestjs/config';
import { MailModule } from './common/mail/mail.module';

@Module({
  imports: [
    ConfigModule,
    LogsModule,
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: configService.get<string>('REDIS_URL'),
        options: {
          password: configService.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    MailModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
