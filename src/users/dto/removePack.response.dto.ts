import { ApiProperty } from '@nestjs/swagger';

export class RemovePackResponseDto {
  @ApiProperty({ example: '201', description: '상태 코드' })
  status: number;

  @ApiProperty({ example: '삭제 성공!', description: '상태 메시지' })
  message: string;
}
