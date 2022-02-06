import { ApiProperty } from "@nestjs/swagger"

export class WriteReviewMovingIsNotDoneResponseDto {
    @ApiProperty({ example: false, description: '성공 여부',
    })
    success: boolean;

    @ApiProperty({ example: '/users/review/5/10', description: 'api 주소',
    })
    path: string;

    @ApiProperty({ example: '403', description: '상태 코드',
    })
    statusCode: number;

    @ApiProperty({ example: '이사가 완료되지 않았습니다.', description: '상태 메시지',
    })
    message: string;

    @ApiProperty({ example: '2022-02-06T09:43:45.788Z', description: '발생 시점',
    })
    timestamp: Date;
}