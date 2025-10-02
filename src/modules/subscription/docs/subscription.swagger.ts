import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';

export function SubscriptionListDocumentation() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar inscrições' }),
    ApiQuery({
      name: 'userId',
      required: false,
      type: String,
      description: 'ID do usuário',
    }),
    ApiQuery({
      name: 'eventId',
      required: false,
      type: String,
      description: 'ID do evento',
    }),
    ApiQuery({
      name: 'categoryId',
      required: false,
      type: String,
      description: 'ID da categoria',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de inscrições',
      isArray: true,
    }),
  );
}

export function SubscriptionGetDocumentation() {
  return applyDecorators(
    ApiOperation({ summary: 'Buscar inscrição por ID' }),
    ApiParam({
      name: 'id',
      required: true,
      type: String,
      description: 'ID da inscrição',
    }),
    ApiResponse({ status: 200, description: 'Inscrição encontrada' }),
    ApiResponse({ status: 404, description: 'Inscrição não encontrada' }),
  );
}
