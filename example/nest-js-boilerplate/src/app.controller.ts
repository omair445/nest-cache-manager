import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Cache } from 'nest-cache-manager';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Cache('hello_world', 60)
  getHello() {
    return {
      message: 'Hello World',
    };
  }
}
