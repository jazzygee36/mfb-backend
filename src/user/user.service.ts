import { Users } from './schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmailService } from './email-service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Corporate } from './schema/corporate.schema';
import { CreateCorporateDto } from './dto/create-corporate.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(Users.name) private usersModel: Model<Users>,
    @InjectModel(Corporate.name) private corporateModel: Model<Corporate>,
    private emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const existingUser = await this.usersModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.usersModel({
      ...createUserDto,
      password: hashedPassword,
      verificationToken: verificationCode,
    });
    await createdUser.save();

    // Send the verification code via email
    await this.emailService.sendVerificationEmail(
      createUserDto.email,
      verificationCode,
    );

    return {
      message: 'Successfully registered.',
    };
  }

  async createCorporate(
    createCorporateDto: CreateCorporateDto,
  ): Promise<{ message: string }> {
    const existingUser = await this.corporateModel.findOne({
      email: createCorporateDto.companyEmail,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const hashedPassword = await bcrypt.hash(createCorporateDto.password, 10);
    const createdUser = new this.corporateModel({
      ...createCorporateDto,
      password: hashedPassword,
      verificationToken: verificationCode,
    });
    await createdUser.save();

    // Send the verification code via email
    await this.emailService.sendVerificationEmail(
      createCorporateDto.companyEmail,
      verificationCode,
    );

    return {
      message: 'Successfully registered.',
    };
  }

  async verifyEmail(
    email: string,
    verificationCode: string,
  ): Promise<{ message: string }> {
    // Find the user by email
    const user = await this.usersModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the provided code matches the one stored
    if (user.verificationToken !== verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    // Mark the user as verified and clear the token
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return { message: 'Email successfully verified' };
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.usersModel.findOne({ email: loginUserDto.email });
    if (!user) {
      throw new NotFoundException('Email not found');
    }
    const comparePwd = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!comparePwd) {
      throw new NotFoundException('Password not match');
    }
    const payload = { email: user.email, password: user.password };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login successfully',
      token,
    };
  }

  async findAll(): Promise<any> {
    return this.usersModel.find().populate('companyName').exec();
  }
}
