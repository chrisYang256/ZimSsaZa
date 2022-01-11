import { Body, Controller, Get, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { GetMyInfo } from 'src/common/decorator/get-myInfo.decorator';
import { LoginDto } from 'src/common/dto/login.dto';
import { MovingGoodsInfoDto } from 'src/common/dto/movingGoodsInfo.dto';
import { UndefinedTonNllInterceptor } from 'src/common/interceptor/undefinedToNull.interceptor';
import { MoveStatusEnum } from 'src/common/moveStatus.enum';
import { Users } from 'src/entities/Users';
import { CreateUserDto } from './dto/create-user.dto';
import { UserWithoutPasswordDto } from './dto/user-without-password.dto';
import { UsersService } from './users.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

try {
    fs.readdirSync('img-uploads');
} catch(error) {
    console.error('img-uploads폴더가 존재하지 않아 폴더를 생성합니다.');
    fs.mkdirSync('img-uploads');
}

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
    @ApiResponse({ status: 200, description: '인증 성공' })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @UseGuards(LocalAuthGuard)
    @Post('login')
    signIn(@GetMyInfo() user: Users, @Body() data: LoginDto) {
        return this.authService.login(user);
    }


    @ApiOperation({ summary: '이삿짐 정보' })
    @ApiResponse({ status: 201, description: 'response 성공' })
    @ApiResponse({ status: 409, description: 'response 실패' }) // response 세분화해서 추가하기
    @UseInterceptors(FilesInterceptor('img_path', 10, {
        storage: multer.diskStorage({
            destination: (req, file, cd) => {
                cd(null, 'img-uploads/');
            },
            filename: (req, file, cb) => {
                const extName = path.extname(file.originalname);
                cb(null, path.basename(file.originalname, extName) + Date.now() + '_load' + extName);
            }
        }),
        limits: { fileSize: 10 * 1024 * 1024 } // 10Mb
    }))
    @UseGuards(JwtAuthGuard)
    @Post('loads')
    makePackForMoving(
        @Body() movingGoodsInfoDto: MovingGoodsInfoDto,
        @UploadedFiles() files: Array<Express.Multer.File>,
        @GetMyInfo() user: Users,
    ) {
        // console.log('multer files:::', files);
        return this.usersService.makePackForMoving(movingGoodsInfoDto, files, user.id)
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
