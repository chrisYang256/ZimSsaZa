import { ApiProperty } from "@nestjs/swagger";
import { GetContractResultsRespnseDto } from "./getContractResults.respnse.dto";

export class GetContractRespnseDto {
    @ApiProperty({ description: '요청 결과', type: GetContractResultsRespnseDto,
    })
    results: GetContractResultsRespnseDto;
}
