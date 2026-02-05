import { SetMetadata } from '@nestjs/common';

export const POLICY_CHECK_KEY = 'policyCheck';

export interface PolicyCheckMetadata {
    action: string;  // e.g., 'canUpdate', 'canDelete'
    policyClass: any;  // e.g., UserPolicy, CoursePolicy
    resourceParam?: string;  // e.g., 'id' - param name to load resource
}

export const CheckPolicy = (action: string, policyClass: any, resourceParam: string = 'id') =>
    SetMetadata(POLICY_CHECK_KEY, { action, policyClass, resourceParam } as PolicyCheckMetadata);
