import { 
    Index, 
    Entity, 
    Column, 
    OneToOne, 
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
@Entity({ schema: 'ZimSsaZa', name: 'area_codes' })
export class AreaCodes {

    @ApiProperty({ example: 3, description: 'area_codes PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: '1', description: '이사 지역 번호'})
    @Column('int', { name: 'code', width: 10 })
    code: Number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('int', { name: 'BusinessPersonId', nullable: true })
    BusinessPersonId: Number | null;

    @Column('int', { name: 'MovementId', nullable: true })
    MovementId: Number | null;

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