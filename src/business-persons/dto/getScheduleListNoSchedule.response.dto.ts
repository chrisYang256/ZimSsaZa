import { ApiProperty } from "@nestjs/swagger";

export class GetScheduleListNoScheduleResponseDto {
  @ApiProperty({ example: '200', description: '상태 코드',
  })
  status: number;

  @ApiProperty({ example: '예약중인 일정이 없습니다.', description: '상태 메시지',
  })
  message: string;
}