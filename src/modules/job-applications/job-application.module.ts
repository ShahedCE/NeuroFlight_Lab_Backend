import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JobApplication } from "src/database/entities/job-application.entity";
import { JobApplicationController } from "./job-application.controller";
import { JobApplicationService } from "./job-application.service";
import { JobPost } from "src/database/entities/job-post.entity";

@Module({
    imports:[TypeOrmModule.forFeature([JobApplication,JobPost])
],
controllers:[JobApplicationController],
providers: [JobApplicationService,]

})
export class JobApplicationModule{}