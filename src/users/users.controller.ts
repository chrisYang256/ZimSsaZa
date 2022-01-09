import { Body, Controller, Get, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { GetMyInfo } from 'src/common/decorator/get-myInfo.decorator';
import { LoginDto } from 'src/common/dto/login.dto';
import { UndefinedTonNllInterceptor } from 'src/common/interceptor/undefinedToNull.interceptor';
import { MoveStatusEnum } from 'src/common/moveStatus.enum';
import { Users } from 'src/entities/Users';
import { CreateUserDto } from './dto/create-user.dto';
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

    @ApiOperation({ summary: 'user 내 정보 조회' })
    @ApiResponse({ status: 200, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @UseGuards(JwtAuthGuard)
    @Get()
    myInfo(@GetMyInfo() user: UserWithoutPasswordDto) {
        return user;
    }

    @ApiOperation({ summary: 'user 회원 가입' })
    @ApiResponse({ status: 201, description: 'response 성공' })
    @ApiResponse({ status: 409, description: 'response 실패' })
    @Post('signup')
    signUp(@Body() createUserDto: CreateUserDto,) {
        return this.usersService.signUp(createUserDto);
    }

    @ApiOperation({ summary: 'user 로그인' })
    @ApiResponse({ status: 201, description: '인증 성공' })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async signIn(@GetMyInfo() user: Users, @Body() data: LoginDto) {
        return await this.authService.login(user);
    }


    @ApiQuery({ name: 'status', enum: MoveStatusEnum})
    @ApiOperation({ summary: 'enum test' })
    @Get('test')
    async testEnum(@Query('status') status: MoveStatusEnum = MoveStatusEnum.done) {
        return { "msg" : status };
    }


    // 리뷰 작성 api

    // 리뷰 조회 api -> 기사, 유저 각각
}
