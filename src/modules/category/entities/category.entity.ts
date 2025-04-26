import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Task } from 'src/modules/task/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  color: string;

  @OneToMany(() => Task, (task) => task.categoery, {
    nullable: true,
  })
  tasks?: Category;
}
