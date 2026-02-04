import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialController } from './material.controller';
import { MaterialRepository } from './material.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [MaterialController],
    providers: [MaterialService, MaterialRepository],
    exports: [MaterialService, MaterialRepository],
})
export class MaterialModule { }
