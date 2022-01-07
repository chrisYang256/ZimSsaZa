import { 
    Entity, 
    Column, 
    OneToMany, 
    PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Movements } from "./Movements";
import { MoveStatusEnum } from "src/common/moveStatus.enum";

@Entity({ schema: 'ZimSsaZa', name: 'move_statuses' })
export class MoveStatuses {

    @ApiProperty({ example: 3, description: 'move_statuses PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'nego', description: ''})
    @Column('enum', { name: 'status', enum: ['stay', 'nego', 'done']  })
    status: MoveStatusEnum;

    @OneToMany(() => Movements, movements => movements.MoveStatus)
    Movement: Movements[];
}