import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { UserJwtAuthGuard } from 'src/auth/user-jwt-auth.guard';
import { UserLocalAuthGuard } from 'src/auth/user-local-auth.guard';
import { GetMyInfo } from 'src/common/decorator/get-myInfo.decorator';
import { LoginDto } from 'src/common/dto/login.dto';
import { CreateMovingGoodsDto } from 'src/users/dto/create-movingGoods.dto';
import { UndefinedTonNllInterceptor } from 'src/common/interceptor/undefinedToNull.interceptor';
import { Users } from 'src/entities/Users';
import { CreateUserDto } from './dto/create-user.dto';
import { UserWithoutPasswordDto } from './dto/user-without-password.dto';
import { UsersService } from './users.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.guard';
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

    @ApiOperation({ summary: '내 정보 조회' })
    @ApiResponse({ status: 200, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiBearerAuth('User-JWT-Auth')
    @UseGuards(UserJwtAuthGuard)
    @Get()
    myInfo(@GetMyInfo() user: UserWithoutPasswordDto) {
        return user;
    }

    @ApiOperation({ summary: '회원 가입' })
    @ApiResponse({ status: 201, description: 'response 성공' })
    @ApiResponse({ status: 409, description: 'response 실패' })
    @UseGuards(NotLoggedInGuard)
    @Post('signup')
    signUp(@Body() createUserDto: CreateUserDto,) {
        return this.usersService.signUp(createUserDto);
    }
    
    @ApiOperation({ summary: '로그인' })
    @ApiResponse({ status: 200, description: '인증 성공' })
    @ApiResponse({ status: 401, description: '인증 실패' })
    @ApiBody({ type: LoginDto })
    @UseGuards(UserLocalAuthGuard)
    @Post('login')
    signIn(@GetMyInfo() user: Users) {
        return this.authService.login(user);
    }


    @ApiOperation({ summary: '이삿짐 생성' })
    @ApiResponse({ status: 201, description: 'response 성공' })
    @ApiResponse({ status: 409, description: 'response 실패' }) // response 세분화해서 추가하기
    @ApiConsumes('multipart/form-data') // m/f-d
    @ApiBody({ description: '이삿짐 정보 / 이미지', type: CreateMovingGoodsDto })  // m/f-d
    @UseInterceptors(FilesInterceptor('img_path', 20, {
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
    @ApiBearerAuth('User-JWT-Auth')
    @UseGuards(UserJwtAuthGuard)
    @Post('pack')
    async makePackForMoving(
        @GetMyInfo() user: Users,
        @Body() createMovingGoodsDto: CreateMovingGoodsDto,
        @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
        console.log('makePackForMoving - multer files:::', files);
        console.log('makePackForMoving - movingGoodsInfoDto:::', createMovingGoodsDto);
        return this.usersService.makePackForMoving(createMovingGoodsDto, files, user.id);
    }

    @ApiOperation({ summary: '이삿짐 삭제' })
    @ApiResponse({ status: 201, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiBearerAuth('User-JWT-Auth')
    @UseGuards(UserJwtAuthGuard)
    @Delete('pack/:packId')
    removePack(
        @GetMyInfo() user: UserWithoutPasswordDto,
        @Param('packId', ParseIntPipe) packId: number
    ) {
        return this.usersService.removePack(user.id, packId);
    }
    
    // nego 이상 진행중인 movingInfo관련 조회(pick한 기사님의 정보 조회 가능)

}
