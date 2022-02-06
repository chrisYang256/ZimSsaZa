import { ApiProperty } from "@nestjs/swagger"

export class SignupFailByDataFormResponseDto {
    @ApiProperty({ example: false, description: '성공 여부',
    })
    success: boolean;

    @ApiProperty({ example: '/users/signup', description: 'api 주소',
    })
    path: string;

    @ApiProperty({ example: '403', description: '상태 코드',
    })
    statusCode: number;

    @ApiProperty({ example: '이메일(전화번호, 비밀번호) 형식이 올바르지 않습니다.', description: '상태 메시지',
    })
    message: string;

    @ApiProperty({ example: '2022-02-06T09:43:45.788Z', description: '발생 시점',
    })
    timestamp: Date;
}