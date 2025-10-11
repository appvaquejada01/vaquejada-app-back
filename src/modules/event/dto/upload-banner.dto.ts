import { ApiProperty } from '@nestjs/swagger';

export class UploadBannerDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Arquivo de imagem do banner (JPG, PNG, WEBP)',
  })
  file: any;
}

export class UploadBannerResponseDto {
  @ApiProperty({ description: 'URL pública da imagem' })
  url: string;

  @ApiProperty({ description: 'Public ID no Cloudinary' })
  publicId: string;

  @ApiProperty({ description: 'Formato da imagem' })
  format: string;

  @ApiProperty({ description: 'Largura da imagem' })
  width: number;

  @ApiProperty({ description: 'Altura da imagem' })
  height: number;

  @ApiProperty({ description: 'Tamanho do arquivo em bytes' })
  bytes: number;

  @ApiProperty({ description: 'URL segura (HTTPS)' })
  secureUrl: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: string;
}
