import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PolicyGuard } from '../auth/guards/policy.guard';
import { CheckPolicy } from '../auth/decorators/check-policy.decorator';
import { UserPolicy } from '../common/policies';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicy('canCreate', UserPolicy)
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: 'Create a new user (Admin Only)' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
    @ApiResponse({ status: 409, description: 'Email already exists' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicy('canViewAny', UserPolicy)
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: 'Get all users (Admin & Instructor)' })
    @ApiResponse({ status: 200, description: 'List of all users' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin or Instructor role required' })
    findAll() {
        return this.userService.findAll();
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: 'Get current user profile (Protected)' })
    @ApiResponse({ status: 200, description: 'Current user profile' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    getCurrentUser(@Request() req) {
        return this.userService.findOne(req.user.sub);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicy('canView', UserPolicy)
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: 'Get user by ID (Admin or Own Profile)' })
    @ApiResponse({ status: 200, description: 'User found' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Can only view own profile unless admin' })
    @ApiResponse({ status: 404, description: 'User not found' })
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicy('canUpdate', UserPolicy)
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: 'Update user (Admin or Own Profile)' })
    @ApiResponse({ status: 200, description: 'User updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Can only update own profile unless admin' })
    @ApiResponse({ status: 404, description: 'User not found' })
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, PolicyGuard)
    @CheckPolicy('canDelete', UserPolicy)
    @ApiBearerAuth('JWT')
    @ApiOperation({ summary: 'Delete user (Admin Only, Cannot Delete Self)' })
    @ApiResponse({ status: 200, description: 'User deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized - No valid JWT token' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin only, cannot delete yourself' })
    @ApiResponse({ status: 404, description: 'User not found' })
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
