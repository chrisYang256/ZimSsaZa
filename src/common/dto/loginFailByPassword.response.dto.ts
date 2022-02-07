import { ApiProperty } from '@nestjs/swagger';

export class LoginFailByPasswordResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: '403', description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '비밀번호가 일치하지 않습니다.',
    description: '상태 메시지',
  })
  message: string;
}
