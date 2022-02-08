import { ApiProperty } from '@nestjs/swagger';

export class LoginFailByNoUserResponseDto {
  @ApiProperty({ example: false, description: '성공 여부' })
  success: boolean;

  @ApiProperty({ example: 404, description: '상태 코드' })
  status: number;

  @ApiProperty({
    example: `'zimssaza@gmail.com' 회원을 찾을 수 없습니다.`,
    description: '상태 메시지',
  })
  message: string;
}
