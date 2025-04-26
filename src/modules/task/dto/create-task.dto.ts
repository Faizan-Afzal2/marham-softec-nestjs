import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  IsInt,
} from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  //   @IsOptional()
  //   @IsString()
  //   moodSuggestion?: string;

  @IsOptional()
  @IsInt()
  goalId?: number;
}
