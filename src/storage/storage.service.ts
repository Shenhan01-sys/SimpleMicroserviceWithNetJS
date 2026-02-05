import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
    private supabase: SupabaseClient;
    private bucketName = 'materials';

    constructor(private config: ConfigService) {
        const supabaseUrl = this.config.get<string>('SUPABASE_URL');
        const supabaseKey = this.config.get<string>('SUPABASE_SERVICE_KEY');

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials not configured');
        }

        this.supabase = createClient(supabaseUrl, supabaseKey);
    }

    async uploadFile(file: Express.Multer.File, materialId: string): Promise<string> {
        try {
            // Generate unique filename
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${materialId}/${Date.now()}.${fileExt}`;

            // Upload to Supabase Storage
            const { data, error } = await this.supabase.storage
                .from(this.bucketName)
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                    upsert: true,
                });

            if (error) {
                throw new BadRequestException(`File upload failed: ${error.message}`);
            }

            // Get public URL
            const { data: urlData } = this.supabase.storage
                .from(this.bucketName)
                .getPublicUrl(fileName);

            return urlData.publicUrl;
        } catch (error) {
            throw new BadRequestException(`Failed to upload file: ${error.message}`);
        }
    }

    async deleteFile(fileUrl: string): Promise<void> {
        try {
            // Extract file path from full URL
            // Example URL: https://project.supabase.co/storage/v1/object/public/materials/uuid/timestamp.pdf
            const urlParts = fileUrl.split('/');
            const bucketIndex = urlParts.findIndex(part => part === this.bucketName);

            if (bucketIndex === -1) {
                return; // URL doesn't match expected format, skip deletion
            }

            const filePath = urlParts.slice(bucketIndex + 1).join('/');

            await this.supabase.storage
                .from(this.bucketName)
                .remove([filePath]);
        } catch (error) {
            console.error('Failed to delete file from storage:', error.message);
            // Don't throw - file deletion failure shouldn't block material deletion
        }
    }
}
