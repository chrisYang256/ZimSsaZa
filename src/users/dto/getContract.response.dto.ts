import { ApiProperty } from '@nestjs/swagger';

export class GetContractRespnseDto {
  @ApiProperty({
    example: {
      start_point: '서울 특별시 중구',
      destination: '서울 특별시 동작구',
      move_date: '2021-12-30',
      move_time: '13:30',
      starsAvg: 3.7,
      cost: 200000,
      BusinessPerson: {
        id: 10,
        name: '정의의 기사님',
        phone_number: '010-9876-5432',
        Reviews: [
          {
            writer: '박효신1',
            content: '정말 좋으신 기사님!!',
            star: 5,
          },
          {
            writer: '박효신2',
            content: '덕분에 이사 잘 마무리했슴다^^',
            star: 4,
          },
          {
            writer: '박효신3',
            content: '리뷰 보고 기대했는데..안좋은 일 있으셨나봐요..',
            star: 2,
          },
        ],
      },
    },
    description: '요청 결과',
  })
  results: any;

  @ApiProperty({ example: '200', description: '상태 코드' })
  status: number;
}
