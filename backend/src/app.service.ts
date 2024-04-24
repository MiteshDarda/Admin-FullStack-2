import { Global, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './apis/users/entities/user.entity';
import { Repository } from 'typeorm';
import { DesignationEnum } from './apis/users/enums/DesignationEnum';
import { MailerService } from '@nestjs-modules/mailer';

//$ This File Contails All Helper Function
@Global()
@Injectable()
export class AppService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserRepository)
    private readonly userRepository: Repository<UserRepository>,
    private readonly mailerService: MailerService,
  ) {}

  //* Check API Status .
  getHello() {
    return 'Ping Pong!';
  }

  //* Convert JWT based on auth .
  convertJWT(authToken: string) {
    const token = authToken.split(' ')[1];
    const decoded = this.jwtService.decode(token);
    return decoded?.email;
  }

  //* Get Designation Based on Email .
  async getDesignation(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.designation'])
      .where('user.email = :email', { email })
      .getOne();
    return user?.designation;
  }

  //* Create JWT .
  jwtTokenSignForSession(email: string, designation: string, expiri: string) {
    return this.jwtService.sign({ email, designation }, { expiresIn: expiri });
  }

  //* Validate JWT .
  async validate(token: string) {
    const decodedToken = this.jwtService.decode(token);

    // STEP 2: Check Expiration Time
    const expirationTime = decodedToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    if (!expirationTime || currentTime > expirationTime)
      throw new HttpException('Expire', 401);

    // STEP 3: Check if email exists
    const email = this.jwtService?.decode(token)?.email;
    const exists = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    if (!exists) throw new HttpException('Expire', 401);
    return email;
  }

  //* Designation which current user can delete .
  getDesignationAllowdedToDelete(designation: string) {
    const designationsAllowedToDelete = [];
    if (designation === DesignationEnum.SUPER_ADMIN) {
      designationsAllowedToDelete.push(DesignationEnum.ADMIN);
      designationsAllowedToDelete.push(DesignationEnum.MANAGER);
      designationsAllowedToDelete.push(DesignationEnum.LEADER);
      designationsAllowedToDelete.push(DesignationEnum.QA);
      designationsAllowedToDelete.push(DesignationEnum.SEO);
      designationsAllowedToDelete.push(DesignationEnum.THUMBNAIL_DESIGNER);
      designationsAllowedToDelete.push(DesignationEnum.VIDEO_EDITOR);
      designationsAllowedToDelete.push(DesignationEnum.SCRIPT_WRITER);
      designationsAllowedToDelete.push(DesignationEnum.VOICE_OVER_ASSIST);
    } else if (designation === DesignationEnum.ADMIN) {
      designationsAllowedToDelete.push(DesignationEnum.MANAGER);
      designationsAllowedToDelete.push(DesignationEnum.LEADER);
      designationsAllowedToDelete.push(DesignationEnum.QA);
      designationsAllowedToDelete.push(DesignationEnum.SEO);
      designationsAllowedToDelete.push(DesignationEnum.THUMBNAIL_DESIGNER);
      designationsAllowedToDelete.push(DesignationEnum.VIDEO_EDITOR);
      designationsAllowedToDelete.push(DesignationEnum.SCRIPT_WRITER);
      designationsAllowedToDelete.push(DesignationEnum.VOICE_OVER_ASSIST);
    } else if (designation === DesignationEnum.MANAGER) {
      designationsAllowedToDelete.push(DesignationEnum.LEADER);
      designationsAllowedToDelete.push(DesignationEnum.MEMBER);
    } else if (designation === DesignationEnum.LEADER) {
      designationsAllowedToDelete.push(DesignationEnum.MEMBER);
    }
    return designationsAllowedToDelete;
  }

  //* Designation which current user can View .
  getDesignationAllowdedToView(designation: string) {
    const designationsAllowedToView = [];
    if (
      designation === DesignationEnum.SUPER_ADMIN ||
      designation === DesignationEnum.ADMIN
    ) {
      designationsAllowedToView.push(DesignationEnum.SUPER_ADMIN);
      designationsAllowedToView.push(DesignationEnum.ADMIN);
      designationsAllowedToView.push(DesignationEnum.MANAGER);
      designationsAllowedToView.push(DesignationEnum.LEADER);
      designationsAllowedToView.push(DesignationEnum.QA);
      designationsAllowedToView.push(DesignationEnum.SEO);
      designationsAllowedToView.push(DesignationEnum.THUMBNAIL_DESIGNER);
      designationsAllowedToView.push(DesignationEnum.SCRIPT_WRITER);
      designationsAllowedToView.push(DesignationEnum.VOICE_OVER_ASSIST);
    } else if (designation === DesignationEnum.MANAGER) {
      designationsAllowedToView.push(DesignationEnum.ADMIN);
      designationsAllowedToView.push(DesignationEnum.LEADER);
    } else if (designation !== DesignationEnum.MEMBER) {
      designationsAllowedToView.push(DesignationEnum.SUPER_ADMIN);
      designationsAllowedToView.push(DesignationEnum.ADMIN);
      designationsAllowedToView.push(DesignationEnum.MANAGER);
      designationsAllowedToView.push(DesignationEnum.LEADER);
      designationsAllowedToView.push(DesignationEnum.QA);
      designationsAllowedToView.push(DesignationEnum.SEO);
      designationsAllowedToView.push(DesignationEnum.THUMBNAIL_DESIGNER);
      designationsAllowedToView.push(DesignationEnum.VIDEO_EDITOR);
      designationsAllowedToView.push(DesignationEnum.SCRIPT_WRITER);
      designationsAllowedToView.push(DesignationEnum.VOICE_OVER_ASSIST);
      designationsAllowedToView.push(DesignationEnum.MEMBER);
    } else if (designation === DesignationEnum.MEMBER) {
      designationsAllowedToView.push(DesignationEnum.MANAGER);
      designationsAllowedToView.push(DesignationEnum.LEADER);
      designationsAllowedToView.push(DesignationEnum.QA);
      designationsAllowedToView.push(DesignationEnum.SEO);
      designationsAllowedToView.push(DesignationEnum.THUMBNAIL_DESIGNER);
      designationsAllowedToView.push(DesignationEnum.VIDEO_EDITOR);
      designationsAllowedToView.push(DesignationEnum.SCRIPT_WRITER);
      designationsAllowedToView.push(DesignationEnum.VOICE_OVER_ASSIST);
      designationsAllowedToView.push(DesignationEnum.MEMBER);
    }
    return designationsAllowedToView;
  }

  async sendEmail(to: string, subject: string, message: string) {
    try {
      await this.mailerService.sendMail({
        from: process.env.MAIL,
        to,
        subject,
        text: 'Eteam Manage',
        html: `<div> ${message} <div>`,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
