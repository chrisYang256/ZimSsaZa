import { ApiProperty } from "@nestjs/swagger"

export class SignUpResponseDto {
    @ApiProperty({ example: '회원 가입 성공', description: '상태 메시지',
    })
    message: string;

    @ApiProperty({ example: '201', description: '상태 코드',
    })
    statusCode: number;
}