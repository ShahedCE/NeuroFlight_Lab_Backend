import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { PublicationsService } from "./publications.service";
import { CreatePublicationDto } from "./dto/create-puiblication.dto";
import { UpdatePublicationDto } from "./dto/update-publication.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller()

export class PublicationsController {
   constructor(private readonly publicationService: PublicationsService){}

 // =========================
  // Public Routes
  // =========================
   @Get('publications')
   async getAllPubliucations(){
      const publications= await this.publicationService.getAllPublications();

      return {
         success:true,
         message: 'Publication fetched successfully',
         data:publications,
      }
   }

   //Get by slug
   @Get('publications/:slug')
   async getPublicationBySlug(@Param('slug') slug:string){
      const publication= await this.publicationService.getPublicationBySlug(slug);
        return {
         success:true,
         message: 'Publication fetched successfully',
         data:publication,
      }
   }

  // =========================
  // Admin Routes
  // =========================
   @UseGuards(JwtAuthGuard)
   @Post('admin/publications')
   async createPublication(@Body() publicationData: CreatePublicationDto){

   const publication= await this.publicationService.createPublication(publicationData);
   return {
    success:true,
    message: 'Publication created successfully',
    data:publication,
    }
   }

   //Update
   @UseGuards(JwtAuthGuard)
   @Patch('admin/publications/:id')
   async updatePublication(@Param('id') id:string, @Body() updateData:UpdatePublicationDto){
     const updated= await this.publicationService.updatePublication(id,updateData);

    return {
    success:true,
    message: 'Publication updated successfully',
    data:updateData,
    }
   }
   @UseGuards(JwtAuthGuard)
   @Delete('admin/publications/:id')
   async deletePublication(@Param('slug') slug:string){

      const result= await this.publicationService.deletePublication(slug);
  return {
    success:true,
    message: result.message,
    data:null,
    }

   }


}