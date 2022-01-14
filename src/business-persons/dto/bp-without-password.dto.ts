import { ApiProperty, PickType } from "@nestjs/swagger";
import { BusinessPersons } from "src/entities/BusinessPersons";

export class BPWithoutPasswordDto extends PickType(BusinessPersons, [
    'id', 
    'name', 
    'email', 
    'phone_number',
    'business_license',
    'finish_count',
] as const) {

    @ApiProperty({ example: '1 | [1, 2, 3]', description: '이사 지역 코드'})
    AreaCodes: Array<number>;
}