import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Category } from 'src/entities/category.entity';
import { ConnectionTypeEnum } from 'src/utils/database';
import { GetCategoryResponseDto } from '../dto';

@Injectable()
export class GetCategoryService {
  constructor(
    @InjectDataSource(ConnectionTypeEnum.DEFAULT)
    private readonly dataSource: DataSource,
  ) {}

  async getById(id: string): Promise<GetCategoryResponseDto> {
    const category = await this.dataSource
      .getRepository(Category)
      .findOne({ where: { id } });
    if (!category) throw new NotFoundException('Categoria não encontrada');
    return GetCategoryResponseDto.fromEntity(category);
  }
}
