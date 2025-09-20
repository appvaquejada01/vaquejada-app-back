import {
  Put,
  Get,
  Body,
  Post,
  Query,
  Param,
  UseGuards,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/shared/guards';
import { RequestUser } from 'src/shared/decorators';
import { AuthenticatedUser } from 'src/shared/types/routes';

import {
  UpdateCategoryDto,
  QueryListCategoryDto,
  GetCategoryResponseDto,
  ListCategoryResponseDto,
  UpdateCategoryResponseDto,
  CreateCategoryDto,
} from '../dto';

import {
  GetCategoryService,
  ListCategoryService,
  UpdateCategoryService,
  CreateCategoryService,
} from '../services';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(
    private readonly listCategoryService: ListCategoryService,
    private readonly getCategoryService: GetCategoryService,
    private readonly updateCategoryService: UpdateCategoryService,
    private readonly createCategoryService: CreateCategoryService,
  ) {}

  @Post()
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.createCategoryService.create(dto);
  }

  @Get()
  async listCategories(
    @Query() query: QueryListCategoryDto,
  ): Promise<ListCategoryResponseDto[]> {
    return this.listCategoryService.list(query);
  }

  @Get(':categoryId')
  async getCategory(
    @Param('categoryId', new ParseUUIDPipe({ version: '4' }))
    categoryId: string,
  ): Promise<GetCategoryResponseDto> {
    return this.getCategoryService.getById(categoryId);
  }

  @Put(':categoryId')
  async updateCategory(
    @RequestUser() requestUser: AuthenticatedUser,
    @Param('categoryId', new ParseUUIDPipe({ version: '4' }))
    categoryId: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<UpdateCategoryResponseDto> {
    return this.updateCategoryService.update(categoryId, dto, requestUser.id);
  }
}
