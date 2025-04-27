import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../auth/dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepo.create({
      email,
      password: hashedPassword,
      name: name,
    });

    return this.userRepo.save(newUser);
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }
  async findById(id: number) {
    return this.userRepo.findOne({
      where: { id },
      relations: { tasks: { categoery: true } },
    });
  }

  async validateUser(userDto: LoginDto) {
    const user = await this.findByEmail(userDto.email);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Email not registred',
      });
    }
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (!passwordEquals) {
      throw new UnauthorizedException({
        message: 'Incorrect password',
      });
    }
    return user;
  }
}
