import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient | null = null;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private readonly config: ConfigService) {
    const url = this.config.get<string>('SUPABASE_URL');
    const serviceRoleKey = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');
    const anonKey = this.config.get<string>('SUPABASE_ANON_KEY');

    const key = serviceRoleKey || anonKey;
    if (url && key) {
      this.client = createClient(url, key, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
    } else {
      this.logger.warn('Supabase credentials not set — Storage features disabled');
    }
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    if (!this.client) throw new InternalServerErrorException('Storage not configured');

    const { error } = await this.client.storage.from(bucket).remove([path]);
    if (error) {
      this.logger.error('Delete error', error.message);
      throw new InternalServerErrorException('File delete failed');
    }
  }

  async uploadFile(
    bucket: string,
    path: string,
    file: Buffer,
    contentType: string,
  ): Promise<string> {
    if (!this.client) throw new InternalServerErrorException('Storage not configured');

    const { error } = await this.client.storage
      .from(bucket)
      .upload(path, file, { contentType, upsert: false });

    if (error) {
      this.logger.error('Upload error', error.message);
      throw new InternalServerErrorException('File upload failed');
    }

    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
}
