import {
  Put,
  Body,
  Post,
  Param,
  UseGuards,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/shared/guards';
import { RequestUser } from 'src/shared/decorators';
import { AuthenticatedUser } from 'src/shared/types/routes';

import { CreateUserService, UpdateUserService } from '../services';
import { CreateUserDto, UpdateUserDto, UpdateUserResponseDto } from '../dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
  ) {}

  @Post()
  async createUser(@Body() body: CreateUserDto): Promise<CreateUserDto> {
    return this.createUserService.create(body);
  }

  @Put(':userId')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @RequestUser() requestUser: AuthenticatedUser,
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() body: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    return this.updateUserService.update(userId, body, requestUser.id);
  }
}
