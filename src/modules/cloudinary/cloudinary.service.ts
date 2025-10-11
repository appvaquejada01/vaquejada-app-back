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
    // Validações do arquivo
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
                  `Upload failed: ${error.message}`,
                ),
              );
            } else if (result) {
              resolve(result);
            } else {
              reject(
                new InternalServerErrorException(
                  'Upload failed: No result returned from Cloudinary.',
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
                  `Upload failed: ${error.message}`,
                ),
              );
            } else if (result) {
              resolve(result);
            } else {
              reject(
                new InternalServerErrorException(
                  'Upload failed: No result returned from Cloudinary.',
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
        `Failed to delete image: ${error.message}`,
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
      console.error('Error deleting image by URL:', error);
    }
  }

  private validateImageFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado');
    }

    // Verificar tipo MIME
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

    // Verificar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `Arquivo muito grande. Tamanho máximo: 5MB`,
      );
    }

    // Verificar se é uma imagem válida
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
