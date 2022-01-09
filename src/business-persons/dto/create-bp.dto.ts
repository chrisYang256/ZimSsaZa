import { ApiProperty } from "@nestjs/swagger";

export class CreateBPDto {
    @ApiProperty({ example: 3, description: 'users PK'})
    name: string;

    @ApiProperty({ example: 'ssazim@google.com', description: '사업자 이메일'})
    email: string;

    @ApiProperty({ example: '알파벳+숫자+특수문자 8~15자리', description: '사업자 비밀번호'})
    password: string;
    
    @ApiProperty({ example: '010-(3~4자리)-(4자리)', description: '사업자 휴대폰 번호'})
    phone_number: string;

    @ApiProperty({ example: '123-45-67890', description: '사업자 번호'})
    business_license: string;

    @ApiProperty({ example: '3 | [1, 4, 5]', description: '지역 코드'})
    code: Array<number>;
}