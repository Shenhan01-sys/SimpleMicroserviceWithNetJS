import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PolicyGuard } from '../auth/guards/policy.guard';
import { CheckPolicy } from '../auth/decorators/check-policy.decorator';
import { MaterialPolicy } from '../common/policies';

@ApiTags('Materials')
@Controller('materials')
export class MaterialController {
    constructor(private readonly materialService: MaterialService) { }

    @Post()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicy('canCreate', MaterialPolicy)
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: 'Create a new material with text content (Admin & Instructor)' })
    @ApiResponse({ status: 201, description: 'Material created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid courseId - Course not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin or Instructor role required' })
    create(@Body() createMaterialDto: CreateMaterialDto) {
        return this.materialService.create(createMaterialDto);
    }

    @Post('upload')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicy('canCreate', MaterialPolicy)
    @UseInterceptors(FileInterceptor('file'))
    @ApiBearerAuth('JWT')
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload a file for material (Admin & Instructor)' })
    @ApiBody({
        description: 'File upload with material metadata',
        schema: {
            type: 'object',
            required: ['file', 'title', 'courseId', 'type'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File to upload (PDF, Video, Document)'
                },
                title: {
                    type: 'string',
                    example: 'Week 1 Lecture Video',
                    description: 'Material title'
                },
                courseId: {
                    type: 'string',
                    format: 'uuid',
                    example: '123e4567-e89b-12d3-a456-426614174000',
                    description: 'Course ID this material belongs to'
                },
                type: {
                    type: 'string',
                    enum: ['VIDEO', 'PDF', 'DOCUMENT', 'QUIZ'],
                    example: 'VIDEO',
                    description: 'Material type (must match file type)'
                },
                order: {
                    type: 'number',
                    example: 1,
                    description: 'Order/sequence in course (optional, default: 0)'
                },
                content: {
                    type: 'string',
                    example: 'Additional text description...',
                    description: 'Optional text content along with file'
                }
            }
        }
    })
    @ApiResponse({ status: 201, description: 'File uploaded and material created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid file type or course not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin or Instructor role required' })
    @ApiResponse({ status: 413, description: 'File too large (max 50MB)' })
    async uploadFile(
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: CreateMaterialDto
    ) {
        if (!file) {
            throw new Error('File is required');
        }
        return this.materialService.createWithFile(file, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all materials (optionally filter by courseId)' })
    @ApiQuery({ name: 'courseId', required: false, description: 'Filter materials by course ID' })
    @ApiResponse({ status: 200, description: 'List of materials' })
    findAll(@Query('courseId') courseId?: string) {
        return this.materialService.findAll(courseId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get material by ID' })
    @ApiResponse({ status: 200, description: 'Material found' })
    @ApiResponse({ status: 404, description: 'Material not found' })
    findOne(@Param('id') id: string) {
        return this.materialService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicy('canUpdate', MaterialPolicy)
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: 'Update material (Admin or Course Instructor)' })
    @ApiResponse({ status: 200, description: 'Material updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid courseId - Course not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Can only update materials for own courses unless admin' })
    @ApiResponse({ status: 404, description: 'Material not found' })
    update(@Param('id') id: string, @Body() updateMaterialDto: UpdateMaterialDto) {
        return this.materialService.update(id, updateMaterialDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicy('canDelete', MaterialPolicy)
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: 'Delete material (Admin or Course Instructor)' })
    @ApiResponse({ status: 200, description: 'Material deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Can only delete materials for own courses unless admin' })
    @ApiResponse({ status: 404, description: 'Material not found' })
    remove(@Param('id') id: string) {
        return this.materialService.remove(id);
    }
}
