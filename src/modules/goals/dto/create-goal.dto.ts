import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { CreateTaskDto } from '../../task/dto/create-task.dto';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsDateString()
  deadline: Date;

  @IsOptional()
  tasks?: CreateTaskDto[];
}
