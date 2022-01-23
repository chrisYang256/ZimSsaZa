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
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Reviews } from "./Reviews";
import { MovingInformations } from "./MovingInformations";
import { SystemMessages } from "./SystemMessages";

@Index('email', ['email'], { unique: true })
@Entity({ schema: 'ZimSsaZa', name: 'users' })
export class Users {

    @ApiProperty({ example: 3, description: 'users PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'ssazim@google.com', description: '회원 이메일'})
    @Column('varchar', { name: 'email', unique: true, length: 30 })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '브래드 피트', description: '회원 이름'})
    @Column('varchar', { name: 'name', length: 10 })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '010-0000-0000', description: '회원 휴대폰 번호(010-숫자 3~4자리-숫자 4자리)'})
    @Column('varchar', { name: 'phone_number', length: 15 })
    phone_number: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '1234abcd!', description: '회원 비밀번호(알파벳+숫자+특수문자 8~15자리)'})
    @Column('varchar', { name: 'password', length: 100, select: false })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => MovingInformations, movinginformations => movinginformations.User)
    MovingInformations: MovingInformations[]; 

    @OneToMany(() => SystemMessages, systemMessages => systemMessages.User)
    SystemMessages: SystemMessages[];

    @OneToMany(() => Reviews, reviews => reviews.User)
    Reviews: Reviews[];
}