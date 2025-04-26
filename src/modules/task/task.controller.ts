import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('parse-text')
  async parseText(@Body() body: { text: string }) {
    return this.taskService.parseTaskInput(body.text);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create-task')
  create(@Req() req: any, @Body() createTaskDto: CreateTaskDto) {
    const user = req.user as User;
    createTaskDto.userId = user.id;
    return this.taskService.createTask(createTaskDto);
  }

  @Get('get-all')
  findAll() {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Post(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
