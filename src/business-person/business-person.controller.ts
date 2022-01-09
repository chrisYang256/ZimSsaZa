import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { BPJwtAuthGuard } from 'src/auth/bp-jwt-auth.guard';
import { BPLocalAuthGuard } from 'src/auth/bp-local-auth.guard';
import { GetMyInfo } from 'src/common/decorator/get-myInfo.decorator';
import { LoginDto } from 'src/common/dto/login.dto';
import { BusinessPersonService } from './business-person.service';
import { BPWithoutPasswordDto } from './dto/bp-without-password.dto';
import { CreateBPDto } from './dto/create-bp.dto';

@Controller('business-person')
export class BusinessPersonController {
    constructor(
        private businessPersonService: BusinessPersonService,
        private authService: AuthService,
    ) {}

    @ApiOperation({ summary: 'BP 내 정보 조회' })
    @ApiResponse({ status: 200, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @UseGuards(BPJwtAuthGuard)
    @Get()
    myInfo(@GetMyInfo() data: BPWithoutPasswordDto) {
        console.log('data:::', data)
        return data;
    }

    @ApiOperation({ summary: 'BP 회원 가입' })
    @ApiResponse({ status: 201, description: 'response 성공' })
    @ApiResponse({ status: 409, description: 'response 실패' })
    @Post('signup')
    signUp(@Body() createBPDto: CreateBPDto,) {
        return this.businessPersonService.signUp(createBPDto);
    }

    @ApiOperation({ summary: 'BP로그인' })
    @ApiResponse({ status: 201, description: '인증 성공'})
    @ApiResponse({ status: 401, description: '인증 실패' })
    @UseGuards(BPLocalAuthGuard)
    @Post('login')
    async signIn(@GetMyInfo() bp: LoginDto) {
        console.log('bp:::::::', bp)
        return await this.authService.login(bp);
    }
}
