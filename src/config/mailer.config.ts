import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule } from '@nestjs/config';
import * as path from 'path';
ConfigModule.forRoot();

export const mailerConfig: MailerOptions = {
  transport: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: `${process.env.SMTP_USER || ''}`,
      pass: `${process.env.SMTP_PASSWORD || ''}`,
    },
  },
  defaults: {
    from: `${process.env.SMTP_FROM || ''}`,
  },
  template: {
    dir: path.resolve(__dirname, '..', '..', 'views'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
