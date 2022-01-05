import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UserSignUpDto } from './dto/user-signup.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
    ) {}

    @Post('signup')
    signUp(@Body() userSignUpDto: UserSignUpDto,) {
        return this.usersService.signUp(userSignUpDto);
    }

    @Post('signin')
    @UseGuards(JwtAuthGuard)
    signIn(@GetUser() user: UserSignUpDto) {
        return user
    }
}
