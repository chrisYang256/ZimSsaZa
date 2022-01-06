import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// @Index('', [''], {})
@Entity({ schema: 'ZimSsaZa', name: 'negotiation_tables' })
export class NegotiationTables {

    @ApiProperty({ example: 3, description: 'negotiation_tables PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: '300000', description: '이사 비용 견적'})
    @Column('int', { name: 'cost', width: 10 })
    cost: Number;

    @CreateDateColumn()
    createdAt: Date;
}