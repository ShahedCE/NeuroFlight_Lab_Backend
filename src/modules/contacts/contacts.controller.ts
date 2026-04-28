import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ContactsService } from "./contacts.service";
import { CreateContactMessageDto } from "./dto/create-contact-message.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller()
export class ContactsController{
    constructor(private readonly contactsService: ContactsService){}

  // =========================
  // Public Routes
  // =========================
    @Post('contact')
    async create(@Body()messageData: CreateContactMessageDto){
        const createmessage= await this.contactsService.create(messageData);

        return {
            success:true,
            message:'Contact message sent successfully',
            data: createmessage,
        }
    }

  // =========================
  // Admin Routes
  // =========================
  @UseGuards(JwtAuthGuard)
  @Get('admin/contact-messages')
  async findAll() {
    const contactMessages = await this.contactsService.findAll();

    return {
      success: true,
      message: 'Contact messages fetched successfully',
      data: contactMessages,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('admin/contact-messages/:id')
  async findOneById(@Param('id') id: string) {
    const contactMessage = await this.contactsService.findOneById(id);

    return {
      success: true,
      message: 'Contact message fetched successfully',
      data: contactMessage,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Delete('admin/contact-messages/:id')
  async remove(@Param('id') id: string) {
    const result = await this.contactsService.remove(id);

    return {
      success: true,
      message: result.message,
      data: null,
    };
  }

    
}