import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

import { JudgeVoteEnum, Score } from 'src/entities';

export class JudgeVoteDto {
  @ApiProperty()
  @IsUUID('4')
  judgeId: string;

  @ApiProperty()
  @IsUUID('4')
  eventId: string;

  @ApiProperty()
  @IsUUID('4')
  passwordId: string;

  @ApiProperty()
  @IsEnum(JudgeVoteEnum)
  vote: JudgeVoteEnum;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comments?: string;
}

export class ListJudgeVotesResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  eventId: string;

  @ApiProperty()
  subscriptionId: string;

  @ApiProperty()
  passwordId: string;

  @ApiProperty()
  vote: JudgeVoteEnum;

  @ApiProperty()
  points: number;

  @ApiProperty()
  comments: string;

  @ApiProperty()
  createdAt: Date;

  static fromEntity(entity: Score): ListJudgeVotesResponseDto {
    const dto = new ListJudgeVotesResponseDto();

    dto.id = entity.id;
    dto.eventId = entity.event.id;
    dto.subscriptionId = entity.subscriptionId;
    dto.passwordId = entity.passwordId;
    dto.vote = entity.vote;
    dto.points = entity.points;
    dto.comments = entity.comments;
    dto.createdAt = entity.createdAt;

    return dto;
  }
}
