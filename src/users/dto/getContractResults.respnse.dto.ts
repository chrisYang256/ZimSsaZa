import { ApiProperty } from "@nestjs/swagger";
import { GetContractBusinessPersonResponseDto } from "./getContractBusinessPerson.respnse.dto";

export class GetContractResultsRespnseDto {
    @ApiProperty({ example: '서울 특별시 중구', description: '출발지 주소',
    })
    start_point: string;

    @ApiProperty({ example: '서울 특별시 동작구', description: '도착지 주소',
    })
    destination: string;

    @ApiProperty({ example: '2021-12-30', description: '이사 날짜',
    })
    move_date: string;

    @ApiProperty({ example: '13:30', description: '이사 시간',
    })
    move_time: string;

    @ApiProperty({ example: 5, description: '평균 별점',
    })
    starsAvg: number;

    @ApiProperty({ example: 200000, description: '견적 금액',
    })
    cost: number;

    @ApiProperty({ description: '기사님 정보', type: GetContractBusinessPersonResponseDto,
    })
    BusinessPerson: GetContractBusinessPersonResponseDto;
}