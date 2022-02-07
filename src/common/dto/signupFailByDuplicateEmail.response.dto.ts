import { ApiProperty } from '@nestjs/swagger';

export class SignupFailByDuplicateEmailResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: 403, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: "'zimssaza@gmail.com'는 이미 가입된 이메일입니다.",
    description: '상태 메시지',
  })
  message: string;
}
