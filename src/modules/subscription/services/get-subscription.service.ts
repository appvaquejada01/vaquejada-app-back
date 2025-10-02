import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { Subscription } from 'src/entities';
import { GetSubscriptionDto } from '../dto';

@Injectable()
export class GetSubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async findOne(id: string): Promise<GetSubscriptionDto> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['user', 'event', 'category'],
    });

    if (!subscription) {
      throw new NotFoundException('Inscrição não encontrada');
    }

    return GetSubscriptionDto.fromEntity(subscription);
  }
}
