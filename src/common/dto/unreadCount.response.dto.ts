import { ApiProperty } from "@nestjs/swagger"

export class UnreadCountResponseDto {
    @ApiProperty({ example: 2, description: '읽지 않은 메시지 갯수',
    })
    count: number;

    @ApiProperty({ example: 200, description: '받은 메시지들',
    })
    status: number;
}