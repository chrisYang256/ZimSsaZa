import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { BusinessPersons } from "./BusinessPersons";
import { Movements } from "./Movements";

// @Index('', [''], {})
@Entity({ schema: 'ZimSsaZa', name: 'negotiations' })
export class Negotiations {

    @ApiProperty({ example: 3, description: 'negotiations PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: '300000', description: '이사 비용 견적'})
    @Column('int', { name: 'cost', width: 10 })
    cost: Number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Movements, movements => movements.Negotiations)
    @JoinColumn([{ name: 'NegotiationId', referencedColumnName: 'id' }])
    Movement: Movements;

    @ManyToOne(() => BusinessPersons, businessperson => businessperson.Negotiation, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'BusinessPersonId', referencedColumnName: 'id' }])
    BusinessPerson: BusinessPersons;
}