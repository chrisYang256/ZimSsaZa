import { ApiProperty } from '@nestjs/swagger';

export class PickEstimateFailByDuplicateChoiceResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: 403, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: "이미 '정의의 기사님'기사님의 견적서를 선택하셨습니다.",
    description: '상태 메시지',
  })
  message: string;
}
