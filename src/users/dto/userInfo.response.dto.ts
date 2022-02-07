import { ApiProperty } from '@nestjs/swagger';

export class UserInfoResponseDto {
  @ApiProperty({ example: 3, description: '유저 PK' })
  id: number;

  @ApiProperty({ example: 'zimssaza@gmail.com', description: '유저 이메일' })
  email: string;

  @ApiProperty({ example: '사자짐', description: '유저 이름' })
  name: string;

  @ApiProperty({ example: '010-1234-5678', description: '유저 휴대폰 번호' })
  phone_number: string;

  @ApiProperty({
    example: '2022-02-06T09:43:45.788Z',
    description: '가입 일자',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2022-02-06T09:43:45.788Z',
    description: '수정 일자',
  })
  updatedAt: Date;
}
