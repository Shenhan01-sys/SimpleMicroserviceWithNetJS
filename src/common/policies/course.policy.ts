import { Injectable } from '@nestjs/common';
import { User, Course } from '@prisma/client';
import { BasePolicy } from './base.policy';

@Injectable()
export class CoursePolicy extends BasePolicy {
    /**
     * Everyone can view course list (public for students to browse)
     */
    canViewAny(currentUser?: User): boolean {
        return true; // Public access
    }

    /**
     * Everyone can view individual courses (public)
     */
    canView(currentUser?: User, course?: Course): boolean {
        return true; // Public access
    }

    /**
     * Admin can create courses
     */
    canCreate(currentUser: User): boolean {
        return this.isAdmin(currentUser);
    }

    /**
     * Admin can update all, instructor can update own courses
     */
    canUpdate(currentUser: User, course: Course): boolean {
        return this.isAdmin(currentUser) ||
            (this.isInstructor(currentUser) && course.instructorId === currentUser.id);
    }

    /**
     * Admin can delete all, instructor can delete own courses
     */
    canDelete(currentUser: User, course: Course): boolean {
        return this.isAdmin(currentUser) ||
            (this.isInstructor(currentUser) && course.instructorId === currentUser.id);
    }
}
