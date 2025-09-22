import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { PaginatedResponseDto } from 'src/shared/dto';

import {
  EventResponseDto,
  QueryListEventDto,
  CreateEventResponseDto,
} from '../dto';
import { EventStatusEnum } from '../enums';

export function EventCreateDocumentation() {
  const decorators = [
    ApiOperation({ summary: 'Criar novo evento' }),
    ApiResponse({
      status: 201,
      description: 'Evento criado com sucesso',
      type: CreateEventResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
  ];
  return applyDecorators(...decorators);
}

export function EventFindAllDocumentation() {
  const decorators = [
    ApiOperation({ summary: 'Listar todos os eventos' }),
    ApiQuery({ name: 'query', required: false, type: QueryListEventDto }),
    ApiResponse({
      status: 200,
      description: 'Lista de eventos retornada com sucesso',
      type: PaginatedResponseDto<EventResponseDto>,
    }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
  ];
  return applyDecorators(...decorators);
}

export function EventFindOneDocumentation() {
  const decorators = [
    ApiOperation({ summary: 'Buscar evento por ID' }),
    ApiParam({ name: 'id', description: 'UUID do evento' }),
    ApiResponse({
      status: 200,
      description: 'Evento encontrado',
      type: EventResponseDto,
    }),
    ApiResponse({ status: 404, description: 'Evento não encontrado' }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
  ];
  return applyDecorators(...decorators);
}

export function EventUpdateDocumentation() {
  const decorators = [
    ApiOperation({ summary: 'Atualizar evento' }),
    ApiParam({ name: 'id', description: 'UUID do evento' }),
    ApiResponse({
      status: 200,
      description: 'Evento atualizado com sucesso',
      type: EventResponseDto,
    }),
    ApiResponse({ status: 404, description: 'Evento não encontrado' }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
  ];
  return applyDecorators(...decorators);
}

export function EventDeleteDocumentation() {
  const decorators = [
    ApiOperation({ summary: 'Excluir evento' }),
    ApiParam({ name: 'id', description: 'UUID do evento' }),
    ApiResponse({ status: 204, description: 'Evento excluído com sucesso' }),
    ApiResponse({ status: 404, description: 'Evento não encontrado' }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
  ];
  return applyDecorators(...decorators);
}

export function EventChangeStatusDocumentation() {
  const decorators = [
    ApiOperation({ summary: 'Alterar status do evento' }),
    ApiParam({ name: 'id', description: 'UUID do evento' }),
    ApiQuery({ name: 'status', required: true, enum: EventStatusEnum }),
    ApiResponse({
      status: 200,
      description: 'Status do evento alterado com sucesso',
      type: EventResponseDto,
    }),
    ApiResponse({ status: 404, description: 'Evento não encontrado' }),
    ApiResponse({ status: 400, description: 'Status inválido' }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
  ];
  return applyDecorators(...decorators);
}
