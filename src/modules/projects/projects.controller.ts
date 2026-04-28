import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProjectService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class ProjectsController {

    constructor(private readonly projectService:ProjectService){} //Dependency Injection

  // =========================
  // Public Routes
  // =========================
@Get('projects')
 async allProjects(){

    const projects= await this.projectService.allProjects();

    return {
          success:true,
        message: 'Projects fetched successfully',
        data:projects,
    }
 }

@Get('projects/:slug')
async getProjectBySlug(@Param('slug')slug: string){
    const project= await this.projectService.getProjectBySlug(slug);

    return {
          success: true,
      message: 'Project fetched successfully',
      data: project
    }
}

  // =========================
  // Admin Routes
  // =========================
  //Create
@UseGuards(JwtAuthGuard)
@Post('admin/projects')
async createProject(@Body() projectData:CreateProjectDto){

    const  project= await this.projectService.createProject(projectData);

    return {
        success:true,
        message: 'Project created successfully',
        data:project,
    };
}

//Update Project
@UseGuards(JwtAuthGuard)
@Patch('admin/projects/:id')
async updateProject(@Param('id') id: string, 
@Body() updateData:UpdateProjectDto) {

    const  updated= await this.projectService.updateProject(id,updateData);
    return {
        success:true,
        message: 'Project updated successfully',
        data:updated,
    };
    }

//Delete
@UseGuards(JwtAuthGuard)
@Delete('admin/projects/:id')
async deleteProject(@Param('id')id:string) {
    const result= await this.projectService.deleteProject(id);

    return {
        success:true,
        message:result.message,
        data:null
    };
  }

}



