import { BadRequestException, Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { JobApplicationService } from "./job-application.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { cvFileFilter, multerStorage } from "../uploads/multer.config";
import { CreateJobApplicationDto } from "./dto/create-job-application.dto";

@Controller()
export class JobApplicationController{

    constructor( private readonly jobApplicationService: JobApplicationService){}
    
    
  // =========================
  // Public Route
  // =========================

  @Post('job-posts/:jobId/apply')
  @UseInterceptors(
    FileInterceptor('cv', {
      storage: multerStorage('cv'), // uploads/cv folder এ save হবে
      fileFilter: cvFileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
    }),
  )
  async apply(
    @Param('jobId') jobId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createJobApplicationDto: CreateJobApplicationDto,
  ) {
    // CV required
    if (!file) {
      throw new BadRequestException('CV file is required');
    }

    const cvFileUrl = `/uploads/cv/${file.filename}`;

    const application = await this.jobApplicationService.apply(
      jobId,
      createJobApplicationDto,
      cvFileUrl,
    );

    return {
      success: true,
      message: 'Job application submitted successfully',
      data: application,
    };
  }

    // =========================
  // Admin Routes
  // =========================

  @Get('admin/job-applications')
  async findAll() {
    const applications = await this.jobApplicationService.findAll();

    return {
      success: true,
      message: 'Job applications fetched successfully',
      data: applications,
    };
  }

  @Get('admin/job-applications/:id')
  async findOneById(@Param('id') id: string) {
    const application = await this.jobApplicationService.findOneById(id);

    return {
      success: true,
      message: 'Job application fetched successfully',
      data: application,
    };
  }

  @Get('admin/job-posts/:jobId/applications')
  async findByJobId(@Param('jobId') jobId: string) {
    const applications = await this.jobApplicationService.findByJobId(jobId);

    return {
      success: true,
      message: 'Job applications for this post fetched successfully',
      data: applications,
    };
  }


  
}

