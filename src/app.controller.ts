import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot(): string {
    return 'Welcome to MFB Backend!';
  }

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
