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
import { MovingInformations } from "./MovingInformations";

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

    @Column('int', { name: 'MovingInformationId', nullable: true })
    MovingInformationId: Number | null;

    @OneToOne(() => MovingInformations, movingformations => movingformations.AreaCode, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'MovingInformationId', referencedColumnName: 'id' }])
    MovingInformation: MovingInformations;

    @ManyToOne(() => BusinessPersons, businesspersons => businesspersons.AreaCodes, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'BusinessPersonId', referencedColumnName: 'id' }])
    BusinessPerson: BusinessPersons;
}