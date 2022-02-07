import { ApiProperty } from '@nestjs/swagger';

export class GetScheduleListResponseDto {
  @ApiProperty({
    example: [
      {
        id: 5,
        start_point: '서울 특별시 중구',
        destination: '서울 특별시 동작구',
        move_date: '2021-12-30',
        move_time: '13:30',
      },
      {
        id: 12,
        start_point: '서울 특별시 서대문구',
        destination: '서울 특별시 강북구',
        move_date: '2022-1-10',
        move_time: '11:00',
      },
    ],
    description: '조회 결과',
  })
  schedules: Array<object>;

  @ApiProperty({ example: '200', description: '상태 코드' })
  status: number;
}
