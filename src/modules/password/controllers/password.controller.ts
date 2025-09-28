import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';

import { UserRoleEnum } from 'src/modules/user/enums';
import { Roles, RequestUser } from 'src/shared/decorators';
import { AuthenticatedUser } from 'src/shared/types/routes';
import { JwtAuthGuard, RolesGuard } from 'src/shared/guards';

import {
  CreatePasswordDto,
  PasswordResponseDto,
  QueryListPasswordDto,
} from '../dto/';
import {
  PasswordListDocumentation,
  PasswordCreateDocumentation,
} from '../docs/password.swagger';
import { CreatePasswordService, ListPasswordsService } from '../services';

@ApiTags('passwords')
@ApiBearerAuth()
@Controller('passwords')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PasswordController {
  constructor(
    private readonly createPasswordService: CreatePasswordService,
    private readonly listPasswordsService: ListPasswordsService,
  ) {}

  @Post()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  @PasswordCreateDocumentation()
  async create(
    @Body() dto: CreatePasswordDto,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<PasswordResponseDto[]> {
    return this.createPasswordService.create(dto, user.userId);
  }

  @Get()
  @PasswordListDocumentation()
  async findAll(
    @Query() query: QueryListPasswordDto,
  ): Promise<PasswordResponseDto[]> {
    return this.listPasswordsService.findAll(query);
  }
}
