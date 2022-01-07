import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Movements } from "./Movements";

// @Index('', [''], {})
@Entity({ schema: 'ZimSsaZa', name: 'move_statuses' })
export class MoveStatuses {

    @ApiProperty({ example: 3, description: 'move_statuses PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'nego', description: ''})
    @Column('enum', { name: 'status', enum: ['stay', 'nego', 'done']  })
    status: 'stay' | 'nego' | 'done';

    @OneToMany(() => Movements, movements => movements.MoveStatus)
    Movement: Movements[];
}