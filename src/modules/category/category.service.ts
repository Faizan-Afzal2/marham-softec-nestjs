import { Injectable, UseGuards } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepo.create(createCategoryDto);

    return await this.categoryRepo.save(category);
  }

  // Get all categories that have at least one task belonging to the given user
  async findAllWithUserTasks(userId: number) {
    return await this.categoryRepo
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.tasks', 'task')
      .where('task.userId = :userId', { userId })
      .getMany();
  }

  async findAll() {
    return this.categoryRepo.find();
  }
  findOne(id: number) {
    return this.categoryRepo.findOne({ where: { id } });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
