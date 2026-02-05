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
        example: '9f64ef96-878d-454d-bdfb-436cbd639631',
        description: 'ID of the instructor assigned to this course'
    })
    @IsUUID()
    @IsNotEmpty()
    instructorId: string;
}
