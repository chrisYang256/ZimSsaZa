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
import { LoadInformations } from "./LoadInformations";

@Index('LoadInformationId', ['LoadInformationId'], {})
@Entity({ schema: 'ZimSsaZa', name: 'load_mages' })
export class LoadImages {

    @ApiProperty({ example: 2, description: 'load_mages PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsString()
    @ApiProperty({ example: 'file-uploads/IMG_67781641020424734.jpeg', description: '이미지 주소'})
    @Column('varchar', { name: 'img_path', length: 200})
    img_path: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('int', { name: 'LoadInformationId'})
    LoadInformationId: Number;

    @ManyToOne(() => LoadInformations, loadinformations => loadinformations.LoadImags, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'LoadInformationId', referencedColumnName: 'id' }])
    LoadInformation: LoadInformations;
}