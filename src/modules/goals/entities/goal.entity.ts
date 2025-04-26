import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsDateString,
} from 'class-validator';
import { Task } from '../../task/entities/task.entity';

@Entity()
export class Goal {
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

  @Column({ type: 'timestamp' })
  @IsNotEmpty()
  @IsDateString()
  deadline: Date;

  @Column({ default: false })
  @IsNotEmpty()
  completed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.goal)
  tasks: Task[];
}
