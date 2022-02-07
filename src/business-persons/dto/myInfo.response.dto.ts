import { ApiProperty } from "@nestjs/swagger";

export class MyInfoResponseDto {
    @ApiProperty({ 
      example: {
          "id": 10,
          "email": "zimssaza@gmail.com",
          "name": "정의의 기사님",
          "phone_number": "010-9876-5432",
          "business_license": "123-45-67890",
          "finish_count": 4,
          "createdAt": "2022-02-06T11:31:23.110Z",
          "updatedAt": "2022-02-06T11:31:23.110Z",
          "AreaCodes": [
            {
              "code": 1
            },
            {
              "code": 3
            },
            {
              "code": 5
            }
          ],
          "myReviews": [
            {
              "writer": "박효신1",
              "content": "정말 좋으신 기사님!!",
              "star": 5
            },
            {
              "writer": "박효신2",
              "content": "덕분에 이사 잘 마무리했슴다^^",
              "star": 4
            },
            {
              "writer": "박효신3",
              "content": "리뷰 보고 기대했는데..안좋은 일 있으셨나봐요..",
              "star": 2
            }
          ],
          "starsAvg": 3.7,
          "finishMovingList": [
            {
              "start_point": "서울 특별시 동대문구0",
              "destination": "서울 특별시 서대문구0",
              "move_date": "2021-12-10",
              "Negotiations": [
                {
                  "cost": 140000
                }
              ]
            },
            {
              "start_point": "서울 특별시 동대문구1",
              "destination": "서울 특별시 서대문구1",
              "move_date": "2021-12-11",
              "Negotiations": [
                {
                  "cost": 580000
                }
              ]
            },
            {
              "start_point": "서울 특별시 동대문구2",
              "destination": "서울 특별시 서대문구2",
              "move_date": "2021-12-12",
              "Negotiations": [
                {
                  "cost": 150000
                }
              ]
            },
            {
              "start_point": "서울 특별시 동대문구3",
              "destination": "서울 특별시 서대문구3",
              "move_date": "2021-12-13",
              "Negotiations": [
                {
                  "cost": 540000
                }
              ]
            }
          ]
      }, 
      description: '조회 결과',
    })
    myInfo: Object;

    @ApiProperty({ example: 200, description: '상태 코드',
    })
    status: number;
}