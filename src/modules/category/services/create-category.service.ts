import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { Category } from 'src/entities/category.entity';
import { ConnectionTypeEnum } from 'src/utils/database';
import { InsertQueryResponse } from 'src/shared/types/typeorm';

import { CreateCategoryDto, CreateCategoryResponseDto } from '../dto';

@Injectable()
export class CreateCategoryService {
  constructor(
    @InjectDataSource(ConnectionTypeEnum.DEFAULT)
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateCategoryDto): Promise<CreateCategoryResponseDto> {
    const category = await this.insertCategory(dto);

    return CreateCategoryResponseDto.fromEntity(category);
  }

  private async insertCategory(dto: CreateCategoryDto): Promise<Category> {
    const [category]: InsertQueryResponse<Category> =
      await this.dataSource.query(
        `
      INSERT INTO 
        "categories" 
        (name, 
        observation, 
        "startAt", 
        "endAt", 
        "passQuantity", 
        "inscriptionPrice", 
        "createdAt", 
        "createdFunctionName")
      VALUES 
        ($1, $2, $3, $4, $5, $6, NOW(), 'CreateCategoryService.insertCategory')
      RETURNING *`,
        [
          dto.name,
          dto.observation,
          dto.startAt,
          dto.endAt,
          dto.passQuantity,
          dto.inscriptionPrice,
        ],
      );

    return category;
  }
}
