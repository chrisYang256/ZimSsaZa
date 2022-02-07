import { ApiProperty } from '@nestjs/swagger';

export class GetMovingInfoDetailFailByRequestDoneResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: 403, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '견적 요청 완료/취소된 게시물입니다.',
    description: '상태 메시지',
  })
  message: string;
}
