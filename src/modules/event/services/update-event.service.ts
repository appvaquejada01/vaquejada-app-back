import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Event, User } from 'src/entities';
import { UserRoleEnum } from 'src/modules/user/enums';
import { UpdateQueryResponse } from 'src/shared/types/typeorm';

import { UpdateEventDto, EventResponseDto } from '../dto';

@Injectable()
export class UpdateEventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async update(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string,
  ): Promise<EventResponseDto> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['organizer'],
    });

    if (!event) {
      throw new NotFoundException(`Evento com ID ${id} não encontrado`);
    }

    // Verificar permissões
    await this.checkEventPermission(event, userId);

    // Validar datas
    if (updateEventDto.startAt && updateEventDto.endAt) {
      this.validateEventDates(updateEventDto.startAt, updateEventDto.endAt);
    }

    const updatedEvent = await this.updateEvent(
      event.id,
      updateEventDto,
      userId,
    );

    return EventResponseDto.fromEntity(updatedEvent);
  }

  private async checkEventPermission(
    event: Event,
    userId: string,
  ): Promise<void> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.role'])
      .where('user.id = :userId', { userId })
      .getOne();

    if (user!.role === UserRoleEnum.ADMIN) {
      return;
    }

    if (user!.role === UserRoleEnum.ORGANIZER && event.organizerId !== userId) {
      throw new ForbiddenException('Você só pode editar seus próprios eventos');
    }

    if (![UserRoleEnum.ADMIN, UserRoleEnum.ORGANIZER].includes(user!.role)) {
      throw new ForbiddenException('Acesso negado para editar eventos');
    }
  }

  private validateEventDates(startAt: string, endAt: string): void {
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (startDate >= endDate) {
      throw new BadRequestException(
        'Data de início deve ser anterior à data de término',
      );
    }

    if (startDate < new Date()) {
      throw new BadRequestException('Data de início não pode ser no passado');
    }
  }

  private async updateEvent(
    id: string,
    updateEventDto: UpdateEventDto,
    userId: string,
  ): Promise<Event> {
    const [[updateResult]]: UpdateQueryResponse<Event> =
      await this.eventRepository.query(
        `
      UPDATE 
        events
      SET 
        name = $1,
        "startAt" = $2,
        "endAt" = $3,
        "purchaseClosedAt" = $4,
        status = $5,
        prize = $6,
        address = $7,
        city = $8,
        state = $9,
        description = $10,
        "bannerUrl" = $11,
        is_active = $12,
        "isPublic" = $13,
        "updatedAt" = NOW(),
        "updatedUserId" = $14
      WHERE 
        id = $15 
      RETURNING *`,
        [
          updateEventDto.name,
          updateEventDto.startAt,
          updateEventDto.endAt,
          updateEventDto.purchaseClosedAt,
          updateEventDto.status,
          updateEventDto.prize,
          updateEventDto.address || null,
          updateEventDto.city || null,
          updateEventDto.state || null,
          updateEventDto.description,
          updateEventDto.bannerUrl || null,
          updateEventDto.isActive !== undefined
            ? updateEventDto.isActive
            : true,
          updateEventDto.isPublic !== undefined
            ? updateEventDto.isPublic
            : false,
          userId,
          id,
        ],
      );

    return updateResult;
  }
}
