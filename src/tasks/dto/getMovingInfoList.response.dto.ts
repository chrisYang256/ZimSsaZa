import { ApiProperty } from '@nestjs/swagger';

export class GetMovingInfoListResponseDto {
  @ApiProperty({
    example: [
      {
        id: 5,
        start_point: '서울 특별시 중구',
        destination: '서울 특별시 동작구',
        createdAt: '2022-02-07T06:36:52.309Z',
      },
      {
        id: 9,
        start_point: '서울 특별시 영등포구',
        destination: '서울 특별시 용산구',
        createdAt: '2022-02-09T06:36:52.309Z',
      },
      {
        id: 39,
        start_point: '서울 특별시 동작구',
        destination: '서울 특별시 용산구',
        createdAt: '2022-02-10T06:36:52.309Z',
      },
    ],
    description: '요청 결과',
  })
  movingInfoList: any;

  @ApiProperty({ example: 200, description: '상태 코드' })
  status: number;
}
