import { ApiProperty } from '@nestjs/swagger';

export class RemovePackInProgressPackResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: 403, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '견적을 받는 중이거나 이사중인 경우 삭제할 수 없습니다.',
    description: '상태 메시지',
  })
  message: string;
}
