
import mongoose from 'mongoose';
import { UserRepository } from '../../repository';
import { UserBasicInfo } from '../../../core/models';
import { EmailService } from '../../../infrastucture/services/email-service';
import { TokenService } from '../../../infrastucture/services/token-service';
import { envs } from '../../../config/envs';
import fs from 'fs';
import path from 'path';
import { AppError } from '../../../shared/errors/custom.error';
import { Password } from '../../../shared/adapters/password-hasher';

export class AuthEmail {
  constructor(private readonly repository: UserRepository, private readonly emailService: EmailService) {}

  async sendConfirmationEmail(id: string, email: string): Promise<void> {    
    const token = TokenService.generateConfirmationToken(id);
    const confirmationUrl = `${envs.FRONTEND_URL}/email-confirmation?token=${token}`;
    const htmlTemplate = path.join(__dirname, './templates/confirmation-email.html');
    const emailHtml = fs.readFileSync(htmlTemplate, 'utf-8');
  
    await this.emailService.sendEmail({
      to: email,
      subject: 'Confirmá tu email',
      html: emailHtml.replace('{{confirmation_link}}', confirmationUrl)
    });
  }

  async confirmEmail(token: string): Promise<boolean> {
    const user = TokenService.verifyToken(token) as UserBasicInfo; 
    if (!user) throw AppError.badRequest('Invalid token');

    const userId = new mongoose.Types.ObjectId(user.id).toString();
    const result = await this.repository.update({ id: userId, userData: { isEmailConfirmed: true }, type: 'doctor' });
    return !!result;
  }

  async sendResetPasswordEmail(id: string, email: string): Promise<void> {
    const token = TokenService.generateConfirmationToken(id);
    const resetPasswordUrl = `${envs.FRONTEND_URL}/reset-password?token=${token}`;
    const htmlTemplate = path.join(__dirname, './templates/reset-password-email.html');
    const emailHtml = fs.readFileSync(htmlTemplate, 'utf-8');

    await this.emailService.sendEmail({
      to: email,
      subject: 'Restablecer contraseña',
      html: emailHtml.replace('{{reset_password_link}}', resetPasswordUrl)
    });
  }

  async resetPassword(id: string, newPassword: string): Promise<boolean> {
    const hashed = await Password.toHash(newPassword);

    const result = await this.repository.update({ id, userData: { password: hashed }, type: 'doctor' });
    return !!result;
  }
}
