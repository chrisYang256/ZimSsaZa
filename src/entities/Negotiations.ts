import { 
    Index, 
    Entity, 
    Column, 
    ManyToOne, 
    JoinColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { BusinessPersons } from "./BusinessPersons";
import { Movements } from "./Movements";

@Index('BusinessPersonId', ['BusinessPersonId'], {})
@Entity({ schema: 'ZimSsaZa', name: 'negotiations' })
export class Negotiations {

    @ApiProperty({ example: 3, description: 'negotiations PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: '300000', description: '이사 비용 견적'})
    @Column('int', { name: 'cost', width: 10, nullable: true })
    cost: Number | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('int', { name: 'MovementId'})
    MovementId: Number;

    @Column('int', { name: 'BusinessPersonId'})
    BusinessPersonId: Number;

    @ManyToOne(() => Movements, movements => movements.Negotiations, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'MovementId', referencedColumnName: 'id' }])
    Movement: Movements;

    @ManyToOne(() => BusinessPersons, businessperson => businessperson.Negotiation, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'BusinessPersonId', referencedColumnName: 'id' }])
    BusinessPerson: BusinessPersons;
}