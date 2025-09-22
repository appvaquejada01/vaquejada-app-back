import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { PaginatedResponseDto } from 'src/shared/dto';

import { CategoryResponseDto } from '../dto';
import { CreateCategoryResponseDto } from '../dto';

export function CategoryCreateDocumentation() {
  const decorators = [
    ApiOperation({ summary: 'Criar nova categoria (apenas ADMIN)' }),
    ApiResponse({
      status: 201,
      description: 'Categoria criada com sucesso',
      type: CreateCategoryResponseDto,
    }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 409, description: 'Categoria já existe' }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
  ];
  return applyDecorators(...decorators);
}

export function CategoryFindAllDocumentation() {
  const decorators = [
    ApiOperation({ summary: 'Listar todas as categorias' }),
    ApiQuery({ name: 'page', required: false, type: Number }),
    ApiQuery({ name: 'limit', required: false, type: Number }),
    ApiQuery({ name: 'isActive', required: false, type: Boolean }),
    ApiResponse({
      status: 200,
      description: 'Lista de categorias retornada com sucesso',
      type: PaginatedResponseDto<CategoryResponseDto>,
    }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
  ];
  return applyDecorators(...decorators);
}

export function CategoryFindOneDocumentation() {
  const decorators = [
    ApiOperation({ summary: 'Buscar categoria por ID' }),
    ApiParam({ name: 'id', description: 'UUID da categoria' }),
    ApiResponse({
      status: 200,
      description: 'Categoria encontrada',
      type: CategoryResponseDto,
    }),
    ApiResponse({ status: 404, description: 'Categoria não encontrada' }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
  ];
  return applyDecorators(...decorators);
}

export function CategoryUpdateDocumentation() {
  const decorators = [
    ApiOperation({ summary: 'Atualizar categoria (apenas ADMIN)' }),
    ApiParam({ name: 'id', description: 'UUID da categoria' }),
    ApiResponse({
      status: 200,
      description: 'Categoria atualizada com sucesso',
      type: CategoryResponseDto,
    }),
    ApiResponse({ status: 404, description: 'Categoria não encontrada' }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
    ApiResponse({ status: 401, description: 'Não autorizado' }),
    ApiResponse({ status: 403, description: 'Acesso negado' }),
  ];
  return applyDecorators(...decorators);
}
