import {
  Get,
  Body,
  Post,
  Query,
  Param,
  UseGuards,
  Controller,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from '../auth/auth.service';
import { BusinessPersonsService } from './business-persons.service';
import { GetMyInfo } from '../common/decorator/get-myInfo.decorator';
import { NotLoggedInGuard } from '../auth/not-logged-in.guard';
import { BusinessPersonJwtAuthGuard } from '../auth/businessPerson-jwt-auth.guard';
import { BusinessPersonLocalAuthGuard } from '../auth/businessPerson-local-auth.guard';

import { BusinessPersonWithoutPasswordDto } from './dto/businessPerson-without-password.dto';
import { CreateBusinessPersonDto } from './dto/create-businessPerson.dto';
import { LoginDto } from '../common/dto/login.dto';
import { PagenationDto } from '../common/dto/pagenation.dto';
import { UnreadCountResponseDto } from 'src/common/dto/unreadCount.response.dto';
import { ReadMessageResponseDto } from 'src/common/dto/readMessage.response.dto';
import { ReadMessageNoMessageResponseDto } from 'src/common/dto/readMessageNoMessage.response.dto';
import { NoBusinessPersonResponseDto } from './dto/noBusinessPerson.response.dto';
import { SignUpResponseDto } from 'src/common/dto/signup.response.dto';
import { SignupFailByDataMissingResponseDto } from 'src/common/dto/signupFailByDataMissing.response.dto';
import { SignupFailByDataFormResponseDto } from 'src/common/dto/signupFailByDataForm.response.dto';
import { SignupFailByDuplicateEmailResponseDto } from 'src/common/dto/signupFailByDuplicateEmail.response.dto';
import { SignupFailByDuplicateLicenseResponseDto } from './dto/signupFailByDuplicateLicense.response.dto';
import { LoginResponseDto } from 'src/common/dto/login.response.dto';
import { LoginFailByNoUserResponseDto } from 'src/common/dto/loginFailByNoUser.response.dto';
import { LoginFailByPasswordResponseDto } from 'src/common/dto/loginFailByPassword.response.dto';
import { GetScheduleListNoScheduleResponseDto } from './dto/getScheduleListNoSchedule.response.dto';
import { MyInfoResponseDto } from './dto/myInfo.response.dto';
import { GetScheduleListResponseDto } from './dto/getScheduleList.response.dto';
import { GetScheduleDetailResponseDto } from './dto/getScheduleDetail.response.dto';
import { GetScheduleDetailNoMovingInfoResponseDto } from './dto/getScheduleDetailNoMovingInfo.response.dto copy';

@ApiTags('Business persons')
@Controller('business-persons')
export class BusinessPersonsController {
  constructor(
    private businessPersonService: BusinessPersonsService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: '??? ?????? ??????' })
  @ApiResponse({
    status: 200,
    description: 'response success',
    type: MyInfoResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'no_token',
    type: NoBusinessPersonResponseDto,
  })
  @ApiBearerAuth('BusinessPerson-JWT-Auth')
  @UseGuards(BusinessPersonJwtAuthGuard)
  @Get()
  myInfo(@GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto) {
    return this.businessPersonService.businessPersonInfo(businessPerson);
  }

  @ApiOperation({ summary: '?????? ??????' })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: SignUpResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '????????? ??????',
    type: SignupFailByDataMissingResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: '????????? ?????? ??????',
    type: SignupFailByDataFormResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: '?????? ????????? ?????????',
    type: SignupFailByDuplicateEmailResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '?????? ????????? ???????????????',
    type: SignupFailByDuplicateLicenseResponseDto,
  })
  @UseGuards(NotLoggedInGuard)
  @Post('signup')
  signUp(@Body() createBusinessPersonDto: CreateBusinessPersonDto) {
    return this.businessPersonService.signUp(createBusinessPersonDto);
  }

  @ApiOperation({ summary: '?????????' })
  @ApiResponse({
    status: 200,
    description: 'response success',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '???????????? ?????? ??????',
    type: LoginFailByNoUserResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: '???????????? ??????',
    type: LoginFailByPasswordResponseDto,
  })
  @ApiBody({ type: LoginDto })
  @UseGuards(BusinessPersonLocalAuthGuard)
  @Post('login')
  async signIn(@GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto) {
    console.log('businessPerson:::', businessPerson);
    return this.authService.login(businessPerson);
  }

  @ApiOperation({ summary: '????????? ?????? ?????? ??????' })
  @ApiResponse({
    status: 200,
    description: 'response success(???????????? ?????? ??????)',
    type: GetScheduleListNoScheduleResponseDto,
  })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: GetScheduleListResponseDto,
  })
  @ApiBearerAuth('BusinessPerson-JWT-Auth')
  @UseGuards(BusinessPersonJwtAuthGuard)
  @Get('contract/undone/list')
  getScheduleList(
    @GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto,
  ) {
    return this.businessPersonService.getScheduleList(businessPerson.id);
  }

  @ApiOperation({ summary: '????????? ?????? ?????? ??????' })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: GetScheduleDetailResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '???????????? ??????',
    type: GetScheduleDetailNoMovingInfoResponseDto,
  })
  @ApiParam({ name: 'movingInfoId', example: '5' })
  @ApiBearerAuth('BusinessPerson-JWT-Auth')
  @UseGuards(BusinessPersonJwtAuthGuard)
  @Get('contract/undone/detail/:movingInfoId')
  getScheduleDetail(
    @GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto,
    @Param('movingInfoId', ParseIntPipe) movingInfoId: number,
  ) {
    return this.businessPersonService.getScheduleDetail(
      businessPerson.id,
      movingInfoId,
    );
  }

  @ApiOperation({ summary: '????????? ????????? ??????' })
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
  @ApiBearerAuth('BusinessPerson-JWT-Auth')
  @UseGuards(BusinessPersonJwtAuthGuard)
  @Get('messages')
  readMessage(
    @Query() pagenation: PagenationDto,
    @GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto,
  ) {
    return this.businessPersonService.readMessage(
      businessPerson.id,
      pagenation,
    );
  }

  @ApiOperation({ summary: '???????????? ????????? ????????? ?????????' })
  @ApiResponse({
    status: 200,
    description: 'response success(No new message)',
    type: UnreadCountResponseDto,
  })
  @ApiBearerAuth('BusinessPerson-JWT-Auth')
  @UseGuards(BusinessPersonJwtAuthGuard)
  @Get('messages/unreads')
  unreadCount(@GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto) {
    return this.businessPersonService.unreadCount(businessPerson.id);
  }
}
