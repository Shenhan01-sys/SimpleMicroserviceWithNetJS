import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { BasePolicy } from './base.policy';

@Injectable()
export class UserPolicy extends BasePolicy {
    /**
     * Admin and Instructor can view all users
     */
    canViewAny(currentUser: User): boolean {
        return this.isAdmin(currentUser) || this.isInstructor(currentUser);
    }

    /**
     * Admin can view all, user can view own profile
     */
    canView(currentUser: User, targetUser: User): boolean {
        return this.isAdmin(currentUser) || this.isOwner(currentUser, targetUser.id);
    }

    /**
     * Only admin can create users
     */
    canCreate(currentUser: User): boolean {
        return this.isAdmin(currentUser);
    }

    /**
     * Admin can update all, user can update own profile
     */
    canUpdate(currentUser: User, targetUser: User): boolean {
        return this.isAdmin(currentUser) || this.isOwner(currentUser, targetUser.id);
    }

    /**
     * Only admin can delete users (cannot delete self)
     */
    canDelete(currentUser: User, targetUser: User): boolean {
        return this.isAdmin(currentUser) && !this.isOwner(currentUser, targetUser.id);
    }
}
