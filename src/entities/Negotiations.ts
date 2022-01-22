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
import { MovingInformations } from "./MovingInformations";

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
    cost: number | null;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: '1', description: '견적받기 시간제한 도달 여부'})
    @Column('tinyint', { name: 'timeout', width: 1, default: () => "'0'" })
    timeout: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('int', { name: 'MovingInformationId'})
    MovingInformationId: number;

    @Column('int', { name: 'BusinessPersonId', nullable: true })
    BusinessPersonId: number | null;

    @ManyToOne(() => MovingInformations, moveinformations => moveinformations.Negotiations, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'MovingInformationId', referencedColumnName: 'id' }])
    MovingInformation: MovingInformations;

    @ManyToOne(() => BusinessPersons, businesspersons => businesspersons.Negotiation, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'BusinessPersonId', referencedColumnName: 'id' }])
    BusinessPerson: BusinessPersons;
}