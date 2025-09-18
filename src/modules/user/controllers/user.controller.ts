import {
  Get,
  Put,
  Body,
  Post,
  Param,
  Query,
  UseGuards,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/shared/guards';
import { RequestUser } from 'src/shared/decorators';
import { AuthenticatedUser } from 'src/shared/types/routes';

import {
  GetUserService,
  ListUserService,
  CreateUserService,
  UpdateUserService,
} from '../services';
import {
  QueryUserDto,
  CreateUserDto,
  UpdateUserDto,
  GetUserResponseDto,
  ListUserResponseDto,
  UpdateUserResponseDto,
} from '../dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly listUserService: ListUserService,
    private readonly getUserService: GetUserService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async listUsers(
    @Query() query: QueryUserDto,
  ): Promise<ListUserResponseDto[]> {
    return this.listUserService.list(query);
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async getUserById(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ): Promise<GetUserResponseDto> {
    return this.getUserService.getById(userId);
  }

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
