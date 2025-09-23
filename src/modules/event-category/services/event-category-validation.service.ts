import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRoleEnum } from 'src/modules/user/enums';
import { EventStatusEnum } from 'src/modules/event/enums';
import { Category, Event, EventCategory } from 'src/entities';

@Injectable()
export class EventCategoryValidationService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(EventCategory)
    private readonly eventCategoryRepository: Repository<EventCategory>,
  ) {}

  async validateEvent(
    eventId: string,
    userId: string,
    userRole: UserRoleEnum,
  ): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['organizer'],
    });
    if (!event) throw new NotFoundException('Evento não encontrado');
    this.checkEventPermission(event, userId, userRole);
    return event;
  }

  async validateEventCategory(
    eventCategoryId: string,
    eventId: string,
  ): Promise<EventCategory> {
    const eventCategory = await this.eventCategoryRepository.findOne({
      where: { id: eventCategoryId, event: { id: eventId } },
    });
    if (!eventCategory)
      throw new NotFoundException('Categoria de evento não encontrada');
    return eventCategory;
  }

  validateEventStatusForModification(event: Event): void {
    if (event.status !== EventStatusEnum.SCHEDULED) {
      throw new BadRequestException(
        'Só é possível modificar categorias em eventos com status SCHEDULED',
      );
    }
    if (new Date() > new Date(event.purchaseClosedAt)) {
      throw new BadRequestException(
        'Período de modificação encerrado (purchaseClosedAt)',
      );
    }
  }

  async validateCategory(categoryId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) throw new NotFoundException('Categoria não encontrada');
    if (!category.isActive)
      throw new BadRequestException('Categoria não está ativa');
    return category;
  }

  async checkExistingEventCategory(
    eventId: string,
    categoryId: string,
  ): Promise<void> {
    const existing = await this.eventCategoryRepository.findOne({
      where: { event: { id: eventId }, category: { id: categoryId } },
    });
    if (existing)
      throw new ConflictException('Esta categoria já foi adicionada ao evento');
  }

  validateEventCategoryDates(
    startAt: string,
    endAt: string,
    eventStartAt: string,
    eventEndAt: string,
  ): void {
    const categoryStart = new Date(startAt);
    const categoryEnd = new Date(endAt);
    const eventStart = new Date(eventStartAt);
    const eventEnd = new Date(eventEndAt);
    const now = new Date();

    if (categoryStart >= categoryEnd)
      throw new BadRequestException(
        'Data de início deve ser anterior à de término',
      );
    if (categoryStart < eventStart)
      throw new BadRequestException(
        'Categoria não pode começar antes do evento',
      );
    if (categoryEnd > eventEnd)
      throw new BadRequestException(
        'Categoria não pode terminar depois do evento',
      );
    if (categoryStart < now)
      throw new BadRequestException('Categoria não pode começar no passado');
  }

  validateCapacity(maxRunners: number, currentRunners = 0): void {
    if (maxRunners <= 0)
      throw new BadRequestException('Capacidade deve ser maior que zero');
    if (maxRunners < currentRunners)
      throw new BadRequestException(
        'Nova capacidade não pode ser menor que participantes atuais',
      );
  }

  private checkEventPermission(
    event: Event,
    userId: string,
    userRole: UserRoleEnum,
  ): void {
    if (userRole === UserRoleEnum.ADMIN) return;
    if (userRole === UserRoleEnum.ORGANIZER && event.organizerId === userId)
      return;
    throw new ForbiddenException('Acesso negado para editar este evento');
  }
}
