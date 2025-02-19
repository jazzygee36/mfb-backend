import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  // UseGuards,
  ValidationPipe,
  UseGuards,
  Put,
  UsePipes,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateCorporateDto } from './dto/create-corporate.dto';

@Controller('')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register-individual')
  createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('/register-corporate')
  createCorporate(
    @Body(ValidationPipe) createCorporateDto: CreateCorporateDto,
  ) {
    return this.userService.createCorporate(createCorporateDto);
  }

  @Post('verify')
  async verifyEmail(@Body(ValidationPipe) verifyEmailDto: VerifyEmailDto) {
    const { email, verificationCode } = verifyEmailDto;
    return this.userService.verifyEmail(email, verificationCode);
  }

  @Post('/login')
  loginUser(@Body(ValidationPipe) loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }
}
