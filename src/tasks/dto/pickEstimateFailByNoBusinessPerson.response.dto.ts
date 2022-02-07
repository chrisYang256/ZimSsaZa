import { ApiProperty } from '@nestjs/swagger';

export class PickEstimateFailByNoBusinessPersonResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: 404, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '존재하지 않거나 탈퇴한 기사님입니다.',
    description: '상태 메시지',
  })
  message: string;
}
