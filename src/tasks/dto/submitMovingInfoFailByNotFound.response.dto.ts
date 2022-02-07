import { ApiProperty } from '@nestjs/swagger';

export class SubmitMovingInfoFailByNotFoundResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: 404, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '이삿짐 정보가 존재하지 않습니다.',
    description: '상태 메시지',
  })
  message: string;
}
