import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { consoleTransport, createRotateTransport } from './createTransport';

@Module({
  imports: [
    // 异步加载配置
    WinstonModule.forRootAsync({
      // inject 异步加载 ConfigService 到 useFactory 中
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const logOn = configService.get('LOG_ON') === 'true';
        return {
          transports: [
            consoleTransport,
            ...(logOn
              ? [
                  createRotateTransport({
                    level: 'info',
                    filename: 'application',
                  }),
                  createRotateTransport({
                    level: 'warn',
                    filename: 'error',
                  }),
                ]
              : []),
          ],
        };
      },
    }),
  ],
})
export class LogsModule {}
