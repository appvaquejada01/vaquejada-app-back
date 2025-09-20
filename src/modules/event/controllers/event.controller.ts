import {
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/shared/guards';

import {
  CreateEventDto,
  QueryListEventDto,
  GetEventResponseDto,
  ListEventResponseDto,
  CreateEventResponseDto,
} from '../dto';
import {
  GetEventService,
  ListEventService,
  CreateEventService,
} from '../services';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventController {
  constructor(
    private readonly createEventService: CreateEventService,
    private readonly listEventService: ListEventService,
    private readonly getEventService: GetEventService,
  ) {}

  @Post()
  async createEvent(
    @Body() dto: CreateEventDto,
  ): Promise<CreateEventResponseDto> {
    return this.createEventService.create(dto);
  }

  @Get()
  async listEvents(
    @Body() query: QueryListEventDto,
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
