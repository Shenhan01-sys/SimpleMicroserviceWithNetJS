import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MaterialService } from './material.service';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Materials')
@Controller('materials')
export class MaterialController {
    constructor(private readonly materialService: MaterialService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new material (Protected)' })
    @ApiResponse({ status: 201, description: 'Material created successfully' })
    @ApiResponse({ status: 400, description: 'Invalid courseId - Course not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    create(@Body() createMaterialDto: CreateMaterialDto) {
        return this.materialService.create(createMaterialDto);
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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update material (Protected)' })
    @ApiResponse({ status: 200, description: 'Material updated successfully' })
    @ApiResponse({ status: 400, description: 'Invalid courseId - Course not found' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    @ApiResponse({ status: 404, description: 'Material not found' })
    update(@Param('id') id: string, @Body() updateMaterialDto: UpdateMaterialDto) {
        return this.materialService.update(id, updateMaterialDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete material (Protected)' })
    @ApiResponse({ status: 200, description: 'Material deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    @ApiResponse({ status: 404, description: 'Material not found' })
    remove(@Param('id') id: string) {
        return this.materialService.remove(id);
    }
}
