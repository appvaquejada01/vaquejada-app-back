import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { PaginatedResponseDto } from 'src/shared/dto';
import { EventCategoryResponseDto, ListEventCategoryResponseDto } from '../dto';

export function EventCategoryCreateDocumentation() {
  const decorators = [
    ApiOperation({
      summary: 'Criar nova categoria para o evento (apenas ADMIN ou OWNER)',
    }),
    ApiResponse({
      status: 201,
      description: 'Categoria criada com sucesso',
      type: EventCategoryResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 409, description: 'Categoria já existe' }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
  ];
  return applyDecorators(...decorators);
}

export function EventCategoryFindAllDocumentation() {
  const decorators = [
    ApiOperation({ summary: 'Listar todas as categorias do evento' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'eventId', required: false, type: String }),
    ApiResponse({
      status: 200,
      description: 'Lista de categorias retornada com sucesso',
      type: PaginatedResponseDto<ListEventCategoryResponseDto>,
    }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
  ];
  return applyDecorators(...decorators);
}

export function EventCategoryFindOneDocumentation() {
  const decorators = [
    ApiOperation({ summary: 'Buscar categoria por ID' }),
    ApiParam({ name: 'eventId', description: 'UUID do evento' }),
    ApiParam({ name: 'eventCategoryId', description: 'UUID da categoria' }),
    ApiResponse({
      status: 200,
      description: 'Categoria encontrada',
      type: EventCategoryResponseDto,
    }),
    ApiResponse({ status: 404, description: 'Categoria não encontrada' }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
  ];
  return applyDecorators(...decorators);
}

export function EventCategoryUpdateDocumentation() {
  const decorators = [
    ApiOperation({
      summary: 'Atualizar categoria do evento (apenas ADMIN ou OWNER)',
    }),
    ApiParam({ name: 'eventCategoryId', description: 'UUID da categoria' }),
    ApiResponse({
      status: 200,
      description: 'Categoria atualizada com sucesso',
      type: EventCategoryResponseDto,
    }),
    ApiResponse({ status: 404, description: 'Categoria não encontrada' }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
  ];
  return applyDecorators(...decorators);
}
