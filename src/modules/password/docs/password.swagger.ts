import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import {
  PasswordDto,
  CreatePasswordDto,
  PasswordResponseDto,
  PurchasePasswordDto,
  QueryListPasswordDto,
} from '../dto';

export function PasswordCreateDocumentation() {
  return applyDecorators(
    ApiOperation({ summary: 'Criar senha' }),
    ApiBody({ type: CreatePasswordDto }),
    ApiResponse({
      status: 201,
      description: 'Senha criada com sucesso',
      type: PasswordResponseDto,
    }),
    ApiResponse({
      status: 409,
      description:
        'Já existe uma senha com esse código para esta categoria de evento.',
    }),
  );
}

export function PasswordListDocumentation() {
  return applyDecorators(
    ApiOperation({ summary: 'Listar senhas' }),
    ApiQuery({ name: 'query', required: true, type: QueryListPasswordDto }),
    ApiResponse({
      status: 200,
      description: 'Lista de senhas',
      type: PasswordResponseDto,
      isArray: true,
    }),
  );
}

export function PasswordPurchaseDocumentation() {
  return applyDecorators(
    ApiOperation({ summary: 'Comprar senha' }),
    ApiBody({ type: PurchasePasswordDto }),
    ApiResponse({
      status: 201,
      description: 'Senha comprada com sucesso',
      type: PasswordDto,
    }),
    ApiResponse({
      status: 409,
      description:
        'Já existe uma senha com esse código para esta categoria de evento.',
    }),
  );
}
