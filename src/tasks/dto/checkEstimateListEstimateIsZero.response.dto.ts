import { ApiProperty } from '@nestjs/swagger';

export class CheckEstimateListEstimateIsZeroResponseDto {
  @ApiProperty({ example: 200, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '받은 견적 내역이 없습니다.',
    description: '상태 메시지',
  })
  message: string;
}
