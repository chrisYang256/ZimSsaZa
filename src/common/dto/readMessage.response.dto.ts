import { ApiProperty } from '@nestjs/swagger';

export class ReadMessageResponseDto {
  @ApiProperty({
    example: [
      {
        message:
          '상대방이 이사완료 확인을 하셨습니다! 완료가 되셨다면 확인을 눌러 이사를 완료해 주세요💕',
        createdAt: '2022-02-06T11:50:38.232Z',
      },
      {
        message:
          '상대방이 이사완료 확인을 하셨습니다! 완료가 되셨다면 확인을 눌러 이사를 완료해 주세요💕',
        createdAt: '2022-02-07T11:00:11.548Z',
      },
    ],
    description: '받은 메시지들',
  })
  messages: any;

  @ApiProperty({
    example: '200(page > 1) | 201(page === 1)',
    description: '상태 코드',
  })
  status: number;
}
