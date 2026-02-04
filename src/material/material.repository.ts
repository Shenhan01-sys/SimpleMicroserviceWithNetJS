import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialRepository {
    constructor(private prisma: PrismaService) { }

    async create(createMaterialDto: CreateMaterialDto) {
        return this.prisma.material.create({
            data: createMaterialDto,
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
    }

    async findAll(courseId?: string) {
        return this.prisma.material.findMany({
            where: courseId ? { courseId } : undefined,
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
            orderBy: {
                order: 'asc',
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.material.findUnique({
            where: { id },
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
    }

    async update(id: string, updateMaterialDto: UpdateMaterialDto) {
        return this.prisma.material.update({
            where: { id },
            data: updateMaterialDto,
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });
    }

    async remove(id: string) {
        return this.prisma.material.delete({
            where: { id },
        });
    }
}
