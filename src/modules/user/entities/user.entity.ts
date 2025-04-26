import { Task } from 'src/modules/task/entities/task.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  StrictUpdateFilter,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: String;

  @OneToMany(() => Task, (task) => task.user, {
    nullable: true,
  })
  tasks?: Task[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
