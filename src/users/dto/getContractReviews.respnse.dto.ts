import { ApiProperty } from "@nestjs/swagger";

export class GetContractReviewRespnseDto {
    @ApiProperty({ example: '박효신', description: '작성자',
    })
    writer: string;

    @ApiProperty({ example: '정말 좋으신 기사님!!', description: '리뷰 내용',
    })
    content: string;

    @ApiProperty({ example: '5', description: '별점',
    })
    star: number;
}