import { ApiProperty, PickType } from '@nestjs/swagger';
import { BusinessPersons } from 'src/entities/BusinessPersons';

export class BusinessPersonWithoutPasswordDto extends PickType(
  BusinessPersons,
  [
    'id',
    'name',
    'email',
    'phone_number',
    'business_license',
    'finish_count',
  ] as const,
) {
  @ApiProperty({
    example: '[{ code: 1 }, { code: 2 }]',
    description: '이사 지역 코드',
  })
  AreaCodes: Array<object>;
}
