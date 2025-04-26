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
import { Category } from 'src/modules/category/entities/category.entity';
import { User } from 'src/modules/user/entities/user.entity';

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

  @Column({ name: 'user_id' })
  @IsInt()
  userId: number;

  @ManyToOne(() => User, (user) => user.tasks, {})
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'category_id' })
  @IsOptional()
  @IsInt()
  categoryId: number;

  @ManyToOne(() => Category, (category) => category.tasks, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  categoery: Category;

  @Column({ name: 'goal_id', nullable: true, default: null })
  @IsOptional()
  @IsInt()
  goalId?: number;
}
