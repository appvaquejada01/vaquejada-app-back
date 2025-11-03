import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from 'src/entities';
import { ListSpeakerEventsDto } from '../dto';

@Injectable()
export class ListSpeakerEventsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async listBySpeaker(
    speakerId: string,
  ): Promise<ListSpeakerEventsDto[]> {
    const user = await this.findSpeakerWithEvents(speakerId);

    return user.eventsAsSpeaker.map(ListSpeakerEventsDto.fromEntity);
  }

  private async findSpeakerWithEvents(speakerId: string) {
    const user = await this.userRepository.findOne({
      where: { id: speakerId },
      relations: [
        'eventsAsSpeaker',
        'eventsAsSpeaker.judges',
        'eventsAsSpeaker.scores',
        'eventsAsSpeaker.runners',
        'eventsAsSpeaker.passwords',
        'eventsAsSpeaker.runners.subscriptions',
        'eventsAsSpeaker.runners.subscriptions.passwords',
      ],
    });

    if (!user) {
      throw new NotFoundException('Speaker not found');
    }

    return user;
  }
}
