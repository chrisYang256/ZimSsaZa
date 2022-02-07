import { ApiProperty } from '@nestjs/swagger';

export class GetMovingInfoDetailFailByNotFoundResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: 404, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '게시물이 존재하지 않습니다.',
    description: '상태 메시지',
  })
  message: string;
}
