import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { Event } from 'src/entities';
import { EventStatusEnum } from 'src/modules/event/enums';

export class JudgeResponseDto {
  @ApiProperty({ description: 'ID do juiz' })
  id: string;

  @ApiProperty({ description: 'Nome do juiz' })
  name: string;

  @ApiProperty({ description: 'Email do juiz' })
  email?: string;
}

export class PasswordResponseDto {
  @ApiProperty({ description: 'ID da senha' })
  id: string;

  @ApiProperty({ description: 'Número da senha' })
  number: number;

  @ApiProperty({ description: 'Status da senha' })
  status: string;
}

export class SubscriptionResponseDto {
  @ApiProperty({ description: 'ID da assinatura' })
  id: string;

  @ApiProperty({ description: 'Data de criação da assinatura' })
  createdAt: Date;

  @ApiProperty({ description: 'Status da assinatura' })
  status: string;

  @ApiProperty({
    type: [PasswordResponseDto],
    description: 'Senhas associadas à assinatura',
  })
  @Type(() => PasswordResponseDto)
  passwords: PasswordResponseDto[];
}

export class RunnerResponseDto {
  @ApiProperty({ description: 'ID do corredor' })
  id: string;

  @ApiProperty({ description: 'Nome do corredor' })
  name: string;

  @ApiProperty({ description: 'Categoria do corredor' })
  category?: string;

  @ApiProperty({
    type: [SubscriptionResponseDto],
    description: 'Assinaturas e senhas do corredor',
  })
  @Type(() => SubscriptionResponseDto)
  subscriptions?: SubscriptionResponseDto[];
}

export class JudgeEventResponseDto {
  @ApiProperty({ description: 'ID do evento' })
  id: string;

  @ApiProperty({ description: 'Nome do evento' })
  name: string;

  @ApiProperty({ description: 'Descrição do evento' })
  description?: string;

  @ApiProperty({ description: 'Data e hora de início' })
  startAt: string;

  @ApiProperty({ description: 'Data e hora de término' })
  endAt?: string;

  @ApiProperty({ description: 'Local do evento' })
  location?: string;

  @ApiProperty({ description: 'Status do evento', enum: EventStatusEnum })
  status: EventStatusEnum;

  @ApiProperty({ description: 'Indica se o evento está ativo' })
  isActive: boolean;

  @ApiProperty({ description: 'URL do banner do evento' })
  bannerUrl?: string;

  @ApiProperty({
    type: [JudgeResponseDto],
    description: 'Lista de juízes do evento',
  })
  @Type(() => JudgeResponseDto)
  judges: JudgeResponseDto[];

  @ApiProperty({
    type: [RunnerResponseDto],
    description: 'Lista de corredores do evento',
  })
  @Type(() => RunnerResponseDto)
  runners?: RunnerResponseDto[];

  @ApiProperty({ description: 'Data de criação do evento' })
  createdAt: Date;
}

export class ListJudgeEventsResponseDto {
  @ApiProperty({
    type: [JudgeEventResponseDto],
    description: 'Lista de eventos associados ao juiz',
  })
  @Type(() => JudgeEventResponseDto)
  events: JudgeEventResponseDto[];

  static fromEntities(events: Event[]): ListJudgeEventsResponseDto {
    const dto = new ListJudgeEventsResponseDto();
    dto.events = events.map((event) => this.mapEvent(event));
    return dto;
  }

  private static mapEvent(event: Event): JudgeEventResponseDto {
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      startAt: event.startAt,
      endAt: event.endAt,
      location: `${event.address}, ${event.city} - ${event.state}`,
      status: event.status,
      isActive: event.isActive,
      bannerUrl: event.bannerUrl,
      judges:
        event.judges?.map((judge) => ({
          id: judge.id,
          name: judge.name,
          email: judge.email,
        })) || [],
      runners:
        event.runners?.map((runner) => ({
          id: runner.id,
          name: runner.name,
          subscriptions:
            runner.subscriptions?.map((sub) => ({
              id: sub.id,
              createdAt: sub.createdAt,
              status: sub.status,
              passwords:
                sub.passwords?.map((pwd) => ({
                  id: pwd.id,
                  number: Number(pwd.number),
                  status: pwd.status,
                })) || [],
            })) || [],
        })) || [],
      createdAt: event.createdAt,
    };
  }
}
