import { 
    Index, 
    Entity, 
    Column, 
    OneToOne, 
    OneToMany, 
    JoinColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
import { LoadImages } from "./LoadImages";
import { MovingInformations } from "./MovingInformations";

@Index('MovingInformationId', ['MovingInformationId'], {})
@Entity({ schema: 'ZimSsaZa', name: 'moving_goods' })
export class MovingGoods {

    @ApiProperty({ example: 3, description: 'load_informations PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsNumber()
    @ApiProperty({ example: '2', description: '침대 갯수'})
    @Column('int', { name: 'bed', width: 5, default: 0 })
    bed: number;

    @IsNumber()
    @ApiProperty({ example: '2', description: '옷장 갯수'})
    @Column('int', { name: 'closet', width: 5, default: 0 })
    closet: number;

    @IsNumber()
    @ApiProperty({ example: '2', description: '수납장 갯수'})
    @Column('int', { name: 'storage_closet', width: 5, default: 0 })
    storage_closet: number;

    @IsNumber()
    @ApiProperty({ example: '2', description: '테이블 갯수'})
    @Column('int', { name: 'table', width: 5, default: 0 })
    table: number;

    @IsNumber()
    @ApiProperty({ example: '2', description: '소파 갯수'})
    @Column('int', { name: 'sofa', width: 5, default: 0 })
    sofa: number;

    @IsNumber()
    @ApiProperty({ example: '1', description: '우체국 5호 사이즈 이삿짐 박스 갯수'})
    @Column('int', { name: 'box', width: 5, default: 0 })
    box: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('int', { name: 'MovingInformationId'})
    MovingInformationId: number;

    @OneToOne(() => MovingInformations, movinginformations => movinginformations.MovingGoods, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'MovingInformationId', referencedColumnName: 'id' })
    MovingInformation: MovingInformations;

    @OneToMany(() => LoadImages, loadimages => loadimages.MovingGoods)
    LoadImags: LoadImages[];
}