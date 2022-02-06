import { ApiProperty } from "@nestjs/swagger";

export class MessageWithContentAndCreatedAtDto {
    @ApiProperty({ example: '기사님의 견적서가 채택되었습니다🎉 스케쥴을 확인해주세요!!', description: '메시지 내용',
    })
    message: string;

    @ApiProperty({ example: '2022-02-06 20:50:38.232146', description: '생성 일시',
    })
    createdAt: string;
}