import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';

import { Roles } from 'src/shared/decorators';
import { UserRoleEnum } from 'src/modules/user/enums';
import { JwtAuthGuard, RolesGuard } from 'src/shared/guards';

import { SpeakerVotesSummaryService } from '../services';
import { SpeakerVoteSummaryResponse } from '../dto';

@Controller('speaker/vote-summary')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRoleEnum.SPEAKER, UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER)
export class SpeakerVoteSummaryController {
  constructor(
    private readonly speakerVotesSummaryService: SpeakerVotesSummaryService,
  ) {}

  @Get(':eventId')
  async getVoteSummary(
    @Param('eventId', new ParseUUIDPipe({ version: '4' })) eventId: string,
  ): Promise<SpeakerVoteSummaryResponse> {
    return this.speakerVotesSummaryService.getEventVotesSummary(eventId);
  }
}
