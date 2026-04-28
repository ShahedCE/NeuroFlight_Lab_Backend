import { IsEmail, IsString, Length } from 'class-validator';

export class CreateJobApplicationDto {
  @IsString()
  @Length(2, 150)
  fullName: string;

  @IsEmail()
  email: string;
}