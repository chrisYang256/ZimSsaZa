import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { BusinessPersonJwtAuthGuard } from 'src/auth/businessPerson-jwt-auth.guard';
import { NotLoggedInGuard } from 'src/auth/not-logged-in.guard';
import { GetMyInfo } from 'src/common/decorator/get-myInfo.decorator';
import { LoginDto } from 'src/common/dto/login.dto';
import { PagenationDto } from 'src/common/dto/pagenation.dto';
import { BusinessPersonsService } from './business-persons.service';
import { BusinessPersonWithoutPasswordDto } from './dto/businessPerson-without-password.dto';
import { CreateBusinessPersonDto } from './dto/create-businessPerson.dto';

@ApiTags('Business persons')
@Controller('business-persons')
export class BusinessPersonsController {
    constructor(
        private businessPersonService: BusinessPersonsService,
        private authService: AuthService,
    ) {}

    @ApiOperation({ summary: '내 정보 조회' })
    @ApiResponse({ status: 200, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiBearerAuth('BusinessPerson-JWT-Auth')
    @UseGuards(BusinessPersonJwtAuthGuard)
    @Get()
    myInfo(@GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto) {
        return businessPerson;
    }

    @ApiOperation({ summary: '회원 가입' })
    @ApiResponse({ status: 201, description: 'response 성공' })
    @ApiResponse({ status: 409, description: 'response 실패' })
    @UseGuards(NotLoggedInGuard)
    @Post('signup')
    signUp(@Body() createBusinessPersonDto: CreateBusinessPersonDto,) {
        return this.businessPersonService.signUp(createBusinessPersonDto);
    }

    @ApiOperation({ summary: '로그인' })
    @ApiResponse({ status: 201, description: '인증 성공'})
    @ApiResponse({ status: 401, description: '인증 실패'})
    @ApiBody({ type: LoginDto })
    @UseGuards(BusinessPersonJwtAuthGuard)
    @Post('login')
    async signIn(@GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto) {
        console.log('businessPerson:::', businessPerson)
        return await this.authService.login(businessPerson);
    }

    // 이사 예정인 목록 조회(pick받은 기사님은 pick한 유저 정보 조회 가능)

    @ApiOperation({ summary: '시스템 메시지 보기' })
    @ApiResponse({ status: 201, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiBearerAuth('BusinessPerson-JWT-Auth')
    @UseGuards(BusinessPersonJwtAuthGuard)
    @Get('messages')
    readMessage(
        @Query() pagenation: PagenationDto,
        @GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto,
    ) {
        return this.businessPersonService.readMessage(businessPerson.id, pagenation);
    }

    @ApiOperation({ summary: '읽지않은 시스템 메시지 카운팅' })
    @ApiResponse({ status: 201, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiBearerAuth('BusinessPerson-JWT-Auth')
    @UseGuards(BusinessPersonJwtAuthGuard)
    @Get('messages/unreads')
    unreadCount(
        @GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto,
    ) {
        return this.businessPersonService.unreadCount(businessPerson.id);
    }
}
