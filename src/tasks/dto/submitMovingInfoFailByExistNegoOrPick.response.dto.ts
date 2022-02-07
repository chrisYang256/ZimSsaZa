import { ApiProperty } from '@nestjs/swagger';

export class SubmitMovingInfoFailByExistNegoOrPickResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: 403, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '이미 진행 중인 이사정보가 존재합니다.',
    description: '상태 메시지',
  })
  message: string;
}
