import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { JobLevel } from "src/common/enums/job-level.enum";
import { JobTeam } from "src/common/enums/job-team.enum";
import { JobType } from "src/common/enums/job-type.enum";
import { JobPostsService } from "./job-posts.service";
import { UpdateJobPostDto } from "./dto/update-job-post.dto";
import { CreateJobPostDto } from "./dto/create-job-post.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller()
export class JobPostsController{

    constructor( private readonly jobPostsService: JobPostsService){}

      // =========================
  // Public Routes
  // =========================

  @Get('job-posts')
  async findAllPublic(
    @Query('team') team?: JobTeam,
    @Query('level') level?: JobLevel,
    @Query('type') type?: JobType,
  ) {
    const jobPosts = await this.jobPostsService.findAllPublic(team, level, type);

    return {
      success: true,
      message: 'Job posts fetched successfully',
      data: jobPosts,
    };
  }

  @Get('job-posts/:id')
  async findOnePublic(@Param('id') id: string) {
    const jobPost = await this.jobPostsService.findOneById(id);

    return {
      success: true,
      message: 'Job post fetched successfully',
      data: jobPost,
    };
  }
// =========================
  // Admin Routes
  // =========================
  @UseGuards(JwtAuthGuard)
  @Post('admin/job-posts')
  async create(@Body() createJobPostDto: CreateJobPostDto) {
    const jobPost = await this.jobPostsService.create(createJobPostDto);

    return {
      success: true,
      message: 'Job post created successfully',
      data: jobPost,
    };
  }
//Get All
@UseGuards(JwtAuthGuard)
  @Get('admin/job-posts')
  async findAllAdmin() {
    const jobPosts = await this.jobPostsService.findAllJobs();

    return {
      success: true,
      message: 'Job posts fetched successfully',
      data: jobPosts,
    };
  }
 //Get by id:
 @UseGuards(JwtAuthGuard)
  @Get('admin/job-posts/:id')
  async findOneAdmin(@Param('id') id: string) {
    const jobPost = await this.jobPostsService.findOneById(id);

    return {
      success: true,
      message: 'Job post fetched successfully',
      data: jobPost,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Patch('admin/job-posts/:id')
  async update(
    @Param('id') id: string,
    @Body() updateJobPostDto: UpdateJobPostDto,
  ) {
    const jobPost = await this.jobPostsService.update(id, updateJobPostDto);

    return {
      success: true,
      message: 'Job post updated successfully',
      data: jobPost,
    };
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete('admin/job-posts/:id')
  async remove(@Param('id') id: string) {
    const result = await this.jobPostsService.remove(id);

    return {
      success: true,
      message: result.message,
      data: null,
    };
  }
    
}