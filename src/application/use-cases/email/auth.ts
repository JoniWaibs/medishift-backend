
import mongoose from 'mongoose';
import { UserRepository } from '../../repository';
import { UserBasicInfo } from '../../../core/models';
import { EmailService } from '../../../infrastucture/services/email-service';
import { TokenService } from '../../../infrastucture/services/token-service';
import { envs } from '../../../config/envs';
import fs from 'fs';
import path from 'path';
export class AuthEmail {
  constructor(private readonly repository: UserRepository, private readonly emailService: EmailService) {}

  async sendConfirmationEmail(userId: string, email: string): Promise<void> {
    const token = TokenService.generateConfirmationToken(userId);
    const confirmationUrl = `${envs.FRONTEND_URL}/confirm-email?token=${token}`;
    const emailTemplatePath = path.resolve(__dirname, 'templates/confirmation-email.html');
    const emailHtml = fs.readFileSync(emailTemplatePath, 'utf-8');

    await this.emailService.sendEmail({
      to: email,
      subject: 'Confirmá tu email',
      html: emailHtml.replace('{{confirmation_link}}', confirmationUrl)
    });
  }

  async confirmEmail(token: string): Promise<boolean> {
    const { id } = TokenService.verifyToken(token) as UserBasicInfo; 
    if (!id) throw new Error("Invalid token");

    const doctorId = new mongoose.Types.ObjectId(id).toString();
    try {
      const result = await this.repository.update({ id: doctorId, userData: { isEmailConfirmed: true }, type: 'doctor' });
      return !!result;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return false;
    }
  }
}
