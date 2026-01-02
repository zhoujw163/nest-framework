import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import Joi from 'joi';

const envFilePath = [`.env.${process.env.NODE_ENV}`, '.env'];

const joiSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().ip(),
});

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath,
      validationSchema: joiSchema,
    }),
  ],
})
export class ConfigModule {}
