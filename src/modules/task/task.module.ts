import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UserService } from '../user/user.service';
import { Category } from '../category/entities/category.entity';

@Module({
  controllers: [TaskController],
  imports: [TypeOrmModule.forFeature([Task, Category])],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
