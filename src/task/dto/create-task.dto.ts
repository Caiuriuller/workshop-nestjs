import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum TaskStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class CreateTaskDto {
  @ApiProperty({ description: 'Task description', example: 'Buy groceries' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Task status',
    enum: TaskStatus,
    default: TaskStatus.ACTIVE,
  })
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  status?: TaskStatus;
}
