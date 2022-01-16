import { ApiProperty } from "@nestjs/swagger";

export class NegoCostDto {

    @ApiProperty({ example: '300000', description: '이사 견적 금액'})
    cost: number;
}