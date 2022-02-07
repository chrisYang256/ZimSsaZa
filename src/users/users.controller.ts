import {
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  UseGuards,
  Controller,
  ParseIntPipe,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiConsumes,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import fs from 'fs';
import path from 'path';
import multer from 'multer';

import { Users } from 'src/entities/Users';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { GetMyInfo } from 'src/common/decorator/get-myInfo.decorator';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.guard';
import { UserJwtAuthGuard } from 'src/auth/user-jwt-auth.guard';
import { UserLocalAuthGuard } from 'src/auth/user-local-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UndefinedTonNllInterceptor } from 'src/common/interceptor/undefinedToNull.interceptor';

import { CreateMovingGoodsDto } from 'src/users/dto/create-movingGoods.dto';
import { LoginDto } from 'src/common/dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserWithoutPasswordDto } from './dto/user-without-password.dto';
import { PagenationDto } from 'src/common/dto/pagenation.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { NoUserResponseDto } from './dto/noUser.response.dto';
import { UserInfoResponseDto } from './dto/userInfo.response.dto';
import { SignUpResponseDto } from '../common/dto/signup.response.dto';
import { LoginResponseDto } from '../common/dto/login.response.dto';
import { MakePackForMovingUnauthorizedResponseDto } from './dto/makePackForMovingUnauthorized.response.dto';
import { MakePackForMovingExistPackResponseDto } from './dto/makePackForMovingExistPack.response.dto';
import { MakePackForMovingResponseDto } from './dto/makePackForMoving.response.dto';
import { RemovePackResponseDto } from './dto/removePack.response.dto';
import { RemovePackNotExistPackResponseDto } from './dto/removePackNotExistPack.response.dto';
import { RemovePackInProgressPackResponseDto } from './dto/removePackInProgressPack.response.dto';
import { GetContractRespnseDto } from './dto/getContract.response.dto';
import { GetContractNoContractResponseDto } from './dto/getContractNoContract.response.dto';
import { GetContractNoBusinesspersonResponseDto } from './dto/getContractNoBusinessperson.response.dto';
import { WriteReviewResponseDto } from './dto/writeReview.response.dto';
import { WriteReviewMovingIsNotDoneResponseDto } from './dto/writeReviewMovingIsNotDone.response.dto';
import { WriteReviewAlreadyWriteResponseDto } from './dto/writeReviewAlreadyWrite.response.dto';
import { ReadMessageNoMessageResponseDto } from 'src/common/dto/readMessageNoMessage.response.dto';
import { ReadMessageResponseDto } from 'src/common/dto/readMessage.response.dto';
import { UnreadCountResponseDto } from 'src/common/dto/unreadCount.response.dto';
import { SignupFailByDataMissingResponseDto } from 'src/common/dto/signupFailByDataMissing.response.dto';
import { SignupFailByDuplicateEmailResponseDto } from 'src/common/dto/signupFailByDuplicateEmail.response.dto';
import { SignupFailByDataFormResponseDto } from 'src/common/dto/signupFailByDataForm.response.dto';
import { LoginFailByNoUserResponseDto } from 'src/common/dto/loginFailByNoUser.response.dto';
import { LoginFailByPasswordResponseDto } from 'src/common/dto/loginFailByPassword.response.dto';

try {
  fs.readdirSync('img-uploads');
} catch (error) {
  console.error('img-uploads폴더가 존재하지 않아 폴더를 생성합니다.');
  fs.mkdirSync('img-uploads');
}

@UseInterceptors(UndefinedTonNllInterceptor)
@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: UserInfoResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'no_token',
    type: NoUserResponseDto,
  })
  @ApiBearerAuth('User-JWT-Auth')
  @UseGuards(UserJwtAuthGuard)
  @Get()
  myInfo(@GetMyInfo() user: UserWithoutPasswordDto) {
    return user;
  }

  @ApiOperation({ summary: '회원 가입' })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: SignUpResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '데이터 누락',
    type: SignupFailByDataMissingResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: '데이터 형식 틀림',
    type: SignupFailByDataFormResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: '이미 가입된 이메일',
    type: SignupFailByDuplicateEmailResponseDto,
  })
  @UseGuards(NotLoggedInGuard)
  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signUp(createUserDto);
  }

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    description: 'response success',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '존재하지 않는 회원',
    type: LoginFailByNoUserResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: '비밀번호 틀림',
    type: LoginFailByPasswordResponseDto,
  })
  @ApiBody({ type: LoginDto })
  @UseGuards(UserLocalAuthGuard)
  @Post('login')
  signIn(@GetMyInfo() user: Users) {
    return this.authService.login(user);
  }

  @ApiOperation({ summary: '이삿짐 생성' })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: MakePackForMovingResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '만들어진 이삿짐 존재',
    type: MakePackForMovingExistPackResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: 'no_token',
    type: MakePackForMovingUnauthorizedResponseDto,
  })
  @ApiConsumes('multipart/form-data') // m/f-d
  @ApiBody({ description: '이삿짐 정보 / 이미지', type: CreateMovingGoodsDto }) // m/f-d
  @UseInterceptors(
    FilesInterceptor('img_path', 20, {
      storage: multer.diskStorage({
        destination: (req, file, cd) => {
          cd(null, 'img-uploads/');
        },
        filename: (req, file, cb) => {
          const extName = path.extname(file.originalname);
          cb(
            null,
            path.basename(file.originalname, extName) +
              Date.now() +
              '_load' +
              extName,
          );
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10Mb
    }),
  )
  @ApiBearerAuth('User-JWT-Auth')
  @UseGuards(UserJwtAuthGuard)
  @Post('pack')
  async makePackForMoving(
    @GetMyInfo() user: UserWithoutPasswordDto,
    @Body() createMovingGoodsDto: CreateMovingGoodsDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    console.log('makePackForMoving - multer files:::', files);
    console.log(
      'makePackForMoving - movingGoodsInfoDto:::',
      createMovingGoodsDto,
    );
    return this.usersService.makePackForMoving(
      createMovingGoodsDto,
      files,
      user.id,
    );
  }

  @ApiOperation({ summary: '이삿짐 삭제' })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: RemovePackResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '만들어진 이삿짐 없음',
    type: RemovePackNotExistPackResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: '견적 받는 중 or 이사중 삭제 요청',
    type: RemovePackInProgressPackResponseDto,
  })
  @ApiParam({ name: 'movingInfoId', example: '5' })
  @ApiBearerAuth('User-JWT-Auth')
  @UseGuards(UserJwtAuthGuard)
  @Delete('pack/:movingInfoId')
  removePack(
    @GetMyInfo() user: UserWithoutPasswordDto,
    @Param('movingInfoId', ParseIntPipe) movingInfoId: number,
  ) {
    return this.usersService.removePack(user.id, movingInfoId);
  }

  @ApiOperation({ summary: '계약 후 이사정보 조회하기(기사님 정보 포함)' })
  @ApiResponse({
    status: 200,
    description: 'response success',
    type: GetContractRespnseDto,
  })
  @ApiResponse({
    status: 401,
    description: '계약된 이사 없음',
    type: GetContractNoContractResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: '기사님 정보 없음',
    type: GetContractNoBusinesspersonResponseDto,
  })
  @ApiBearerAuth('User-JWT-Auth')
  @UseGuards(UserJwtAuthGuard)
  @Get('contract')
  getContract(@GetMyInfo() user: UserWithoutPasswordDto) {
    return this.usersService.getContract(user.id);
  }

  @ApiOperation({ summary: '이사 완료시 파트너 기사님에게 리뷰 작성' })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: WriteReviewResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '이사가 완료되지 않음',
    type: WriteReviewMovingIsNotDoneResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: '작성한 리뷰가 있음',
    type: WriteReviewAlreadyWriteResponseDto,
  })
  @ApiParam({ name: 'movingInfoId', example: '5' })
  @ApiParam({ name: 'businessPersonId', example: '10' })
  @ApiBearerAuth('User-JWT-Auth')
  @UseGuards(UserJwtAuthGuard)
  @Post('review/:businessPersonId/:movingInfoId')
  async writeReview(
    @GetMyInfo() user: UserWithoutPasswordDto,
    @Body() data: CreateReviewDto,
    @Param('businessPersonId', ParseIntPipe) businessPersonId: number,
    @Param('movingInfoId', ParseIntPipe) movingInfoId: number,
  ) {
    return this.usersService.writeReview(
      user,
      businessPersonId,
      movingInfoId,
      data,
    );
  }

  @ApiOperation({ summary: '시스템 메시지 보기' })
  @ApiResponse({
    status: 200,
    description: 'response success(No message)',
    type: ReadMessageNoMessageResponseDto,
  })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: ReadMessageResponseDto,
  })
  @ApiBearerAuth('User-JWT-Auth')
  @UseGuards(UserJwtAuthGuard)
  @Get('messages')
  readMessage(
    @Query() pagenation: PagenationDto,
    @GetMyInfo() user: UserWithoutPasswordDto,
  ) {
    return this.usersService.readMessage(user.id, pagenation);
  }

  @ApiOperation({ summary: '읽지않은 시스템 메시지 카운팅' })
  @ApiResponse({
    status: 200,
    description: 'response success(No new message)',
    type: UnreadCountResponseDto,
  })
  @ApiBearerAuth('User-JWT-Auth')
  @UseGuards(UserJwtAuthGuard)
  @Get('messages/unreads')
  unreadCount(@GetMyInfo() user: UserWithoutPasswordDto) {
    return this.usersService.unreadCount(user.id);
  }
}
