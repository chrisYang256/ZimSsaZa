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

import { TasksService } from './tasks.service';
import { GetMyInfo } from 'src/common/decorator/get-myInfo.decorator';
import { UserJwtAuthGuard } from 'src/auth/user-jwt-auth.guard';
import { BusinessPersonJwtAuthGuard } from 'src/auth/businessPerson-jwt-auth.guard';

import { BusinessPersonWithoutPasswordDto } from 'src/business-persons/dto/businessPerson-without-password.dto';
import { PagenationDto } from 'src/common/dto/pagenation.dto';
import { UserWithoutPasswordDto } from 'src/users/dto/user-without-password.dto';
import { NegoCostDto } from './dto/nego-cost.dto';
import { SubmitMovingInfoResponseDto } from './dto/submitMovingInfo.response.dto';
import { SubmitMovingInfoFailByExistNegoOrPickResponseDto } from './dto/submitMovingInfoFailByExistNegoOrPick.response.dto';
import { GetMovingInfoListNoMovingInfoResponseDto } from './dto/getMovingInfoListNoMovingInfo.response.dto';
import { GetMovingInfoListResponseDto } from './dto/getMovingInfoList.response.dto';
import { GetMovingInfoDetailResponseDto } from './dto/getMovingInfoDetail.response.dto';
import { GetMovingInfoDetailFailByRequestDoneResponseDto } from './dto/getMovingInfoDetailFailByRequestDone.response.dto';
import { GetMovingInfoDetailFailByNotFoundResponseDto } from './dto/getMovingInfoDetailFailByNotFound.response.dto';
import { SubmitEstimateResponseDto } from './dto/submitEstimate.response.dto';
import { SubmitEstimateFailByNoMovingInfoResponseDto } from './dto/submitEstimateFailByNoMovingInfo.response.dto';
import { SubmitEstimateFailByDuplicateSubmitResponseDto } from './dto/submitEstimateFailByDuplicateSubmit.response.dto';
import { SubmitEstimateFailByEventDoneResponseDto } from './dto/submitEstimateFailByEventDone.response.dto';
import { SubmitEstimateFailByNoUserResponseDto } from './dto/submitEstimateFailByNoUser.response.dto';
import { CheckEstimateListEstimateIsZeroResponseDto } from './dto/checkEstimateListEstimateIsZero.response.dto';
import { CheckEstimateListResponseDto } from './dto/checkEstimateList.response.dto';
import { CheckEstimateListFailByNoNegoResponseDto } from './dto/checkEstimateListFailByNoNego.response.dto';
import { PickEstimateResponseDto } from './dto/pickEstimate.response.dto';
import { PickEstimateFailByNoBusinessPersonResponseDto } from './dto/pickEstimateFailByNoBusinessPerson.response.dto';
import { PickEstimateFailByDuplicateChoiceResponseDto } from './dto/pickEstimateFailByDuplicateChoice.response.dto';
import { MakeMovingToDoneResponseDto } from 'src/common/dto/makeMovingToDone.response.dto';
import { MakeMovingToDoneFailByInvalidStepResponseDto } from 'src/common/dto/makeMovingToDoneFailByInvalidStep.response.dto';
import { MakeMovingToDoneFailByAlreadyCheckResponseDto } from 'src/common/dto/makeMovingToDoneFailByAlreadyCheck.response.dto';
import { MakeMovingToDoneFailByAlreadyDoneResponseDto } from 'src/common/dto/makeMovingToDoneFailByAlreadyDone.response.dto';
import { SubmitMovingInfoFailByNotFoundResponseDto } from './dto/submitMovingInfoFailByNotFound.response.dto';

