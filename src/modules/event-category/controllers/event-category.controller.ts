import {
  Put,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { RequestUser } from 'src/shared/decorators';
import { UserRoleEnum } from 'src/modules/user/enums';
import { AuthenticatedUser } from 'src/shared/types/routes';
import { JwtAuthGuard, RolesGuard } from 'src/shared/guards';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { PaginatedResponseDto, PaginationDto } from 'src/shared/dto';

import {
  CreateEventCategoryDto,
  UpdateEventCategoryDto,
  EventCategoryResponseDto,
  ListEventCategoryResponseDto,
} from '../dto';
import {
  EventCategoryCreateDocumentation,
  EventCategoryFindAllDocumentation,
  EventCategoryFindOneDocumentation,
  EventCategoryUpdateDocumentation,
} from '../docs';
import {
  GetEventCategoryService,
  CreateEventCategoryService,
  ListEventCategoriesService,
  UpdateEventCategoryService,
} from '../services';

@ApiTags('event-categories')
@ApiBearerAuth()
@Controller('event-categories')
export class EventCategoryController {
  constructor(
    private readonly createEventCategoryService: CreateEventCategoryService,
    private readonly getEventCategoryService: GetEventCategoryService,
    private readonly listEventCategoryService: ListEventCategoriesService,
    private readonly updateEventCategoryService: UpdateEventCategoryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  @EventCategoryCreateDocumentation()
  async create(
    @Body() dto: CreateEventCategoryDto,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<EventCategoryResponseDto> {
    console.log('Authenticated User:', user);
    return this.createEventCategoryService.create(dto, user.userId, user.role);
  }

  @Get()
  @EventCategoryFindAllDocumentation()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('eventId', new ParseUUIDPipe({ version: '4' })) eventId: string,
  ): Promise<PaginatedResponseDto<ListEventCategoryResponseDto>> {
    return this.listEventCategoryService.findAll(eventId, paginationDto);
  }

  @Get(':eventId/:eventCategoryId')
  @EventCategoryFindOneDocumentation()
  async findOne(
    @Param('eventId', new ParseUUIDPipe({ version: '4' })) eventId: string,
    @Param('eventCategoryId', new ParseUUIDPipe({ version: '4' }))
    eventCategoryId: string,
  ): Promise<EventCategoryResponseDto> {
    return this.getEventCategoryService.findOne(eventId, eventCategoryId);
  }

  @Put(':eventCategoryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN)
  @EventCategoryUpdateDocumentation()
  async update(
    @Param('eventCategoryId', new ParseUUIDPipe({ version: '4' }))
    eventCategoryId: string,
    @Body() dto: UpdateEventCategoryDto,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<EventCategoryResponseDto> {
    return this.updateEventCategoryService.update(
      eventCategoryId,
      dto,
      user.userId,
      user.role,
    );
  }
}
