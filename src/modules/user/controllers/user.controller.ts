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
import { RequestUser, Roles } from 'src/shared/decorators';
import { AuthenticatedUser } from 'src/shared/types/routes';

import {
  QueryUserDto,
  CreateUserDto,
  UpdateUserDto,
  GetUserResponseDto,
  UpdateUserResponseDto,
} from '../dto';
import {
  GetUserService,
  ListUserService,
  CreateUserService,
  UpdateUserService,
  CreateFullUserService,
} from '../services';
import { CreateFullUserDto } from '../dto/create-full-user.dto';
import { UserRoleEnum } from '../enums';

@Controller('users')
export class UserController {
  constructor(
    private readonly createFullUserService: CreateFullUserService,
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly listUserService: ListUserService,
    private readonly getUserService: GetUserService,
  ) {}

  @Post()
  async createUser(
    @Body() body: CreateUserDto,
  ): Promise<{ user: CreateUserDto; access_token: string }> {
    return this.createUserService.create(body);
  }

  @Post('full')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoleEnum.ADMIN)
  async createFullUser(
    @Body() body: CreateFullUserDto,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<CreateFullUserDto> {
    return this.createFullUserService.create(body, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async listUsers(@Query() query: QueryUserDto): Promise<GetUserResponseDto[]> {
    return this.listUserService.list(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(
    @RequestUser() user: AuthenticatedUser,
  ): Promise<GetUserResponseDto> {
    return this.getUserService.getById(user.userId);
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async getUserById(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ): Promise<GetUserResponseDto> {
    return this.getUserService.getById(userId);
  }

  @Put(':userId')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @RequestUser() requestUser: AuthenticatedUser,
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() body: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    return this.updateUserService.update(userId, body, requestUser);
  }
}
