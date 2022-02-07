import { ApiProperty } from '@nestjs/swagger';
import { number } from 'joi';

export class GetMovingInfoDetailResponseDto {
  @ApiProperty({
    example: {
      id: 5,
      start_point: '서울 특별시 중구',
      destination: '서울 특별시 동작구',
      move_date: '2021-12-30',
      move_time: '13:30',
      createdAt: '2022-02-07T06:36:52.309Z',
      AreaCode: {
        code: 1,
      },
      MovingGoods: {
        bed: 2,
        closet: 1,
        storage_closet: 1,
        table: 2,
        sofa: 1,
        box: 10,
        LoadImages: [
          {
            img_path:
              'img-uploads/screenshot 2022-01-20 오후 5.33.571643022329063_load.png',
          },
          {
            img_path:
              'img-uploads/screenshot 2022-01-17 오후 2.17.441643022329066_load.png',
          },
        ],
      },
    },
    description: '요청 결과',
  })
  results: any;

  @ApiProperty({ example: 200, description: '상태 코드' })
  status: number;
}
