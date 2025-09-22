import {
  Get,
  Put,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Controller,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { UserRoleEnum } from 'src/modules/user/enums';
import { JwtAuthGuard, RolesGuard } from 'src/shared/guards';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { PaginatedResponseDto, PaginationDto } from 'src/shared/dto';

import {
  UpdateCategoryDto,
  CreateCategoryDto,
  CategoryResponseDto,
  CreateCategoryResponseDto,
} from '../dto';
import {
  CategoryUpdateDocumentation,
  CategoryFindAllDocumentation,
  CategoryFindOneDocumentation,
  CategoryCreateDocumentation,
} from '../docs';
import {
  GetCategoryService,
  ListCategoryService,
  UpdateCategoryService,
  CreateCategoryService,
} from '../services';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoryController {
  constructor(
    private readonly createCategoryService: CreateCategoryService,
    private readonly updateCategoryService: UpdateCategoryService,
    private readonly listCategoriesService: ListCategoryService,
    private readonly getCategoryService: GetCategoryService,
  ) {}

  @Post()
  @Roles(UserRoleEnum.ADMIN)
  @CategoryCreateDocumentation()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CreateCategoryResponseDto> {
    return this.createCategoryService.create(createCategoryDto);
  }

  @Get()
  @CategoryFindAllDocumentation()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('isActive') isActive?: boolean,
  ): Promise<PaginatedResponseDto<CategoryResponseDto>> {
    return this.listCategoriesService.findAll(paginationDto, isActive);
  }

  @Get(':id')
  @CategoryFindOneDocumentation()
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryResponseDto> {
    return this.getCategoryService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRoleEnum.ADMIN)
  @CategoryUpdateDocumentation()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    return this.updateCategoryService.update(id, updateCategoryDto);
  }
}
