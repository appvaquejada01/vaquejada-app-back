import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class ListSpeakerEventsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async listBySpeaker(speakerId: string): Promise<Event[]> {
    const events = await this.userRepository.findOne({
      where: { id: speakerId },
      relations: [
        'eventsAsSpeaker',
        'eventsAsSpeaker.scores',
        'eventsAsSpeaker.runners',
        'eventsAsSpeaker.passwords',
      ],
    });

    console.log(events);

    return [];
  }
}
