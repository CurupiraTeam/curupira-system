import { Controller, Get, Post, Body } from '@nestjs/common';
import { ExampleService } from './example.service';
import { ExampleDto } from 'src/models/dtos/example/example.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Example')
@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  @ApiOperation({ summary: 'Get a hello message' })
  getHello(): string {
    return this.exampleService.getHello();
  }

  @Post()
  @ApiOperation({ summary: 'Create an example item' })
  create(@Body() exampleDto: ExampleDto) {
    return this.exampleService.create(exampleDto);
  }
}
