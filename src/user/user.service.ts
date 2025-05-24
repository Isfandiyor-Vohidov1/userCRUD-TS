import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User
  ) { }

  async create(dto: CreateUserDto): Promise<User> {
    return this.userRepository.create({
      username: dto.username,
      email: dto.email,
      password: dto.password
    });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findByPk(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    return user.update(dto);
  }

  async remove(id: number): Promise<void> {
    const deletedCount = await this.userRepository.destroy({ where: { id } });
    if (deletedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}