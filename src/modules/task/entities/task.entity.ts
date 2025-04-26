import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
} from 'class-validator';
import { Goal } from '../../goals/entities/goal.entity';
import { Category } from 'src/modules/category/entities/category.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @Column({ default: false })
  @IsNotEmpty()
  @IsBoolean()
  completed: boolean;

  //   @Column({ nullable: true })
  //   @IsOptional()
  //   @IsString()
  //   moodSuggestion?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ name: 'category_id', nullable: true })
  @IsOptional()
  @IsInt()
  category_id: number;

  @ManyToOne(() => Category, (category) => category.tasks, {
    nullable: true,
  })
  Categoery: Category;

  @Column({ name: 'goal_id', nullable: true, default: null })
  @IsOptional()
  @IsInt()
  goalId?: number;

  @ManyToOne(() => Goal, (goal) => goal.tasks, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'goal_id' })
  goal?: Goal;
}
