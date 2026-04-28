import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { imageFileFilter, multerStorage } from "../uploads/multer.config";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { TeamService } from "./team.service";
import { TeamTag } from "src/common/enums/team-tag.enum";
import { TeamGroup } from "src/common/enums/team-group.enum";
import { UpdateTeamMemberDto } from "./dto/update-team.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller()
export class TeamController{

    constructor(private readonly teamService:TeamService){}

  // =========================
  // Public Routes
  // =========================

  @Get('team')
  async findAll(
    @Query('group') group?: TeamGroup,
    @Query('tag') tag?: TeamTag,
  ) {
    const teamMembers = await this.teamService.findAll(group, tag);

    return {
      success: true,
      message: 'Team members fetched successfully',
      data: teamMembers,
    };
  }
//By slug
@Get('team/:slug')
async findBySlug(@Param('slug') slug:string){
    const member= await this.teamService.findOneBySlug(slug);

    return {
           success: true,
      message: 'Team member fetched successfully',
      data: member,
    }

}

    //Admin Route
    //Create Team Member
    @UseGuards(JwtAuthGuard)
    @Post('admin/team')
@UseInterceptors(
  FileInterceptor('image', {
    storage: multerStorage('team'), // uploads/team
    fileFilter: imageFileFilter,
    limits: {
      fileSize: 2 * 1024 * 1024, // 2MB limit
    },
  }),
)
async create(
  @UploadedFile() file: Express.Multer.File,
  @Body() memberData: CreateTeamMemberDto,
) {

  // uploaded file path
  const imagePath = `/uploads/team/${file.filename}`;

  const teamMember = await this.teamService.create({ ...memberData, imageUrl: imagePath });

  return {
    success: true,
    message: 'Team member created successfully',
    data: teamMember,
  };
}

@UseGuards(JwtAuthGuard)
@Patch('admin/team/:id')
  @UseInterceptors(
    FileInterceptor('image', { //image in the multer form , image: xxx.jpg
      storage: multerStorage('team'),
      fileFilter: imageFileFilter,
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
    @Body() updateTeamMemberDto?: UpdateTeamMemberDto,
  ) {
    // image optional in update route
    const imagePath = file ? `/uploads/team/${file.filename}` : undefined;

    const teamMember = await this.teamService.update(
      id,
      updateTeamMemberDto,
      imagePath,
    );

    return {
      success: true,
      message: 'Team member updated successfully',
      data: teamMember,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/team/:id')
  async remove(@Param('id') id:string ){
    const result= await this.teamService.remove(id);
    return{
      success:true,
      message: result.message,
      data: null,
    }

  }
    
}