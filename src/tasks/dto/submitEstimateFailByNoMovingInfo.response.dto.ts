import { ApiProperty } from '@nestjs/swagger';

export class SubmitEstimateFailByNoMovingInfoResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: 404, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '해당 견적요청이 존재하지 않습니다.',
    description: '상태 메시지',
  })
  message: string;
}
