import { Event } from 'src/entities';
import { GetUserResponseDto } from 'src/modules/user/dto';

export class GetEventStaffDto {
  judges: GetUserResponseDto[] = [];
  speakers: GetUserResponseDto[] = [];

  static fromEntity(event: Event): GetEventStaffDto {
    const dto = new GetEventStaffDto();

    dto.judges =
      event.judges?.map((user) => GetUserResponseDto.fromEntity(user)) || [];
    dto.speakers =
      event.speakers?.map((user) => GetUserResponseDto.fromEntity(user)) || [];

    return dto;
  }
}
