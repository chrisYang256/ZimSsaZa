import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BusinessPersons } from "./BusinessPersons";
import { Users } from "./Users";

@Entity({ schema: 'ZimSsaZa', name: 'system_messages' })
export class SystemMessages {

    @ApiProperty({ example: 3, description: 'system_messages PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '견적 요청이 완료되었습니다!', description: '진행사항 관련 메시지'})
    @Column('varchar', { name: 'message', length: 100 })
    message: string;

    @CreateDateColumn()
    CreatedAt: Date;

    @Column('int', { name: 'UserId', nullable: true })
    UserId: number | null;

    @Column('int', { name: 'BusinessPersonId', nullable: true })
    BusinessPersonId: number | null;

    @ManyToOne(() => Users, users => users.SystemMessages, {
        onDelete: 'CASCADE'
    })
    @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
    User: Users;

    @ManyToOne(() => BusinessPersons, businessPersons => businessPersons.SystemMessages, {
        onDelete: 'CASCADE'
    })
    @JoinColumn([{ name: 'BusinessPersonId', referencedColumnName: 'id' }])
    BusinessPerson: BusinessPersons;
}