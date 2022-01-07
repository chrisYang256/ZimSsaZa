import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LoadImages } from "./LoadImages";
import { Movements } from "./Movements";

// @Index('', [''], {})
@Entity({ schema: 'ZimSsaZa', name: 'load_informations' })
export class LoadInformations {

    @ApiProperty({ example: 3, description: 'load_informations PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: Number;

    @IsNumber()
    @ApiProperty({ example: '2', description: '침대 갯수'})
    @Column('int', { name: 'bed', width: 5, default: 0 })
    bed: Number;

    @IsNumber()
    @ApiProperty({ example: '2', description: '옷장 갯수'})
    @Column('int', { name: 'closet', width: 5, default: 0 })
    closet: Number;

    @IsNumber()
    @ApiProperty({ example: '2', description: '수납장 갯수'})
    @Column('int', { name: 'storage_closet', width: 5, default: 0 })
    storage_closet: Number;

    @IsNumber()
    @ApiProperty({ example: '2', description: '테이블 갯수'})
    @Column('int', { name: 'table', width: 5, default: 0 })
    table: Number;

    @IsNumber()
    @ApiProperty({ example: '2', description: '소파 갯수'})
    @Column('int', { name: 'sofa', width: 5, default: 0 })
    sofa: Number;

    @IsNumber()
    @ApiProperty({ example: '1', description: '우체국 5호 사이즈 이삿짐 박스 갯수'})
    @Column('int', { name: 'box', width: 5, default: 0 })
    box: Number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => LoadInformations, loadinformations => loadinformations.Movement, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'MovementId', referencedColumnName: 'id' })
    Movement: Movements;

    @OneToMany(() => LoadImages, loadimages => loadimages.LoadInformation)
    LoadImags: LoadImages[];
}