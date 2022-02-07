import { ApiProperty } from '@nestjs/swagger';

export class GetMovingInfoListNoMovingInfoResponseDto {
  @ApiProperty({ example: 200, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '현재 담당구역 내 견적 요청이 존재하지 않습니다.',
    description: '상태 메시지',
  })
  message: string;
}
