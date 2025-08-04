import { Injectable } from '@nestjs/common';
import { SendConfirmationDto } from './dto/confirmation.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}
  /**
   * Sends a welcome email with a verification link to a new user.
   * @param sendConfirmationDto An object containing the user's email and the verification token.
   * @returns A promise that resolves when the email is sent.
   */
  async sendUserConfirmation(sendUserConfirmation: SendConfirmationDto) {
    const { email, token } = sendUserConfirmation;

    const url = `${this.configService.get<string>('FRONTEND_URL')}/verify-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to the Movies Diary, please confirm your email!',
      html: `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Movie Diary!</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            background-color: #f5f8fa;
            color: #333333;
        }
    </style>
</head>
<body style="margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f8fa">
        <tr>
            <td align="center" style="padding: 30px 15px;">
                <table width="100%" max-width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                    <tr>
                        <td align="center" style="padding: 40px 20px 20px; background-color: #1a1a2e;">
                            <h1 style="color: #ffffff; margin: 0;">🎬 Welcome ${email} to Movie Diary!</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 30px 25px;">
                            <p style="font-size: 16px; margin-top: 0;">Hi there,</p>
                            <p style="font-size: 16px;">Thank you for joining Movie Diary - your personal film journey starts now! Track  and rate every movie you watch!</p>
                            
                            <p style="font-size: 16px;">To get started, please verify your email address:</p>
                            
                            <table cellpadding="0" cellspacing="0" border="0" style="margin: 30px auto;">
                                <tr>
                                    <td align="center" bgcolor="#e94560" style="border-radius: 4px;">
                                        <a href="${url}" target="_blank" style="font-size: 16px; color: #ffffff; text-decoration: none; padding: 12px 30px; display: inline-block; font-weight: bold;">
                                            VERIFY YOUR EMAIL
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 16px;">If you didn't create an account with Movie Diary, please ignore this email.</p>
                            
                            <p style="font-size: 16px;">Lights, camera, action! 🎥<br><b>The Movie Diary Team</b></p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 20px; background-color: #f8f9fa; text-align: center; font-size: 14px; color: #6c757d;">
                            <p style="margin: 5px 0;">© 2025 Movie Diary. All rights reserved.</p>
                            <p style="margin: 5px 0;">
                                <a href="#" style="color: #6c757d; text-decoration: underline;">Help Center</a> | 
                                <a href="#" style="color: #6c757d; text-decoration: underline;">Privacy Policy</a>
                            </p>
                            <p style="margin: 5px 0; font-size: 12px;">Sorocaba, Brazil</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
    });
  }
}
