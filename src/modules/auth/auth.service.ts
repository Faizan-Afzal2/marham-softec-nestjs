import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  async register(dto: CreateUserDto) {
    console.log(dto.name);

    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) throw new BadRequestException('Email already registered');

    const user = await this.userService.create({
      ...dto,
      password: dto.password,
    });

    return { message: 'User created successfully', user };
  }

  async login(dto: LoginDto) {
    const user = await this.userService.validateUser(dto);

    const payload = { id: user.id };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  async me(userId: number) {
    return this.userService.findById(userId);
  }
}
