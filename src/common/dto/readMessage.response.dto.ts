import { ApiProperty } from "@nestjs/swagger"
import { MessageWithContentAndCreatedAtDto } from "./readMessageWithContentAndCreatedAt.dto";

export class ReadMessageResponseDto {
    @ApiProperty({ description: '받은 메시지들', type: [MessageWithContentAndCreatedAtDto],
    })
    messages: MessageWithContentAndCreatedAtDto;
}