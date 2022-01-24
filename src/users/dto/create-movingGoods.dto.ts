import { ApiProperty, PickType } from "@nestjs/swagger";
import { MovingInformations } from "src/entities/MovingInformations";

export class CreateMovingGoodsDto extends PickType(MovingInformations, [
    'start_point',
    'destination',
    'move_date',
    'move_time',
] as const) {

    @ApiProperty({ example: '2', description: '침대 갯수'})
    bed: Number;

    @ApiProperty({ example: '2', description: '옷장 갯수'})
    closet: Number;

    @ApiProperty({ example: '2', description: '수납장 갯수'})
    storage_closet: Number;

    @ApiProperty({ example: '2', description: '테이블 갯수'})
    table: Number;

    @ApiProperty({ example: '2', description: '소파 갯수'})
    sofa: Number;

    @ApiProperty({ example: '1', description: '우체국 5호 사이즈 이삿짐 박스 갯수'})
    box: Number;
    
    @ApiProperty({ example: '1', description: '이사 지역 번호'})
    code: Number;

    @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })  // m/f-d
    img_path: Array<any>;
}