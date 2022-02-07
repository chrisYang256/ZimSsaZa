import { ApiProperty } from '@nestjs/swagger';

export class SignupFailByDataFormResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: 403, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '이메일(전화번호, 비밀번호) 형식이 올바르지 않습니다.',
    description: '상태 메시지',
  })
  message: string;
}
