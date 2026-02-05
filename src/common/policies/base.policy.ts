import { User } from '@prisma/client';

export abstract class BasePolicy {
    protected isAdmin(user: User): boolean {
        return user.role === 'ADMIN';
    }

    protected isInstructor(user: User): boolean {
        return user.role === 'INSTRUCTOR';
    }

    protected isStudent(user: User): boolean {
        return user.role === 'STUDENT';
    }

    protected isOwner(user: User, resourceUserId: string): boolean {
        return user.id === resourceUserId;
    }
}
