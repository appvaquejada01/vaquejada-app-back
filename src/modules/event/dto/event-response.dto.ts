import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventStatusEnum } from '../enums/event-status.enum';
import { Event } from 'src/entities';

export class EventResponseDto {
  @ApiProperty({ description: 'ID do evento' })
  id: string;

  @ApiProperty({ description: 'Nome do evento' })
  name: string;

  @ApiProperty({ description: 'Data e hora de início' })
  startAt: string;

  @ApiProperty({ description: 'Data e hora de término' })
  endAt: string;

  @ApiProperty({ description: 'Data limite para compras' })
  purchaseClosedAt: string;

  @ApiProperty({ enum: EventStatusEnum, description: 'Status do evento' })
  status: EventStatusEnum;

  @ApiProperty({ description: 'Prêmio do evento' })
  prize: string;

  @ApiPropertyOptional({ description: 'Endereço do evento' })
  address?: string;

  @ApiPropertyOptional({ description: 'Cidade do evento' })
  city?: string;

  @ApiPropertyOptional({ description: 'Estado do evento' })
  state?: string;

  @ApiProperty({ description: 'Descrição do evento' })
  description: string;

  @ApiPropertyOptional({ description: 'URL do banner' })
  bannerUrl?: string;

  @ApiProperty({ description: 'Se o evento está ativo' })
  isActive: boolean;

  @ApiProperty({ description: 'Se o evento é público' })
  isPublic: boolean;

  @ApiProperty({ description: 'ID do organizador' })
  organizerId: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;

  static fromEntity(entity: Event): EventResponseDto {
    const response = new EventResponseDto();

    response.id = entity.id;
    response.name = entity.name;
    response.startAt = entity.startAt;
    response.endAt = entity.endAt;
    response.purchaseClosedAt = entity.purchaseClosedAt;
    response.status = entity.status;
    response.address = entity.address;
    response.city = entity.city;
    response.state = entity.state;
    response.prize = entity.prize;
    response.description = entity.description;
    response.bannerUrl = entity.bannerUrl;
    response.isActive = entity.isActive;
    response.isPublic = entity.isPublic;
    response.organizerId = entity.organizerId;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;

    return response;
  }
}

export class CreateEventResponseDto extends EventResponseDto {
  static fromEntity(entity: Event): CreateEventResponseDto {
    return super.fromEntity(entity) as CreateEventResponseDto;
  }
}
