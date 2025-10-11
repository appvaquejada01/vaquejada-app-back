import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';

import { UploadBannerResponseDto } from '../dto/upload-banner.dto';

@Injectable()
export class UploadEventBannerService {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  async uploadBanner(
    file: Express.Multer.File,
  ): Promise<UploadBannerResponseDto> {
    const uploadResult = await this.cloudinaryService.uploadEventBanner(file);

    return {
      url: uploadResult.url,
      publicId: uploadResult.public_id,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes,
      secureUrl: uploadResult.secure_url,
      createdAt: uploadResult.created_at,
    };
  }
}
