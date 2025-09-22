import {
  Get,
  Req,
  Put,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Delete,
  UseGuards,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { RequestUser, Roles } from 'src/shared/decorators';
import { UserRoleEnum } from 'src/modules/user/enums';
import { PaginatedResponseDto } from 'src/shared/dto';
import { JwtAuthGuard, RolesGuard } from 'src/shared/guards';

import {
  GetEventService,
  ListEventService,
  UpdateEventService,
  CreateEventService,
  DeleteEventService,
  UpdateEventStatusService,
} from '../services';
import {
  CreateEventDto,
  CreateEventResponseDto,
  EventResponseDto,
  ListEventResponseDto,
  QueryListEventDto,
  UpdateEventDto,
} from '../dto';
import {
  EventChangeStatusDocumentation,
  EventCreateDocumentation,
  EventDeleteDocumentation,
  EventFindAllDocumentation,
  EventFindOneDocumentation,
  EventUpdateDocumentation,
} from '../docs';
import { EventStatusEnum } from '../enums';
import { AuthenticatedUser } from 'src/shared/types/routes';

@ApiTags('events')
@ApiBearerAuth()
@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventController {
  constructor(
    private readonly getEventService: GetEventService,
    private readonly listEventService: ListEventService,
    private readonly createEventService: CreateEventService,
    private readonly updateEventService: UpdateEventService,
    private readonly deleteEventService: DeleteEventService,
    private readonly updateStatusService: UpdateEventStatusService,
  ) {}

  @Post()
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  @EventCreateDocumentation()
  async create(
    @Body() createEventDto: CreateEventDto,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<CreateEventResponseDto> {
    return this.createEventService.create(createEventDto, user.id);
  }

  @Get()
  @EventFindAllDocumentation()
  async findAll(
    @Query() query: QueryListEventDto,
  ): Promise<PaginatedResponseDto<ListEventResponseDto>> {
    return this.listEventService.list(query);
  }

  @Get(':id')
  @EventFindOneDocumentation()
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EventResponseDto> {
    return this.getEventService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  @EventUpdateDocumentation()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<EventResponseDto> {
    return this.updateEventService.update(id, updateEventDto, user.id);
  }

  @Delete(':id')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  @EventDeleteDocumentation()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.deleteEventService.delete(id, user.id);
  }

  @Patch(':id/status')
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  @EventChangeStatusDocumentation()
  async changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('status') status: EventStatusEnum,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.updateStatusService.updateStatus(id, status, user.id);
  }
}
