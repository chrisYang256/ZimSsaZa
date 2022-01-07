import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BusinessPersons } from "./BusinessPersons";
import { Movements } from "./Movements";

// @Index('', [''], {})
@Entity({ schema: 'ZimSsaZa', name: 'area_codes' })
export class AreaCodes {

    @ApiProperty({ example: 3, description: 'area_codes PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: '1', description: '이사 지역 번호'})
    @Column('int', { name: 'area_name', width: 10 })
    code: Number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => Movements, movements => movements.AreaCode, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'MovementId', referencedColumnName: 'id' }])
    Movement: Movements;

    @ManyToOne(() => BusinessPersons, businessperson => businessperson.AreaCodes, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'BusinessPersonId', referencedColumnName: 'id' }])
    BusinessPerson: BusinessPersons;
}