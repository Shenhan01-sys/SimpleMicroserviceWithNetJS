import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseRepository {
    constructor(private prisma: PrismaService) { }

    async create(createCourseDto: CreateCourseDto) {
        return this.prisma.course.create({
            data: createCourseDto,
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findAll() {
        return this.prisma.course.findMany({
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                materials: {
                    select: {
                        id: true,
                        title: true,
                        type: true,
                        order: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        return this.prisma.course.findUnique({
            where: { id },
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                materials: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });
    }

    async update(id: string, updateCourseDto: UpdateCourseDto) {
        return this.prisma.course.update({
            where: { id },
            data: updateCourseDto,
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async remove(id: string) {
        return this.prisma.course.delete({
            where: { id },
        });
    }
}
