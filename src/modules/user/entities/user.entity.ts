import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  StrictUpdateFilter,
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
}
