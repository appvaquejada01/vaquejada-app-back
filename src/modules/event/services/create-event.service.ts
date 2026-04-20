import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';

import { Event } from 'src/entities';
import { InsertQueryResponse } from 'src/shared/types/typeorm';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';

import { CreateEventDto, CreateEventResponseDto } from '../dto';

@Injectable()
export class CreateEventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    organizerId: string,
    bannerFile?: Express.Multer.File,
  ): Promise<CreateEventResponseDto> {
    this.validateEventDates(
      createEventDto.startAt,
      createEventDto.endAt,
      createEventDto.purchaseClosedAt,
    );

    if (bannerFile) {
      const uploadResult =
        await this.cloudinaryService.uploadEventBanner(bannerFile);

      createEventDto.bannerUrl = uploadResult.secure_url;
      createEventDto.bannerPublicId = uploadResult.public_id;
    }

    const savedEvent = await this.insertEvent(createEventDto, organizerId);

    return CreateEventResponseDto.fromEntity(savedEvent);
  }

  private validateEventDates(
    startAt: string,
    endAt: string,
    purchaseClosedAt: string,
  ): void {
    const startDate = new Date(startAt);
    const endDate = new Date(endAt);
    const purchaseCloseDate = new Date(purchaseClosedAt);
    const now = new Date();

    if (startDate >= endDate) {
      throw new BadRequestException(
        'Data de início deve ser anterior à data de término',
      );
    }

    if (startDate < now) {
      throw new BadRequestException('Data de início não pode ser no passado');
    }
  }

  private async insertEvent(
    createEventDto: CreateEventDto,
    organizerId: string,
  ): Promise<Event> {
    const [event]: InsertQueryResponse<Event> =
      await this.eventRepository.query(
        `
      INSERT INTO 
        events
        (name, 
        "startAt", 
        "endAt", 
        "purchaseClosedAt", 
        status, 
        prize,
        address, 
        city, 
        state, 
        description, 
        is_active, 
        "isPublic", 
        "organizerId", 
        "bannerUrl",
        "bannerPublicId",
        "createdAt", 
        "createdUserId",
        "createdFunctionName")
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), $16, 'CreateEventService.insertEvent')
      RETURNING *`,
        [
          createEventDto.name,
          createEventDto.startAt,
          createEventDto.endAt,
          createEventDto.purchaseClosedAt,
          createEventDto.status,
          createEventDto.prize,
          createEventDto.address || null,
          createEventDto.city || null,
          createEventDto.state || null,
          createEventDto.description,
          true,
          createEventDto.isPublic === 'true' ? true : false,
          organizerId,
          createEventDto.bannerUrl || null,
          createEventDto.bannerPublicId || null,
          organizerId,
        ],
      );

    return event;
  }
}
