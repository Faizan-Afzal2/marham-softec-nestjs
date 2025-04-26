// tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as chrono from 'chrono-node'; // we'll use this amazing free library!

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    console.log('Here is dto:', createTaskDto);

    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
    console.log('Ghelo');

    return await this.taskRepository.find();
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({
      where: {
        id: id,
      },
    });
    console.log(task);

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    await this.taskRepository.update(id, updateTaskDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.taskRepository.delete(id);
  }

  // Functions other than CRuds
  // tasks.service.ts

  async parseTaskInput(input: string) {
    console.log(input);

    const results = chrono.parse(input);

    let dueDate: Date | undefined = undefined;
    if (results.length > 0) {
      dueDate = results[0].start.date(); // extract date
      input = input.replace(results[0].text, '').trim(); // remove date part from title
    }

    const title = input.length > 0 ? input : 'New Task'; // fallback if no text left
    return { title, dueDate };
  }
}
