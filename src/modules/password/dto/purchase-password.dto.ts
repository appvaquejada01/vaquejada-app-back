import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class PurchasePasswordDto {
  @ApiProperty()
  @IsUUID()
  eventId: string;

  @ApiProperty()
  @IsUUID()
  categoryId: string;

  @ApiProperty({ type: [String] })
  @IsUUID('4', { each: true })
  passwordIds: string[];
}
