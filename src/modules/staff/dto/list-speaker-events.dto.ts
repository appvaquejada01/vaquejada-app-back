import { Event } from 'src/entities';
import {
  JudgeResponseDto,
  RunnerResponseDto,
} from './list-judges-events.response.dto';
import { EventStatusEnum } from 'src/modules/event/enums';

export class ListSpeakerEventsDto {
  id: string;
  name: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  status: EventStatusEnum;
  bannerUrl?: string;
  judges: JudgeResponseDto[];
  runners: RunnerResponseDto[];
  createdAt: string;

  static fromEntity(fromEntity: Event): ListSpeakerEventsDto {
    const dto = new ListSpeakerEventsDto();
    dto.id = fromEntity.id;
    dto.name = fromEntity.name;
    dto.description = fromEntity.description;
    dto.location = `${fromEntity.address}, ${fromEntity.city} - ${fromEntity.state}`;
    dto.startAt = fromEntity.startAt;
    dto.endAt = fromEntity.endAt;
    dto.status = fromEntity.status;
    dto.bannerUrl = fromEntity.bannerUrl;
    dto.judges = fromEntity.judges.map((judge) =>
      JudgeResponseDto.fromEntity(judge),
    );
    dto.runners = fromEntity.runners.map((runner) =>
      RunnerResponseDto.fromEntity(runner),
    );
    dto.createdAt = fromEntity.createdAt.toDateString();

    return dto;
  }
}
