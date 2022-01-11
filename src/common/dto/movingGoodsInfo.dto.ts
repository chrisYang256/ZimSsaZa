import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { MovingInformations } from "src/entities/MovingInformations";
import { Column } from "typeorm";
import { MoveStatusEnum } from "../moveStatus.enum";

export class MovingGoodsInfoDto extends PickType(MovingInformations, [
    'start_point',
    'destination',
    'move_date',
    'move_time',
] as const) {

    @IsNumber()
    @ApiProperty({ example: '2', description: '침대 갯수'})
    @Column('int', { name: 'bed', width: 5, default: 0 })
    bed: Number;

    @IsNumber()
    @ApiProperty({ example: '2', description: '옷장 갯수'})
    @Column('int', { name: 'closet', width: 5, default: 0 })
    closet: Number;

    @IsNumber()
    @ApiProperty({ example: '2', description: '수납장 갯수'})
    @Column('int', { name: 'storage_closet', width: 5, default: 0 })
    storage_closet: Number;

    @IsNumber()
    @ApiProperty({ example: '2', description: '테이블 갯수'})
    @Column('int', { name: 'table', width: 5, default: 0 })
    table: Number;

    @IsNumber()
    @ApiProperty({ example: '2', description: '소파 갯수'})
    @Column('int', { name: 'sofa', width: 5, default: 0 })
    sofa: Number;

    @IsNumber()
    @ApiProperty({ example: '1', description: '우체국 5호 사이즈 이삿짐 박스 갯수'})
    @Column('int', { name: 'box', width: 5, default: 0 })
    box: Number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'nego', description: ''})
    @Column('enum', { name: 'status', enum: ['stay', 'nego', 'done']  })
    status: MoveStatusEnum;
    
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: '1', description: '이사 지역 번호'})
    @Column('int', { name: 'code', width: 10 })
    code: Number;
}