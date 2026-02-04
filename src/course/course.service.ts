import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseRepository } from './course.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
    constructor(private readonly courseRepository: CourseRepository) { }

    async create(createCourseDto: CreateCourseDto) {
        return this.courseRepository.create(createCourseDto);
    }

    async findAll() {
        return this.courseRepository.findAll();
    }

    async findOne(id: string) {
        const course = await this.courseRepository.findOne(id);
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }

    async update(id: string, updateCourseDto: UpdateCourseDto) {
        // Check if course exists
        await this.findOne(id);

        return this.courseRepository.update(id, updateCourseDto);
    }

    async remove(id: string) {
        // Check if course exists
        await this.findOne(id);

        return this.courseRepository.remove(id);
    }
}
