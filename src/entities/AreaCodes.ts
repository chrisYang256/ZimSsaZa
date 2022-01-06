import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    area_name: Number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}