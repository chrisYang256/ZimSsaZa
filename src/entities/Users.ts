import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Index('email', ['email'], { unique: true })
@Entity({ schema: 'ZimSsaZa', name: 'users' })
export class Users {

    @ApiProperty({ example: 3, description: '회원 id'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id'})
    id: number;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'ssazim@google.com', description: '회원 이메일'})
    @Column('varchar', { name: 'email', unique: true, length: 30 })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '로다주', description: '회원 이름'})
    @Column('varchar', { name: 'name', length: 10 })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '(3자리)-(3~4자리)-(4자리)', description: '회원 휴대폰 번호'})
    @Column('varchar', { name: 'phone_number', length: 15 })
    phone_number: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '알파벳+숫자+특수문자 8자리 이상', description: '회원 비밀번호'})
    @Column('varchar', { name: 'password', length: 100, select: false })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}