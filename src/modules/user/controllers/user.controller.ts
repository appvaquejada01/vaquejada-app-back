import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from '../dto';
import { CreateUserService } from '../services';

@Controller('users')
export class UserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<CreateUserDto> {
    return this.createUserService.create(body);
  }
}
