import { ApiProperty } from '@nestjs/swagger';

export class NoUserResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: '401', description: '상태 코드' })
  status: number;

  @ApiProperty({ example: 'Unauthorized', description: '상태 메시지' })
  message: string;
}
