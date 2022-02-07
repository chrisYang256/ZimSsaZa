import { ApiProperty } from '@nestjs/swagger';

export class SignupFailByDataMissingResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: '403', description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: '이메일(비밀번호)가 입력되지 않았습니다.',
    description: '상태 메시지',
  })
  message: string;
}
