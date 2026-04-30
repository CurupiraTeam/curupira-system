import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExampleDto {
  @ApiProperty({
    description: 'A sample name for the example DTO',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
