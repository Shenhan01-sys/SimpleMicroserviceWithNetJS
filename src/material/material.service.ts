import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MaterialRepository } from './material.repository';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { MaterialType } from '@prisma/client';

@Injectable()
export class MaterialService {
    constructor(
        private readonly materialRepository: MaterialRepository,
        private readonly prisma: PrismaService,
        private readonly storageService: StorageService,
    ) { }

    async create(createMaterialDto: CreateMaterialDto) {
        // Validate that course exists
        const course = await this.prisma.course.findUnique({
            where: { id: createMaterialDto.courseId },
        });

        if (!course) {
            throw new BadRequestException(`Course with ID ${createMaterialDto.courseId} not found`);
        }

        return this.materialRepository.create(createMaterialDto);
    }

    async findAll(courseId?: string) {
        return this.materialRepository.findAll(courseId);
    }

    async findOne(id: string) {
        const material = await this.materialRepository.findOne(id);
        if (!material) {
            throw new NotFoundException(`Material with ID ${id} not found`);
        }
        return material;
    }

    async update(id: string, updateMaterialDto: UpdateMaterialDto) {
        // Check if material exists
        await this.findOne(id);

        // If updating courseId, validate that new course exists
        if (updateMaterialDto.courseId) {
            const course = await this.prisma.course.findUnique({
                where: { id: updateMaterialDto.courseId },
            });

            if (!course) {
                throw new BadRequestException(`Course with ID ${updateMaterialDto.courseId} not found`);
            }
        }

        return this.materialRepository.update(id, updateMaterialDto);
    }

    async remove(id: string) {
        // Get material to check if it has a file
        const material = await this.findOne(id);

        // Delete file from storage if exists
        if (material.fileUrl) {
            await this.storageService.deleteFile(material.fileUrl);
        }

        return this.materialRepository.remove(id);
    }

    async createWithFile(file: Express.Multer.File, dto: CreateMaterialDto) {
        // Validate file type matches material type
        this.validateFileType(file, dto.type);

        // Validate that course exists
        const course = await this.prisma.course.findUnique({
            where: { id: dto.courseId },
        });

        if (!course) {
            throw new BadRequestException(`Course with ID ${dto.courseId} not found`);
        }

        // Create material first (without file URL)
        const material = await this.materialRepository.create({
            ...dto,
            content: dto.content || undefined,
        });

        try {
            // Upload file to Supabase Storage
            const fileUrl = await this.storageService.uploadFile(file, material.id);

            // Update material with file URL
            return this.materialRepository.update(material.id, { fileUrl });
        } catch (error) {
            // Rollback: delete material if file upload fails
            await this.materialRepository.remove(material.id);
            throw error;
        }
    }

    private validateFileType(file: Express.Multer.File, type: MaterialType) {
        const allowedTypes: Record<MaterialType, string[]> = {
            VIDEO: ['video/mp4', 'video/webm', 'video/x-matroska', 'video/quicktime'],
            PDF: ['application/pdf'],
            DOCUMENT: [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'text/plain',
            ],
            QUIZ: ['application/json', 'text/plain'], // Quiz can be JSON or text
        };

        if (!allowedTypes[type]?.includes(file.mimetype)) {
            throw new BadRequestException(
                `Invalid file type "${file.mimetype}" for material type ${type}. Allowed: ${allowedTypes[type]?.join(', ')}`
            );
        }

        // File size limit: 50MB
        const maxSize = 50 * 1024 * 1024; // 50MB in bytes
        if (file.size > maxSize) {
            throw new BadRequestException(
                `File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of 50MB`
            );
        }
    }
}
