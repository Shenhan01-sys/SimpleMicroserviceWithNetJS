import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';

export enum UserRole {
    STUDENT = 'STUDENT',
    INSTRUCTOR = 'INSTRUCTOR',
    ADMIN = 'ADMIN',
}

export class CreateUserDto {
    @ApiProperty({ example: 'jane.doe@example.com', description: 'User email address' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'SecurePassword123!', description: 'User password (min 6 characters)' })
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'Jane Doe', description: 'User full name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'INSTRUCTOR',
        description: 'User role',
        enum: UserRole,
        default: UserRole.STUDENT,
        required: false
    })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;
}