@ApiTags('TASKS')
@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @ApiOperation({ summary: 'User: 견적요청' })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: SubmitMovingInfoResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '이미 진행중인 이사정보 존재',
    type: SubmitMovingInfoFailByExistNegoOrPickResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: '이삿짐 정보 없음',
    type: SubmitMovingInfoFailByNotFoundResponseDto,
  })
  @ApiBearerAuth('User-JWT-Auth')
  @UseGuards(UserJwtAuthGuard)
  @Post('movingInfo')
  submitMovingInfo(@GetMyInfo() user: UserWithoutPasswordDto) {
    return this.taskService.submitMovingInfo(user.id);
  }

  @ApiOperation({
    summary: 'Business Person: 기사님 본인 관할 견적요청 목록 조회',
  })
  @ApiResponse({
    status: 200,
    description: 'response success(요청 중인 견적 없음)',
    type: GetMovingInfoListNoMovingInfoResponseDto,
  })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: GetMovingInfoListResponseDto,
  })
  @ApiBearerAuth('BusinessPerson-JWT-Auth')
  @UseGuards(BusinessPersonJwtAuthGuard)
  @Get('movingInfo/list')
  getMovingInfoList(
    @Query() pagenation: PagenationDto,
    @GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto,
  ) {
    return this.taskService.getMovingInfoList(pagenation, businessPerson);
  }

  @ApiOperation({ summary: 'Business Person: 견적요청 상세 조회' })
  @ApiResponse({
    status: 200,
    description: 'response success',
    type: GetMovingInfoDetailResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '견적 요청 종료된 게시물.',
    type: GetMovingInfoDetailFailByRequestDoneResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: '게시물 없음.',
    type: GetMovingInfoDetailFailByNotFoundResponseDto,
  })
  @ApiParam({ name: 'movingInfoId', example: '5' })
  @ApiBearerAuth('BusinessPerson-JWT-Auth')
  @UseGuards(BusinessPersonJwtAuthGuard)
  @Get('movingInfo/detail/:movingInfoId')
  getMovingInfoDetail(@Param('movingInfoId') movingInfoId: number) {
    return this.taskService.getMovingInfoDetail(movingInfoId);
  }

  @ApiOperation({ summary: 'Business Person: 견적 금액 제출' })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: SubmitEstimateResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '견적요청 정보 없음',
    type: SubmitEstimateFailByNoMovingInfoResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: '이미 응답한 견적요청',
    type: SubmitEstimateFailByDuplicateSubmitResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: '견적서 접수한도 초과로 제출 불가',
    type: SubmitEstimateFailByEventDoneResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '견적 요청자 정보 없음',
    type: SubmitEstimateFailByNoUserResponseDto,
  })
  @ApiParam({ name: 'movingInfoId', example: '5' })
  @ApiBody({ description: '이사 견적 금액', type: NegoCostDto })
  @ApiBearerAuth('BusinessPerson-JWT-Auth')
  @UseGuards(BusinessPersonJwtAuthGuard)
  @Post('movingInfo/:movingInfoId/cost')
  submitEstimate(
    @Param('movingInfoId') movingInfoId: number,
    @Body('cost') cost: NegoCostDto,
    @GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto,
  ) {
    return this.taskService.submitEstimate(
      movingInfoId,
      businessPerson.id,
      cost,
    );
  }

  @ApiOperation({ summary: 'User: 받은 견적 리스트 보기' })
  @ApiResponse({
    status: 201,
    description: 'response success(받은 견적 0건)',
    type: CheckEstimateListEstimateIsZeroResponseDto,
  })
  @ApiResponse({
    status: 202,
    description: 'response success',
    type: CheckEstimateListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '견적 요청하지 않음',
    type: CheckEstimateListFailByNoNegoResponseDto,
  })
  @ApiBearerAuth('User-JWT-Auth')
  @UseGuards(UserJwtAuthGuard)
  @Get('movingInfo/estimates/list')
  checkEstimateList(@GetMyInfo() user: UserWithoutPasswordDto) {
    return this.taskService.checkEstimateList(user.id);
  }

  @ApiOperation({ summary: 'User: 견적서 선택(이사 담당 기사님 선택)' })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: PickEstimateResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '기사님 정보 없음',
    type: PickEstimateFailByNoBusinessPersonResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: '이미 견적서 선택',
    type: PickEstimateFailByDuplicateChoiceResponseDto,
  })
  @ApiParam({ name: 'movingInfoId', example: '5' })
  @ApiParam({ name: 'businessPersonId', example: '10' })
  @ApiBearerAuth('User-JWT-Auth')
  @UseGuards(UserJwtAuthGuard)
  @Patch('movingInfo/:movingInfoId/estimates/pick/:businessPersonId')
  pickEstimate(
    @Param('movingInfoId', ParseIntPipe) movingInfoId: number,
    @Param('businessPersonId', ParseIntPipe) businessPersonId: number,
  ) {
    return this.taskService.pickEstimate(movingInfoId, businessPersonId);
  }

  @ApiOperation({ summary: 'User: 유저 이사완료 체크' })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: MakeMovingToDoneResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '이미 완료확인 함',
    type: MakeMovingToDoneFailByAlreadyCheckResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: '완료 단계가 아님',
    type: MakeMovingToDoneFailByInvalidStepResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: '종결된 이사',
    type: MakeMovingToDoneFailByAlreadyDoneResponseDto,
  })
  @ApiParam({ name: 'movingInfoId', example: '5' })
  @ApiParam({ name: 'businessPersonId', example: '10' })
  @ApiBearerAuth('User-JWT-Auth')
  @UseGuards(UserJwtAuthGuard)
  @Patch('movingInfo/:movingInfoId/user-done/counterpart/:businessPersonId')
  makeMovingToDoneByUser(
    @Param('movingInfoId', ParseIntPipe) movingInfoId: number,
    @Param('businessPersonId', ParseIntPipe) businessPersonId: number,
  ) {
    return this.taskService.makeMovingToDoneByUser(
      movingInfoId,
      businessPersonId,
    );
  }

  @ApiOperation({ summary: 'Business Person: 기사님 이사완료 체크' })
  @ApiResponse({
    status: 201,
    description: 'response success',
    type: MakeMovingToDoneResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '이미 완료확인 함',
    type: MakeMovingToDoneFailByAlreadyCheckResponseDto,
  })
  @ApiResponse({
    status: 402,
    description: '완료 단계가 아님',
    type: MakeMovingToDoneFailByInvalidStepResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: '종결된 이사',
    type: MakeMovingToDoneFailByAlreadyDoneResponseDto,
  })
  @ApiParam({ name: 'movingInfoId', example: '5' })
  @ApiBearerAuth('BusinessPerson-JWT-Auth')
  @UseGuards(BusinessPersonJwtAuthGuard)
  @Patch('movingInfo/:movingInfoId/businessperson-done')
  makeMovingToDoneByBusinessPerson(
    @Param('movingInfoId', ParseIntPipe) movingInfoId: number,
    @GetMyInfo() businessPerson: BusinessPersonWithoutPasswordDto,
  ) {
    return this.taskService.makeMovingToDoneByBusinessPerson(
      movingInfoId,
      businessPerson.id,
    );
  }
}
