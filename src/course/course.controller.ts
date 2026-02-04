import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
    constructor(private readonly courseService: CourseService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new course (Protected)' })
    @ApiResponse({ status: 201, description: 'Course created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    create(@Body() createCourseDto: CreateCourseDto) {
        return this.courseService.create(createCourseDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all courses' })
    @ApiResponse({ status: 200, description: 'List of all courses with materials' })
    findAll() {
        return this.courseService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get course by ID with all materials' })
    @ApiResponse({ status: 200, description: 'Course found with materials' })
    @ApiResponse({ status: 404, description: 'Course not found' })
    findOne(@Param('id') id: string) {
        return this.courseService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update course (Protected)' })
    @ApiResponse({ status: 200, description: 'Course updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    @ApiResponse({ status: 404, description: 'Course not found' })
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
        return this.courseService.update(id, updateCourseDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete course (Protected)' })
    @ApiResponse({ status: 200, description: 'Course deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    @ApiResponse({ status: 404, description: 'Course not found' })
    remove(@Param('id') id: string) {
        return this.courseService.remove(id);
    }
}
