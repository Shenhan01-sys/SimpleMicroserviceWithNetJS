import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsInt, IsUUID, Min } from 'class-validator';

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
        example: 'Content about dependency injection in NestJS...',
        description: 'Material content (text, URL, or embedded content)'
    })
    @IsString()
    @IsNotEmpty()
    content: string;

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
