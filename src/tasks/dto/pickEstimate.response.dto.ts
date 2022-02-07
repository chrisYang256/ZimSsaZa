import { ApiProperty } from '@nestjs/swagger';

export class PickEstimateResponseDto {
  @ApiProperty({ example: 201, description: '상태 코드' })
  status: number;

  @ApiProperty({ example: '기사님 선택 완료!', description: '상태 메시지' })
  message: string;
}
