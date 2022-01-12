import { Controller, Get, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserJwtAuthGuard } from 'src/auth/user-jwt-auth.guard';
import { GetMyInfo } from 'src/common/decorator/get-myInfo.decorator';
import { Users } from 'src/entities/Users';
import { UserWithoutPasswordDto } from 'src/users/dto/user-without-password.dto';
import { TasksService } from './tasks.service';

@ApiTags('TASK')
@Controller('tasks')
export class TasksController {
    constructor(
        private taskService: TasksService,
    ) {}

    // 내 이사정보 모두 가져오기 api

    @ApiOperation({ summary: '견적을 받기 위한 이사정보 발송'})
    @ApiResponse({ status: 200, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiBearerAuth('JWT-Auth')
    @UseGuards(UserJwtAuthGuard)
    @Get('submit/movingInfo')
    submitMovingInfo(
        @GetMyInfo() user: Users,
        ) {
        console.log('user:::::::',user)
        return this.taskService.submitMovingInfo(user.id)
    }

    // @Post('submit/negoInfo')
}
