import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BPJwtAuthGuard } from 'src/auth/bp-jwt-auth.guard';
import { UserJwtAuthGuard } from 'src/auth/user-jwt-auth.guard';
import { BPWithoutPasswordDto } from 'src/business-persons/dto/bp-without-password.dto';
import { GetMyInfo } from 'src/common/decorator/get-myInfo.decorator';
import { UserWithoutPasswordDto } from 'src/users/dto/user-without-password.dto';
import { TasksService } from './tasks.service';

@ApiTags('TASK')
@Controller('tasks')
export class TasksController {
    constructor(
        private taskService: TasksService,
    ) {}

    @ApiOperation({ summary: '견적을 받기 위해 기사님들에게 이사정보 발송'})
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

    


    @ApiOperation({ summary: '기사님이 제출된 이사정보에 대해 견적 제출' })
    @ApiResponse({ status: 200, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiBearerAuth('JWT-Auth')
    @UseGuards(BPJwtAuthGuard)
    @Post('movingInfo/:id/cost')
    submitNegoCost(
        @Query() movingInfoId: number,
        @GetMyInfo() bp: BPWithoutPasswordDto
    ) {
        return this.taskService.submitNegoCost(movingInfoId, bp)
    }
}
