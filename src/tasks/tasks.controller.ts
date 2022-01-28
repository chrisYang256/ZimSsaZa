import { 
    Get, 
    Body, 
    Post, 
    Query, 
    Patch, 
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
import { BusinessPersonJwtAuthGuard } from 'src/auth/businessPerson-jwt-auth.guard';
import { UserJwtAuthGuard } from 'src/auth/user-jwt-auth.guard';
import { BusinessPersonWithoutPasswordDto } from 'src/business-persons/dto/businessPerson-without-password.dto';
import { GetMyInfo } from 'src/common/decorator/get-myInfo.decorator';
import { PagenationDto } from 'src/common/dto/pagenation.dto';
import { UserWithoutPasswordDto } from 'src/users/dto/user-without-password.dto';
import { NegoCostDto } from './dto/nego-cost.dto';
import { TasksService } from './tasks.service';

@ApiTags('TASKS')
@Controller('tasks')
export class TasksController {
    constructor(
        private taskService: TasksService,
    ) {}

    @ApiOperation({ summary: 'User: 견적요청'})
    @ApiResponse({ status: 200, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiBearerAuth('User-JWT-Auth')
    @UseGuards(UserJwtAuthGuard)
    @Post('movingInfo')
    submitMovingInfo(
        @GetMyInfo() user: UserWithoutPasswordDto,
        ) {
        return this.taskService.submitMovingInfo(user.id);
    }

    @ApiOperation({ summary: 'Business Person: 기사님 본인 관할 견적요청 목록 조회'})
    @ApiResponse({ status: 200, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiBearerAuth('BusinessPerson-JWT-Auth')
    @UseGuards(BusinessPersonJwtAuthGuard)
    @Get('movingInfo/list')
    getMovingInfoList(
        @Query() pagenation: PagenationDto,
        @GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto
        ) {
        return this.taskService.getMovingInfoList(pagenation, businessPerson);
    }    

    @ApiOperation({ summary: 'Business Person: 견적요청 상세 조회'})
    @ApiResponse({ status: 200, description: 'response 성공' })
    @ApiResponse({ status: 404, description: '게시물이 존재하지 않습니다.' })
    @ApiParam({ name: 'movingInfoId', example: '5' })
    @ApiBearerAuth('BusinessPerson-JWT-Auth')
    @UseGuards(BusinessPersonJwtAuthGuard)
    @Get('movingInfo/detail/:movingInfoId')
    getMovingInfoDetail(
        @Param('movingInfoId') movingInfoId: number
        ) {
        return this.taskService.getMovingInfoDetail(movingInfoId);
    }

    @ApiOperation({ summary: 'Business Person: 견적 금액 제출' })
    @ApiResponse({ status: 201, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiParam({ name: 'movingInfoId', example: '5' })
    @ApiBody({ description: '이사 견적 금액', type: NegoCostDto })
    @ApiBearerAuth('BusinessPerson-JWT-Auth')
    @UseGuards(BusinessPersonJwtAuthGuard)
    @Post('movingInfo/:movingInfoId/cost')
    submitEstimate(
        @Param('movingInfoId') movingInfoId: number,
        @Body('cost') cost: NegoCostDto,
        @GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto
        ) {
        return this.taskService.submitEstimate(movingInfoId, businessPerson.id, cost);
    }

    @ApiOperation({ summary: 'User: 받은 견적 리스트 보기'})
    @ApiResponse({ status: 200, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiBearerAuth('User-JWT-Auth')
    @UseGuards(UserJwtAuthGuard)
    @Get('movingInfo/estimates/list')
    checkEstimateList(
        @GetMyInfo() user: UserWithoutPasswordDto,
        ) {
        return this.taskService.checkEstimateList(user.id);
    }

    @ApiOperation({ summary: 'User: 견적서 선택(이사 담당 기사님 선택)'})
    @ApiResponse({ status: 201, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiParam({ name: 'movingInfoId', example: '5' })
    @ApiParam({ name: 'businessPersonId', example: '10' })
    @ApiBearerAuth('User-JWT-Auth')
    @UseGuards(UserJwtAuthGuard)
    @Patch('movingInfo/:movingInfoId/estimates/pick/:businessPersonId')
    pickEstimate(
        @Param('movingInfoId', ParseIntPipe) movingInfoId: number,
        @Param('businessPersonId', ParseIntPipe)  businessPersonId: number
        ) {
        return this.taskService.pickEstimate(movingInfoId, businessPersonId);
    }

    @ApiOperation({ summary: 'User: 유저 이사완료 체크'})
    @ApiResponse({ status: 201, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiParam({ name: 'movingInfoId', example: '5' })
    @ApiParam({ name: 'businessPersonId', example: '10' })
    @ApiBearerAuth('User-JWT-Auth')
    @UseGuards(UserJwtAuthGuard)
    @Patch('movingInfo/:movingInfoId/user-done/counterpart/:businessPersonId')
    makeMovingToDoneByUser(
        @Param('movingInfoId', ParseIntPipe) movingInfoId: number,
        @Param('businessPersonId', ParseIntPipe) businessPersonId: number
        ) {
        return this.taskService.makeMovingToDoneByUser(movingInfoId, businessPersonId);
    }

    @ApiOperation({ summary: 'Business Person: 기사님 이사완료 체크'})
    @ApiResponse({ status: 201, description: 'response 성공' })
    @ApiResponse({ status: 401, description: 'response 실패' })
    @ApiParam({ name: 'movingInfoId', example: '5' })
    @ApiBearerAuth('BusinessPerson-JWT-Auth')
    @UseGuards(BusinessPersonJwtAuthGuard)
    @Patch('movingInfo/:movingInfoId/businessperson-done')
    makeMovingToDoneByBusinessPerson(
        @Param('movingInfoId', ParseIntPipe) movingInfoId: number,
        @GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto
        ) {
        return this.taskService.makeMovingToDoneByBusinessPerson(movingInfoId, businessPerson.id);
    }
}
