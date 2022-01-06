import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// @Index('', [''], {})
@Entity({ schema: 'ZimSsaZa', name: 'reviews' })
export class Reviews {

    @ApiProperty({ example: 3, description: 'reviews PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '너무 친절하신 기사님이에요!', description: '유저 리뷰'})
    @Column('text', { name: 'content' })
    content: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '', description: ''})
    @Column('int', { name: 'star', width: 5 })
    star: Number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}