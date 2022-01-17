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
import { IsString } from "class-validator";
import { MovingGoods } from "./MovingGoods";

@Index('MovingGoodsId', ['MovingGoodsId'], {})
@Entity({ schema: 'ZimSsaZa', name: 'load_images' })
export class LoadImages {

    @ApiProperty({ example: 2, description: 'load_mages PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsString()
    @ApiProperty({ example: 'file-uploads/IMG_67781641020424734.jpeg', description: '이미지 주소'})
    @Column('varchar', { name: 'img_path', length: 200, nullable: true})
    img_path: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('int', { name: 'MovingGoodsId'})
    MovingGoodsId: number;

    @ManyToOne(() => MovingGoods, movinggoods => movinggoods.LoadImags, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'MovingGoodsId', referencedColumnName: 'id' }])
    MovingGoods: MovingGoods;
}