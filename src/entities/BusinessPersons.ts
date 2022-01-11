import { 
    Index, 
    Entity, 
    Column, 
    OneToMany, 
    CreateDateColumn, 
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { AreaCodes } from "./AreaCodes";
import { Negotiations } from "./Negotiations";
import { Reviews } from "./Reviews";

@Index('email', ['email'], { unique: true })
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
    @ApiProperty({ example: '010-0000-0000(010-숫자 3~4자리-숫자 4자리)', description: '사업자 휴대폰 번호'})
    @Column('varchar', { name: 'phone_number', length: 15 })
    phone_number: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '1234abcd!(알파벳+숫자+특수문자 8~15자리)', description: '사업자 비밀번호'})
    @Column('varchar', { name: 'password', length: 100, select: false })
    password: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '123-45-67890', description: '사업자 번호'})
    @Column('varchar', { name: 'business_license', length: 20, select: false })
    business_license: string;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: 'move_status done이 되면 자동으로 +1', description: '이사 완료 건수'})
    @Column('int', { name: 'finish_count', default: 0 })
    finish_count: Number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Negotiations, negotiations => negotiations.BusinessPerson)
    Negotiation: Negotiations[];

    @OneToMany(() => AreaCodes, areacodes => areacodes.BusinessPerson)
    AreaCodes: AreaCodes[];

    @OneToMany(() => Reviews, reviews => reviews.BusinessPerson)
    Reviews: Reviews[];
}