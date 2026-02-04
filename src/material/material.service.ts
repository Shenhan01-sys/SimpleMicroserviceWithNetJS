import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MaterialRepository } from './material.repository';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MaterialService {
    constructor(
        private readonly materialRepository: MaterialRepository,
        private readonly prisma: PrismaService,
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
        // Check if material exists
        await this.findOne(id);

        return this.materialRepository.remove(id);
    }
}
