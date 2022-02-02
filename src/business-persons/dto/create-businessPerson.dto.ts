import { ApiProperty } from '@nestjs/swagger';

export class CreateBusinessPersonDto {
  @ApiProperty({ example: '정의의 기사님', description: '사업자 이름' })
  name: string;

  @ApiProperty({ example: 'zimssaza@gmail.com', description: '사업자 이메일' })
  email: string;

  @ApiProperty({
    example: '1234abcd!',
    description: '사업자 비밀번호(알파벳+숫자+특수문자 8~15자리)',
  })
  password: string;

  @ApiProperty({
    example: '010-0000-0000',
    description: '사업자 휴대폰 번호(010-숫자 3~4자리-숫자 4자리)',
  })
  phone_number: string;

  @ApiProperty({ example: '123-45-67890', description: '사업자 번호' })
  business_license: string;

  @ApiProperty({ example: '[1, 4, 5]', description: '지역 코드' })
  code: Array<number>;
}
