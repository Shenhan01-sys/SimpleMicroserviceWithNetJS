import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { POLICY_CHECK_KEY, PolicyCheckMetadata } from '../decorators/check-policy.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PolicyGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const policyMeta = this.reflector.get<PolicyCheckMetadata>(
            POLICY_CHECK_KEY,
            context.getHandler(),
        );

        if (!policyMeta) {
            return true; // No policy check required
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        const { action, policyClass, resourceParam } = policyMeta;

        // Instantiate policy
        const policy = new policyClass();

        // For actions that don't need resource (like canCreate, canViewAny)
        if (action === 'canCreate' || action === 'canViewAny') {
            const policyMethod = policy[action];
            if (typeof policyMethod !== 'function') {
                throw new ForbiddenException('Invalid policy action');
            }
            const allowed = policyMethod.call(policy, user);
            if (!allowed) {
                throw new ForbiddenException('You do not have permission to perform this action');
            }
            return true;
        }

        // For actions that need resource (canUpdate, canDelete, canView)
        if (!resourceParam) {
            throw new ForbiddenException('Resource parameter not specified in policy metadata');
        }

        const resourceId = request.params[resourceParam];
        if (!resourceId) {
            throw new ForbiddenException('Resource ID not found in request');
        }

        // Load resource based on policy type
        let resource;
        if (policyClass.name === 'UserPolicy') {
            resource = await this.prisma.user.findUnique({ where: { id: resourceId } });
        } else if (policyClass.name === 'CoursePolicy') {
            resource = await this.prisma.course.findUnique({ where: { id: resourceId } });
        } else if (policyClass.name === 'MaterialPolicy') {
            resource = await this.prisma.material.findUnique({
                where: { id: resourceId },
                include: { course: true },
            });
        }

        if (!resource) {
            throw new NotFoundException('Resource not found');
        }

        // Check policy
        const policyMethod = policy[action];
        if (typeof policyMethod !== 'function') {
            throw new ForbiddenException('Invalid policy action');
        }

        const allowed = policyMethod.call(policy, user, resource);
        if (!allowed) {
            throw new ForbiddenException('You do not have permission to access this resource');
        }

        return true;
    }
}
