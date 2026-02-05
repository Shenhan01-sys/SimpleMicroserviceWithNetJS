import { Injectable } from '@nestjs/common';
import { User, Material, Course } from '@prisma/client';
import { BasePolicy } from './base.policy';

type MaterialWithCourse = Material & { course: Course };

@Injectable()
export class MaterialPolicy extends BasePolicy {
    /**
     * Everyone can view materials list (public)
     */
    canViewAny(currentUser?: User): boolean {
        return true; // Public access
    }

    /**
     * Everyone can view individual materials (public)
     */
    canView(currentUser?: User, material?: MaterialWithCourse): boolean {
        return true; // Public access
    }

    /**
     * Admin and Instructor can create materials
     */
    canCreate(currentUser: User): boolean {
        return this.isAdmin(currentUser) || this.isInstructor(currentUser);
    }

    /**
     * Admin can update all, instructor can update materials from own courses
     */
    canUpdate(currentUser: User, material: MaterialWithCourse): boolean {
        return this.isAdmin(currentUser) ||
            (this.isInstructor(currentUser) && material.course.instructorId === currentUser.id);
    }

    /**
     * Admin can delete all, instructor can delete materials from own courses
     */
    canDelete(currentUser: User, material: MaterialWithCourse): boolean {
        return this.isAdmin(currentUser) ||
            (this.isInstructor(currentUser) && material.course.instructorId === currentUser.id);
    }
}
