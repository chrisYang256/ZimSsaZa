import { ApiProperty } from '@nestjs/swagger';

export class WriteReviewAlreadyWriteResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: 403, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '이미 리뷰를 작성하셨습니다.',
    description: '상태 메시지',
  })
  message: string;
}
