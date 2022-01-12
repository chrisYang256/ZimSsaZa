import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserJwtAuthGuard } from 'src/auth/user-jwt-auth.guard';
import { GetMyInfo } from 'src/common/decorator/get-myInfo.decorator';
import { UserWithoutPasswordDto } from 'src/users/dto/user-without-password.dto';
import { TasksService } from './tasks.service';

@ApiTags('TASK')
@Controller('tasks')
export class TasksController {
    constructor(
        private taskService: TasksService,
    ) {}

    @ApiOperation({ summary: '견적을 받기 위한 이사정보 발송'})
    @ApiResponse({ status: 200, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @UseGuards(UserJwtAuthGuard)
    @Get('submit/movingInfo')
    submitMovingInfo(
        @GetMyInfo() user: UserWithoutPasswordDto,
    ) {
        return this.taskService.submitMovingInfo(user)
    }

    // @Post('submit/negoInfo')
}
