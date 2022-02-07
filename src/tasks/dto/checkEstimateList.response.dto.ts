import { ApiProperty } from '@nestjs/swagger';

export class CheckEstimateListResponseDto {
  @ApiProperty({
    example: [
      {
        id: 10,
        cost: 230000,
        BusinessPerson: {
          id: 5,
          name: '기사님5',
          finish_count: 10,
          Reviews: [],
          starsAvg: 0,
        },
        MovingInformation: {
          id: 5,
        },
      },
      {
        id: 14,
        cost: 240000,
        BusinessPerson: {
          id: 9,
          name: '기사님9',
          finish_count: 10,
          Reviews: [],
          starsAvg: 0,
        },
        MovingInformation: {
          id: 5,
        },
      },
      {
        id: 9,
        cost: 290000,
        BusinessPerson: {
          id: 4,
          name: '기사님4',
          finish_count: 10,
          Reviews: [],
          starsAvg: 0,
        },
        MovingInformation: {
          id: 5,
        },
      },
      {
        id: 11,
        cost: 310000,
        BusinessPerson: {
          id: 6,
          name: '기사님6',
          finish_count: 10,
          Reviews: [],
          starsAvg: 0,
        },
        MovingInformation: {
          id: 5,
        },
      },
      {
        id: 8,
        cost: 340000,
        BusinessPerson: {
          id: 3,
          name: '기사님3',
          finish_count: 10,
          Reviews: [],
          starsAvg: 0,
        },
        MovingInformation: {
          id: 5,
        },
      },
    ],
    description: '상태 메시지',
  })
  estimateListmessage: Array<any>;

  @ApiProperty({ example: 200, description: '상태 코드' })
  status: number;
}
