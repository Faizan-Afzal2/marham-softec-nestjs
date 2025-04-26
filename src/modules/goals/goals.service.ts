import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { Goal } from './entities/goal.entity';
import { Task } from '../task/entities/task.entity';
import { CreateTaskDto } from '../task/dto/create-task.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private readonly goalRepository: Repository<Goal>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createGoalDto: CreateGoalDto) {
    const { tasks, ...goalData } = createGoalDto;
    const goal = this.goalRepository.create(goalData);
    const savedgoal = await this.goalRepository.save(goal);

    let taskEntities: Task[] = [];
    if (tasks && tasks.length > 0) {
      tasks.map((task) => {
        const createTaskDto: CreateTaskDto = {
          title: task.title,
          description: task.description ?? '',
          goalId: savedgoal.id,
          dueDate: task.dueDate,
        };
        const taskCreated = this.taskRepository.create(createTaskDto);
        taskEntities.push(taskCreated);
      });
    }
    this.taskRepository.save(taskEntities);
    return { message: 'Goal Created Successfully', goalId: savedgoal.id };
  }

  async findAll(): Promise<Goal[]> {
    return this.goalRepository.find({
      relations: {
        tasks: true,
      },
    });
  }

  async findOne(id: number): Promise<Goal> {
    const goal = await this.goalRepository.findOne({
      where: { id },
      relations: {
        tasks: true,
      },
    });
    if (!goal) {
      throw new NotFoundException(`Goal with id ${id} not found`);
    }
    return goal;
  }

  async update(id: number, updateGoalDto: UpdateGoalDto): Promise<Goal> {
    const goal = await this.goalRepository.findOne({
      where: { id },
      relations: {
        tasks: true,
      },
    });
    if (!goal) {
      throw new NotFoundException(`Goal with id ${id} not found`);
    }

    return this.goalRepository.save(goal);
  }

  async remove(id: number): Promise<void> {
    const goal = await this.goalRepository.findOne({ where: { id } });
    if (!goal) {
      throw new NotFoundException(`Goal with id ${id} not found`);
    }
    await this.goalRepository.remove(goal);
  }
}
