import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard, RolesGuard } from 'src/shared/guards';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoleEnum } from 'src/modules/user/enums';
import { CreateEventCategoryDto, UpdateEventCategoryDto } from '../dto';
import {
  CreateEventCategoryService,
  GetEventCategoryService,
  ListEventCategoriesService,
  UpdateEventCategoryService,
} from '../services';
import { EventCategoryResponseDto } from '../dto/event-category-response.dto';
import { ListEventCategoryResponseDto } from '../dto/list-event-category-response.dto';
import { RequestUser } from 'src/shared/decorators';
import { AuthenticatedUser } from 'src/shared/types/routes';
import { PaginatedResponseDto, PaginationDto } from 'src/shared/dto';

@ApiTags('event-categories')
@ApiBearerAuth()
@Controller('event-categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventCategoryController {
  constructor(
    private readonly createEventCategoryService: CreateEventCategoryService,
    private readonly getEventCategoryService: GetEventCategoryService,
    private readonly listEventCategoryService: ListEventCategoriesService,
    private readonly updateEventCategoryService: UpdateEventCategoryService,
  ) {}

  @Post()
  @Roles(UserRoleEnum.ADMIN)
  async create(
    @Body() dto: CreateEventCategoryDto,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<EventCategoryResponseDto> {
    // Se quiser registrar o usuário, pode passar user.id
    return this.createEventCategoryService.create(dto);
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponseDto<ListEventCategoryResponseDto>> {
    return this.listEventCategoryService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EventCategoryResponseDto> {
    return this.getEventCategoryService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRoleEnum.ADMIN)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEventCategoryDto,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<EventCategoryResponseDto> {
    return this.updateEventCategoryService.update(id, dto);
  }
}
