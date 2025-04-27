// tasks.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import * as chrono from 'chrono-node'; // we'll use this amazing free library!
import { Category } from '../category/entities/category.entity';
import axios from 'axios';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async createTask(createTaskDto: CreateTaskDto) {
    // if (!createTaskDto.categoryId) {
    //   // Call Python service to predict the category
    //   const predictedCategory = await this.getCategoryFromPython(
    //     createTaskDto.title,
    //     createTaskDto.description ?? '',
    //   );

    //   // You might want to map 'Personal' => its internal categoryId (from your DB)
    //   createTaskDto.categoryId =
    //     await this.getCategoryIdFromName(predictedCategory);
    // }
    if (createTaskDto.categoryName) {
      // Try to find the category by name (case-insensitive)
      const category = await this.categoryRepo.findOne({
        where: { name: createTaskDto.categoryName },
      });
      if (category) {
        createTaskDto.categoryId = category.id;
      }
    }

    const task = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(task);
  }

  async findAll(): Promise<Task[]> {
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
      throw new NotFoundException(`Task with id ${id} no found`);
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
  private async getCategoryFromPython(
    title: string,
    description: string,
  ): Promise<string> {
    const payload = {
      text: `${title} ${description}`,
    };

    try {
      const response = await axios.post(
        'http://localhost:8000/predict',
        payload,
      );
      return response.data.category; // Expect { category: "Work" } from Python
    } catch (error) {
      console.error('Error calling Python service:', error);
      throw new Error('Failed to predict task category');
    }
  }
  private async getCategoryIdFromName(name: string): Promise<number> {
    const category = await this.categoryRepo.findOne({ where: { name } });
    if (!category) {
      throw new Error(`Category '${name}' not found`);
    }
    return category.id;
  }
}
