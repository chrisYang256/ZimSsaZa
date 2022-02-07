import { ApiProperty } from '@nestjs/swagger';

export class MakePackForMovingResponseDto {
  @ApiProperty({ example: '짐 싸기 완료!', description: '상태 메시지' })
  message: string;

  @ApiProperty({ example: '201', description: '상태 코드' })
  status: number;
}
