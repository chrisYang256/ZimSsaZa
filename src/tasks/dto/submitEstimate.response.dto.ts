import { ApiProperty } from '@nestjs/swagger';

export class SubmitEstimateResponseDto {
  @ApiProperty({ example: 201, description: '상태 코드' })
  status: number;

  @ApiProperty({ example: '견적서 제출 완료!', description: '상태 메시지' })
  message: string;
}
