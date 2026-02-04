import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { CourseRepository } from './course.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CourseController],
    providers: [CourseService, CourseRepository],
    exports: [CourseService, CourseRepository],
})
export class CourseModule { }
