import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsInt, IsUUID, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export enum MaterialType {
    VIDEO = 'VIDEO',
    PDF = 'PDF',
    QUIZ = 'QUIZ',
    DOCUMENT = 'DOCUMENT',
}

export class CreateMaterialDto {
    @ApiProperty({ example: 'Introduction to Dependency Injection', description: 'Material title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description: 'Text content of the material (optional, can be null if file is provided)',
        example: 'Introduction to programming fundamentals...',
        required: false,
    })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiProperty({
        example: 'VIDEO',
        description: 'Material type',
        enum: MaterialType,
        default: MaterialType.DOCUMENT
    })
    @IsEnum(MaterialType)
    type: MaterialType;

    @ApiProperty({
        example: 1,
        description: 'Order/sequence of material in the course (starts from 0)',
        minimum: 0,
        default: 0
    })
    @Type(() => Number)  // Transform string to number for multipart form-data
    @IsInt()
    @Min(0)
    order: number;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Course ID this material belongs to'
    })
    @IsUUID()
    @IsNotEmpty()
    courseId: string;
}
