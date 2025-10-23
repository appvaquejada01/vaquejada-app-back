import {
  Get,
  Post,
  Param,
  Delete,
  UseGuards,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserRoleEnum } from 'src/modules/user/enums';
import { RequestUser, Roles } from 'src/shared/decorators';
import { AuthenticatedUser } from 'src/shared/types/routes';
import { JwtAuthGuard, RolesGuard } from 'src/shared/guards';

import {
  GetEventStaffService,
  CreateEventJudgeService,
  CreateEventSpeakerService,
  RemoveEventJudgeService,
  RemoveEventSpeakerService,
  ListJudgeEventsService,
} from '../services';
import { GetEventStaffDto } from '../dto/get-event-staff.dto';
import { ListJudgeEventsResponseDto } from '../dto';

@ApiTags('staff')
@ApiBearerAuth()
@Controller('staff')
export class StaffController {
  constructor(
    private readonly getStaffEventService: GetEventStaffService,
    private readonly createEventJudgeService: CreateEventJudgeService,
    private readonly createEventSpeakerService: CreateEventSpeakerService,
    private readonly removeEventJudgeService: RemoveEventJudgeService,
    private readonly removeEventSpeakerService: RemoveEventSpeakerService,
    private readonly listJudgeEventsService: ListJudgeEventsService,
  ) {}

  @Post('judge/:eventId/:judgeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  async createJudge(
    @Param('eventId', new ParseUUIDPipe({ version: '4' })) eventId: string,
    @Param('judgeId', new ParseUUIDPipe({ version: '4' })) judgeId: string,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.createEventJudgeService.create(eventId, judgeId, user.userId);
  }

  @Post('speaker/:eventId/:speakerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  async createSpeaker(
    @Param('eventId', new ParseUUIDPipe({ version: '4' })) eventId: string,
    @Param('speakerId', new ParseUUIDPipe({ version: '4' })) speakerId: string,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.createEventSpeakerService.create(
      eventId,
      speakerId,
      user.userId,
    );
  }

  @Delete('judge/:eventId/:judgeId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  async removeJudge(
    @Param('eventId', new ParseUUIDPipe({ version: '4' })) eventId: string,
    @Param('judgeId', new ParseUUIDPipe({ version: '4' })) judgeId: string,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.removeEventJudgeService.remove(eventId, judgeId, user.userId);
  }

  @Delete('speaker/:eventId/:speakerId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  async removeSpeaker(
    @Param('eventId', new ParseUUIDPipe({ version: '4' })) eventId: string,
    @Param('speakerId', new ParseUUIDPipe({ version: '4' })) speakerId: string,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.removeEventSpeakerService.remove(
      eventId,
      speakerId,
      user.userId,
    );
  }

  @Get('event/:eventId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
  async getStaffEvent(
    @Param('eventId', new ParseUUIDPipe({ version: '4' })) eventId: string,
  ): Promise<GetEventStaffDto> {
    return this.getStaffEventService.findById(eventId);
  }

  @Get('/:judgeId/events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.JUDGE, UserRoleEnum.ORGANIZER)
  async getJudgeEvents(
    @Param('judgeId') judgeId: string,
  ): Promise<ListJudgeEventsResponseDto> {
    return await this.listJudgeEventsService.findByJudgeId(judgeId);
  }
}
