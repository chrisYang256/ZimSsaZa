import { ApiProperty } from "@nestjs/swagger";

export class NegoCostDto {

    @ApiProperty({ example: '200000', description: '이사 견적 금액'})
    cost: number;
}