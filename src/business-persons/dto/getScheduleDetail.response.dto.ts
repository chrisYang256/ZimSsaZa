import { ApiProperty } from "@nestjs/swagger";

export class GetScheduleDetailResponseDto {
  @ApiProperty({ 
    example: {
      "start_point": "서울 특별시 중구",
      "destination": "서울 특별시 동작구",
      "move_date": "2021-12-30",
      "move_time": "13:30",
      "user_done": 0,
      "business_person_done": 0,
      "MovingGoods": {
        "bed": 2,
        "closet": 1,
        "storage_closet": 1,
        "table": 2,
        "sofa": 1,
        "box": 10,
        "LoadImages": [
          {
            "img_path": "img-uploads/screenshot 2022-01-20 오후 5.33.571643022329063_load.png"
          },
          {
            "img_path": "img-uploads/screenshot 2022-01-17 오후 2.17.441643022329066_load.png"
          }
        ]
      },
      "Negotiations": [
        {
          "cost": 200000
        }
      ],
      "User": {
        "name": "브래드 피트",
        "phone_number": "010-1234-5678"
      }
    },
    description: '조회 결과',
  })
  movingInfo: object;

  @ApiProperty({ example: '200', description: '상태 코드',
  })
  status: number;
}