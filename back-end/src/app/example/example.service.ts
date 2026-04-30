import { Injectable } from '@nestjs/common';
import { ExampleDto } from 'src/models/dtos/example/example.dto';

@Injectable()
export class ExampleService {
  getHello(): string {
    return 'Hello from the Example Service!';
  }

  create(exampleDto: ExampleDto) {
    return {
      message: 'Example created successfully',
      data: exampleDto,
    };
  }
}
