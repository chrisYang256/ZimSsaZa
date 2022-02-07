import { ApiProperty } from '@nestjs/swagger';

export class ReadMessageNoMessageResponseDto {
  @ApiProperty({ example: 200, description: '상태 코드' })
  statusCode: number;

  @ApiProperty({
    example: '받은 메시지가 없습니다.',
    description: '상태 메시지',
  })
  message: string;
}
