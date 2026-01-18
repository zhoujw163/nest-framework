import { Controller, Get } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { MailerService } from '@nestjs-modules/mailer';

@Controller()
export class AppController {
  constructor(private readonly mailerService: MailerService) {}

  @InjectRedis()
  private readonly redis: Redis;

  @Get()
  async getHello() {
    const res = await this.redis.get('hello');
    return res;
  }

  @Get('mail')
  sendMail(): void {
    this.mailerService
      .sendMail({
        to: '1227364071@qq.com',
        from: 'joaha@qq.com',
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'welcome', // The `.pug`, `.ejs` or `.hbs` extension is appended automatically.
        context: {
          // Data to be sent to template engine.
          name: 'joaha',
        },
      })
      .then(() => {
        console.log('邮件发送成功');
      })
      .catch((err) => {
        console.log('邮件发送失败', err);
      });
  }
}
