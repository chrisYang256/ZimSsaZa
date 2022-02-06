import { ApiProperty } from "@nestjs/swagger";
import { GetContractReviewRespnseDto } from "./getContractReviews.respnse.dto";

export class GetContractBusinessPersonResponseDto {
    @ApiProperty({ example: '3', description: '기사님 id',
    })
    id: number;

    @ApiProperty({ example: '정의의 기사님', description: '기사님 이름',
    })
    name: string;

    @ApiProperty({ example: '010-9876-5432', description: '기사님 휴대폰 번호',
    })
    phone_number: string;

    @ApiProperty({ description: '기사님 받은 리뷰', type: [GetContractReviewRespnseDto],
    })
    Reviews: GetContractReviewRespnseDto;
}