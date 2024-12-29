import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from '@flick-finder/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  @ApiOkResponse({
    description: 'Health Check',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
