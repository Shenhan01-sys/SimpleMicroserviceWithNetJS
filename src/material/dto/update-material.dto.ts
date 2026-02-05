import { PartialType } from '@nestjs/swagger';
import { CreateMaterialDto } from './create-material.dto';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMaterialDto extends PartialType(CreateMaterialDto) {
    @ApiProperty({
        description: 'URL of uploaded file in Supabase Storage',
        example: 'https://project.supabase.co/storage/v1/object/public/materials/uuid/file.pdf',
        required: false,
    })
    @IsOptional()
    @IsString()
    fileUrl?: string;
}
