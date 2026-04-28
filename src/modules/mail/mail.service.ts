import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { JobApplicationCreatedEvent } from 'src/common/interfaces/job-application-created-event.interface';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  // This MailService handles sending emails related to job applications, 
  // including notifying the admin when a new application is received.
  async sendJobApplicationToAdmin(payload: JobApplicationCreatedEvent) {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const appBaseUrl = this.configService.get<string>('APP_BASE_URL');

    const cvAbsolutePath = join(
      process.cwd(),
      payload.cvFileUrl.replace('/uploads/', 'uploads/'),
    );

    await this.mailerService.sendMail({
      to: adminEmail,
      subject: `New Job Application - ${payload.job.title}`,
      html: `
        <h2>New Job Application Received</h2>

        <h3>Applicant Information</h3>
        <p><strong>Name:</strong> ${payload.applicant.fullName}</p>
        <p><strong>Email:</strong> ${payload.applicant.email}</p>

        <h3>Job Information</h3>
        <p><strong>Title:</strong> ${payload.job.title}</p>
        <p><strong>Team:</strong> ${payload.job.team}</p>
        <p><strong>Level:</strong> ${payload.job.level}</p>
        <p><strong>Type:</strong> ${payload.job.type}</p>
        <p><strong>Location:</strong> ${payload.job.location}</p>

        <p>
          <strong>CV Link:</strong>
          <a href="${appBaseUrl}${payload.cvFileUrl}">Download CV</a>
        </p>
      `,
      attachments: [
        {
          filename: `${payload.applicant.fullName}-CV.pdf`,
          path: cvAbsolutePath,
        },
      ],
    });
  }
}