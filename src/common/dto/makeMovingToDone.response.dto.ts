import { ApiProperty } from '@nestjs/swagger';

export class MakeMovingToDoneResponseDto {
  @ApiProperty({ example: '이사완료 확인!', description: '상태 메시지' })
  message: string;

  @ApiProperty({ example: '201', description: '상태 코드' })
  status: number;
}
