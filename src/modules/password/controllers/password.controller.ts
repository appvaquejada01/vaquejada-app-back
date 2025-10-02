import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';

import { UserRoleEnum } from 'src/modules/user/enums';
import { Roles, RequestUser } from 'src/shared/decorators';
import { AuthenticatedUser } from 'src/shared/types/routes';
import { JwtAuthGuard, RolesGuard } from 'src/shared/guards';

import {
  PasswordDto,
  CreatePasswordDto,
  PasswordResponseDto,
  PurchasePasswordDto,
  QueryListPasswordDto,
} from '../dto/';
import {
  ListPasswordsService,
  CreatePasswordService,
  PurchasePasswordService,
} from '../services';
import {
  PasswordListDocumentation,
  PasswordCreateDocumentation,
  PasswordPurchaseDocumentation,
} from '../docs/password.swagger';

@ApiTags('passwords')
@ApiBearerAuth()
@Controller('passwords')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PasswordController {
  constructor(
    private readonly listPasswordsService: ListPasswordsService,
    private readonly createPasswordService: CreatePasswordService,
    private readonly purchasePasswordService: PurchasePasswordService,
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

  @Post('purchase')
  @PasswordPurchaseDocumentation()
  async purchase(
    @Body() dto: PurchasePasswordDto,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<PasswordDto> {
    return this.purchasePasswordService.purchase(dto, user.userId);
  }
}
