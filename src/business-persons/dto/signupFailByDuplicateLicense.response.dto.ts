import { ApiProperty } from '@nestjs/swagger';

export class SignupFailByDuplicateLicenseResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: 403, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: "'123-45-67890'는 이미 가입된 사업자번호입니다.",
    description: '상태 메시지',
  })
  message: string;
}
