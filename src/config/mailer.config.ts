import { MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

export const mailerConfig: MailerOptions = {
  transport: {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: '',
      pass: '',
    },
  },
  defaults: {
    from: '"CEO" <email@gmail.com>',
  },
  template: {
    dir: path.resolve(__dirname, '..', '..', 'views'),
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
};
