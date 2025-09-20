import { IsOptional, IsString, IsDateString } from 'class-validator';

export class QueryListEventDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}
