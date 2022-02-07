import { ApiProperty } from '@nestjs/swagger';

export class SubmitMovingInfoResponseDto {
  @ApiProperty({ example: 201, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '견적 요청이 정상적으로 처리되었습니다!',
    description: '상태 메시지',
  })
  message: string;
}
