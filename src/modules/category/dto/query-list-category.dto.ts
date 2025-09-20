import { IsOptional, IsString } from 'class-validator';

export class QueryListCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;
}
