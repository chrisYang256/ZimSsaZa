import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, Index, IsNull, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LoadInformations } from "./LoadInformations";

// @Index('', [''], {})
@Entity({ schema: 'ZimSsaZa', name: 'load_mages' })
export class LoadImages {

    @ApiProperty({ example: 2, description: 'load_mages PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsString()
    @ApiProperty({ example: 'file-uploads/IMG_67781641020424734.jpeg', description: '이미지 주소'})
    @Column('varchar', { name: 'img_path', length: 200, nullable: true })
    img_path: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => LoadInformations, loadinformations => loadinformations.LoadImags, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'LoadInformationId', referencedColumnName: 'id' }])
    LoadInformation: LoadInformations;
}