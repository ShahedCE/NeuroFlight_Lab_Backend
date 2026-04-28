import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JobApplication } from "src/database/entities/job-application.entity";
import { JobPost } from "src/database/entities/job-post.entity";
import { Repository } from "typeorm";
import { CreateJobApplicationDto } from "./dto/create-job-application.dto";
import { JobStatus } from "src/common/enums/job-status.enum";

@Injectable()
export class JobApplicationService{

    constructor(
        @InjectRepository(JobApplication)
        private readonly jobApplicationRepo: Repository<JobApplication>,

        @InjectRepository(JobPost)
        private readonly jobPostRepo: Repository<JobPost>
    ){}

     // Public: apply to a job
  async apply(
    jobId: string,
    createJobApplicationDto: CreateJobApplicationDto,
    cvFileUrl: string,
  ): Promise<JobApplication> {
    //  check if job post exists or not
    const jobPost = await this.jobPostRepo.findOne({
      where: { id: jobId },
    });

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    //can apply only on published job
    if (jobPost.status !== JobStatus.PUBLISHED) {
      throw new BadRequestException('This job is not open for applications');
    }

    // preventing duplicate application 
    // block application for same applicant(email) and job
    const existingApplication = await this.jobApplicationRepo.findOne({
      where: {
        jobId,
        email: createJobApplicationDto.email,
      },
    });

    if (existingApplication) {
      throw new BadRequestException(
        'You have already applied for this job with this email',
      );
    }

    const jobApplication = this.jobApplicationRepo.create({
      ...createJobApplicationDto,
      jobId,
      cvFileUrl,
    });

    return await this.jobApplicationRepo.save(jobApplication);

    //Sending Mail................Now

  }

    // Admin: get all applications
  async findAll(): Promise<JobApplication[]> {
    return await this.jobApplicationRepo.find({
      relations: ['job'], // include related job post info 
      order: {
        createdAt: 'DESC',
      },
    });
  }


  // Admin: get one application by id
  async findOneById(id: string): Promise<JobApplication> {
    const application = await this.jobApplicationRepo.findOne({
      where: { id },
      relations: ['job'],
    });

    if (!application) {
      throw new NotFoundException('Job application not found');
    }

    return application;
  }

   // Admin: get all applications for a specific job
  async findByJobId(jobId: string): Promise<JobApplication[]> {
    // check if job exists or not
    const jobPost = await this.jobPostRepo.findOne({
      where: { id: jobId },
    });

    if (!jobPost) {
      throw new NotFoundException('Job post not found');
    }

    return await this.jobApplicationRepo.find({
      where: { jobId },
      relations: ['job'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

 
}