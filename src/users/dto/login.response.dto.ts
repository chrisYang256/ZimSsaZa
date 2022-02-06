import { ApiProperty } from "@nestjs/swagger"

export class LoginResponseDto {
    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjQ0MTQ0NDc0LCJleHAiOjE2NzU2ODA0NzR9.Oai4BbaCq_J6EMmbTq4GnKGzZwbq0WPGn_TTHErS1TY', description: '발생 시점',
    })
    access_token: string;
}