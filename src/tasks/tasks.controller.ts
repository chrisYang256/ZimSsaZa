import { Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BPJwtAuthGuard } from 'src/auth/bp-jwt-auth.guard';
import { UserJwtAuthGuard } from 'src/auth/user-jwt-auth.guard';
import { BPWithoutPasswordDto } from 'src/business-persons/dto/bp-without-password.dto';
import { GetMyInfo } from 'src/common/decorator/get-myInfo.decorator';
import { PagenationDto } from 'src/common/dto/pagenation.dto';
import { UserWithoutPasswordDto } from 'src/users/dto/user-without-password.dto';
import { TasksService } from './tasks.service';

@ApiTags('TASK')
@Controller('tasks')
export class TasksController {
    constructor(
        private taskService: TasksService,
    ) {}

    @ApiOperation({ summary: '견적을 받기 위한 이사정보 제출'})
    @ApiResponse({ status: 200, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiBearerAuth('JWT-Auth')
    @UseGuards(UserJwtAuthGuard)
    @Post('movingInfo')
    submitMovingInfo(
        @GetMyInfo() user: UserWithoutPasswordDto,
        ) {
        return this.taskService.submitMovingInfo(user.id)
    }

    @ApiOperation({ summary: '기사님 관할 견적요청 목록 조회'})
    @ApiResponse({ status: 200, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiBearerAuth('JWT-Auth')
    @UseGuards(BPJwtAuthGuard)
    @Get('movingInfo/board')
    getMovingInfoList(
        @GetMyInfo() bp: BPWithoutPasswordDto,
        @Query() pagenation: PagenationDto
        ) {
        return this.taskService.getMovingInfoList(bp, pagenation)
    }    

    @ApiBearerAuth('JWT-Auth')
    @UseGuards(UserJwtAuthGuard)
    @Get('test')
    getMovingInfo(@GetMyInfo() user) {
        return this.taskService.getMovingInfo(user)
    }

    // @ApiOperation({ summary: '기사님이 제출된 이사정보에 대해 견적 제출' })
    // @ApiResponse({ status: 200, description: 'response 성공' })
    // @ApiResponse({ status: 401, description: 'response 실패' })
    // @ApiBearerAuth('JWT-Auth')
    // @UseGuards(BPJwtAuthGuard)
    // @Post('movingInfo/:id/cost')
    // submitNegoCost(
    //     @Query() movingInfoId: number,
    //     @GetMyInfo() bp: BPWithoutPasswordDto
    // ) {
    //     return this.taskService.submitNegoCost(movingInfoId, bp)
    // }
}
