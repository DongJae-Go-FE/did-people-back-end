import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseService } from '../supabase/supabase.service';
import { UploadResponseDto } from './dto/upload-response.dto';

// Supabase public URL에서 버킷 이후 경로만 추출
function extractStoragePath(publicUrl: string, bucket: string): string {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) throw new BadRequestException('올바르지 않은 파일 URL입니다');
  return publicUrl.slice(idx + marker.length);
}

@Injectable()
export class UploadService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly config: ConfigService,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadResponseDto> {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid image type. Allowed: ${allowedMimeTypes.join(', ')}`,
      );
    }

    const ext = file.originalname.split('.').pop();
    const path = `images/${uuidv4()}.${ext}`;
    const bucket = this.config.getOrThrow<string>('SUPABASE_STORAGE_BUCKET');

    const url = await this.supabaseService.uploadFile(
      bucket,
      path,
      file.buffer,
      file.mimetype,
    );

    return { url, filename: file.originalname, size: file.size };
  }

  async uploadExcel(file: Express.Multer.File): Promise<UploadResponseDto> {
    const allowedMimeTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed: xlsx, xls, csv`,
      );
    }

    const ext = file.originalname.split('.').pop();
    const path = `excel/${uuidv4()}.${ext}`;
    const bucket = this.config.getOrThrow<string>('SUPABASE_STORAGE_BUCKET');

    const url = await this.supabaseService.uploadFile(
      bucket,
      path,
      file.buffer,
      file.mimetype,
    );

    return { url, filename: file.originalname, size: file.size };
  }

  async deleteImage(url: string): Promise<{ message: string }> {
    const bucket = this.config.getOrThrow<string>('SUPABASE_STORAGE_BUCKET');
    const path = extractStoragePath(url, bucket);
    await this.supabaseService.deleteFile(bucket, path);
    return { message: '파일 삭제 완료' };
  }
}
