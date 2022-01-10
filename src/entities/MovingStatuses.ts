import { 
    Entity, 
    Column, 
    OneToMany, 
    PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { MoveStatusEnum } from "src/common/moveStatus.enum";
import { MovingInformations } from "./MovingInformations";

@Entity({ schema: 'ZimSsaZa', name: 'moving_statuses' })
export class MovingStatuses {

    @ApiProperty({ example: 3, description: 'move_statuses PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'nego', description: ''})
    @Column('enum', { name: 'status', enum: ['stay', 'nego', 'done']  })
    status: MoveStatusEnum;

    @OneToMany(() => MovingInformations, movinginformations => movinginformations.MovingStatus)
    MovingInformations: MovingInformations[];
}