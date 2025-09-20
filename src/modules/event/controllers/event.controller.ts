import {
  Put,
  Get,
  Post,
  Body,
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
  CreateEventDto,
  QueryListEventDto,
  GetEventResponseDto,
  ListEventResponseDto,
  CreateEventResponseDto,
  UpdateEventDto,
} from '../dto';
import {
  GetEventService,
  ListEventService,
  CreateEventService,
  UpdateEventService,
} from '../services';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(
    private readonly createEventService: CreateEventService,
    private readonly listEventService: ListEventService,
    private readonly getEventService: GetEventService,
    private readonly updateEventService: UpdateEventService,
  ) {}

  @Post()
  async createEvent(
    @Body() dto: CreateEventDto,
  ): Promise<CreateEventResponseDto> {
    return this.createEventService.create(dto);
  }

  @Put(':eventId')
  async updateEvent(
    @RequestUser() requestUser: AuthenticatedUser,
    @Param('eventId', new ParseUUIDPipe({ version: '4' })) eventId: string,
    @Body() dto: UpdateEventDto,
  ): Promise<UpdateEventDto> {
    return this.updateEventService.update(eventId, dto, requestUser.id);
  }

  @Get()
  async listEvents(
    @Query() query: QueryListEventDto,
  ): Promise<ListEventResponseDto[]> {
    return this.listEventService.list(query);
  }

  @Get(':eventId')
  async getEvent(
    @Param('eventId', new ParseUUIDPipe({ version: '4' })) eventId: string,
  ): Promise<GetEventResponseDto> {
    return this.getEventService.getById(eventId);
  }
}
