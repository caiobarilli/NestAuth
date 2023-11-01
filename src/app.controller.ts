import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  showVersion() {
    return 'API v1.0.0';
  }
}
