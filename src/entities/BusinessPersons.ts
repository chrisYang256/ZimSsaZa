import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, Index, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AreaCodes } from "./AreaCodes";
import { Negotiations } from "./Negotiations";
import { Reviews } from "./Reviews";

// @Index('', [''], {})
@Entity({ schema: 'ZimSsaZa', name: 'business_persons' })
export class BusinessPersons {

    @ApiProperty({ example: 3, description: 'users PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'ssazim@google.com', description: '사업자 이메일'})
    @Column('varchar', { name: 'email', unique: true, length: 30 })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '로다주', description: '사업자 이름'})
    @Column('varchar', { name: 'name', length: 10 })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '010-(3~4자리)-(4자리)', description: '사업자 휴대폰 번호'})
    @Column('varchar', { name: 'phone_number', length: 15 })
    phone_number: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '알파벳+숫자+특수문자 8~15자리', description: '사업자 비밀번호'})
    @Column('varchar', { name: 'password', length: 100, select: false })
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '123-45-67890', description: '사업자 번호'})
    @Column('varchar', { name: 'business_license', length: 20, select: false })
    business_license: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 'move_status done이 되면 자동으로 +1', description: '회원 비밀번호'})
    @Column('int', { name: 'finish_count', default: 0 })
    finish_count: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Negotiations, negotiations => negotiations.BusinessPerson)
    Negotiation: Negotiations[];

    @OneToMany(() => AreaCodes, areacodes => areacodes.BusinessPerson)
    @JoinColumn([{ name: 'AreaCodeId', referencedColumnName: 'id' }])
    AreaCodes: AreaCodes[];

    @OneToMany(() => Reviews, reviews => reviews.BusinessPerson)
    Reviews: Reviews[];
}