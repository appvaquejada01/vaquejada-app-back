import {
  Get,
  Body,
  Post,
  Param,
  Delete,
  UseGuards,
  Controller,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserRoleEnum } from 'src/modules/user/enums';
import { RequestUser, Roles } from 'src/shared/decorators';
import { AuthenticatedUser } from 'src/shared/types/routes';
import { JwtAuthGuard, RolesGuard } from 'src/shared/guards';

import {
  JudgeVoteDto,
  GetEventStaffDto,
  ListJudgeVotesResponseDto,
  ListJudgeEventsResponseDto,
} from '../dto';
import {
  JudgeVoteService,
  GetEventStaffService,
  ListJudgeVotesService,
  ListJudgeEventsService,
  CreateEventJudgeService,
  RemoveEventJudgeService,
  CreateEventSpeakerService,
  RemoveEventSpeakerService,
  UpdateJudgeVoteService,
  ListSpeakerEventsService,
} from '../services';

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
    private readonly judgeVoteService: JudgeVoteService,
    private readonly listJudgeVotesService: ListJudgeVotesService,
    private readonly updateJudgeVoteService: UpdateJudgeVoteService,
    private readonly listSpeakerEventsService: ListSpeakerEventsService,
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

  @Get(':judgeId/events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.JUDGE, UserRoleEnum.ORGANIZER)
  async getJudgeEvents(
    @Param('judgeId', new ParseUUIDPipe({ version: '4' })) judgeId: string,
  ): Promise<ListJudgeEventsResponseDto> {
    return await this.listJudgeEventsService.findByJudgeId(judgeId);
  }

  @Post('judge/vote')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.JUDGE)
  async judgeVote(
    @Body() voteDto: JudgeVoteDto,
    @RequestUser() user: AuthenticatedUser,
  ): Promise<void> {
    return this.judgeVoteService.vote(voteDto, user.userId);
  }

  @Get('judge/votes/:judgeId/:eventId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.JUDGE)
  async getJudgeVotes(
    @Param('judgeId', new ParseUUIDPipe({ version: '4' })) judgeId: string,
    @Param('eventId', new ParseUUIDPipe({ version: '4' })) eventId: string,
  ): Promise<ListJudgeVotesResponseDto[]> {
    return this.listJudgeVotesService.listVotes(judgeId, eventId);
  }

  @Put('judge/vote/:scoreId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.JUDGE)
  async updateJudgeVote(
    @Param('scoreId', new ParseUUIDPipe({ version: '4' })) scoreId: string,
    @Body() partialVote: Partial<JudgeVoteDto>,
  ): Promise<void> {
    return this.updateJudgeVoteService.update(scoreId, partialVote);
  }

  @Get('speaker/:speakerId/events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoleEnum.ADMIN, UserRoleEnum.SPEAKER, UserRoleEnum.ORGANIZER)
  async getSpeakerEvents(
    @Param('speakerId', new ParseUUIDPipe({ version: '4' })) speakerId: string,
  ): Promise<Event[]> {
    return this.listSpeakerEventsService.listBySpeaker(speakerId);
  }
}
