import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCourseDto {
    @ApiProperty({ example: 'Introduction to NestJS', description: 'Course title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: 'Learn the fundamentals of NestJS framework',
        description: 'Course description',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Instructor user ID'
    })
    @IsUUID()
    @IsNotEmpty()
    instructorId: string;
}
