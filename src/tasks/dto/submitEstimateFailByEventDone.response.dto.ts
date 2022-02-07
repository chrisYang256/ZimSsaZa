import { ApiProperty } from '@nestjs/swagger';

export class SubmitEstimateFailByEventDoneResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: 403, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '이미 10건의 견적서 접수가 완료되었습니다.',
    description: '상태 메시지',
  })
  message: string;
}
