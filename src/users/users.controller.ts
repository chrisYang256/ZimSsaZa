import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { GetUser } from 'src/common/decorator/get-user.decorator';
import { UndefinedTonNllInterceptor } from 'src/common/interceptor/undefinedToNull.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserWithoutPasswordDto } from './dto/user-without-password.dto';
import { UsersService } from './users.service';

@UseInterceptors(UndefinedTonNllInterceptor)
@ApiTags('USER')
@Controller('users')
export class UsersController {
    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) {}

    @ApiOperation({ summary: '내 정보 조회' })
    @ApiResponse({ status: 200, description: 'response 성공', type: UserWithoutPasswordDto })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @UseGuards(JwtAuthGuard)
    @Get()
    myInfo(@GetUser() user: UserWithoutPasswordDto) {
        return user;
    }

    @ApiOperation({ summary: '회원 가입' })
    @ApiResponse({ status: 201, description: 'response 성공', type: CreateUserDto })
    @ApiResponse({ status: 409, description: 'response 실패' })
    @Post('signup')
    signUp(@Body() userJoinDto: CreateUserDto,) {
        return this.usersService.signUp(userJoinDto);
    }

    @ApiOperation({ summary: '로그인' })
    @ApiResponse({ status: 201, description: '인증 성공', type: UserLoginDto })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async signIn(@GetUser('id') id: number, @Body() body: UserLoginDto) {
        return await this.authService.login(id);
    }
}
