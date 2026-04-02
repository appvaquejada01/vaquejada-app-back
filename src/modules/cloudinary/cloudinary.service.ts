import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {}

  async uploadEventBanner(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    this.validateImageFile(file);

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: 'event_banners',
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 600, crop: 'limit' }, // Tamanho ideal para banners
              { quality: 'auto' },
              { format: 'webp' }, // Conversão para WebP
            ],
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            max_bytes: 5 * 1024 * 1024, // 5MB
          },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) {
              reject(
                new InternalServerErrorException(
                  `Falha no upload: ${error.message}`,
                ),
              );
            } else if (result) {
              resolve(result);
            } else {
              reject(
                new InternalServerErrorException(
                  'Falha no upload: nenhum resultado retornado pelo Cloudinary.',
                ),
              );
            }
          },
        )
        .end(file.buffer);
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'general',
    transformations: any[] = [],
  ): Promise<UploadApiResponse> {
    this.validateImageFile(file);

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: 'image',
            transformation: [
              { quality: 'auto' },
              { format: 'auto' },
              ...transformations,
            ],
          },
          (error, result) => {
            if (error) {
              reject(
                new InternalServerErrorException(
                  `Falha no upload: ${error.message}`,
                ),
              );
            } else if (result) {
              resolve(result);
            } else {
              reject(
                new InternalServerErrorException(
                  'Falha no upload: nenhum resultado retornado pelo Cloudinary.',
                ),
              );
            }
          },
        )
        .end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Falha ao deletar imagem: ${error.message}`,
      );
    }
  }

  async deleteImageByUrl(imageUrl: string): Promise<void> {
    try {
      const publicId = this.extractPublicIdFromUrl(imageUrl);
      if (publicId) {
        await this.deleteImage(publicId);
      }
    } catch (error) {
      console.error('Erro ao deletar imagem por URL:', error);
    }
  }

  private validateImageFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Tipo de arquivo não suportado. Tipos permitidos: ${allowedMimeTypes.join(', ')}`,
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `Arquivo muito grande. Tamanho máximo: 5MB`,
      );
    }

    if (!file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Arquivo de imagem inválido');
    }
  }

  private extractPublicIdFromUrl(url: string): string | null {
    try {
      const matches = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
      return matches ? matches[1] : null;
    } catch {
      return null;
    }
  }

  generateOptimizedUrl(publicId: string, transformations: any[] = []) {
    return cloudinary.url(publicId, {
      transformation: [{ quality: 'auto', format: 'auto' }, ...transformations],
    });
  }
}
