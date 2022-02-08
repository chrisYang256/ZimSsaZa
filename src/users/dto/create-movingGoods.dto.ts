import { ApiProperty, PickType } from '@nestjs/swagger';
import { MovingInformations } from 'src/entities/MovingInformations';

export class CreateMovingGoodsDto extends PickType(MovingInformations, [
  'start_point',
  'destination',
  'move_date',
  'move_time',
] as const) {
  @ApiProperty({ example: 2, description: '침대 갯수' })
  bed: number;

  @ApiProperty({ example: 2, description: '옷장 갯수' })
  closet: number;

  @ApiProperty({ example: 2, description: '수납장 갯수' })
  storage_closet: number;

  @ApiProperty({ example: 2, description: '테이블 갯수' })
  table: number;

  @ApiProperty({ example: 2, description: '소파 갯수' })
  sofa: number;

  @ApiProperty({
    example: 1,
    description: '우체국 5호 사이즈 이삿짐 박스 갯수',
  })
  box: number;

  @ApiProperty({ example: 1, description: '이사 지역 번호' })
  code: number;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } }) // m/f-d
  img_path: Array<any>;
}
