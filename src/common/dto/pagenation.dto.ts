import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class PagenationDto {

    @ApiProperty({ example: 20, description: '페이지네이션 limit(보여지는 게시물 수)'})
    perPage: number;

    @ApiProperty({ example: 1, description: '페이지네이션 offset(perPage * (page - 1)'})
    page: number;
}