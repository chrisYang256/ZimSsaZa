import { 
    Index, 
    Entity, 
    Column, 
    OneToOne, 
    ManyToOne, 
    OneToMany, 
    JoinColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Negotiations } from "./Negotiations";
import { Users } from "./Users";
import { AreaCodes } from "./AreaCodes";
import { MovingStatuses } from "./MovingStatuses";
import { MovingGoods } from "./MovingGoods";

@Index('UserId', ['UserId'], {})
@Entity({ schema: 'ZimSsaZa', name: 'moving_informations' })
export class MovingInformations {

    @ApiProperty({ example: 3, description: 'movements PK'})
    @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
    id: number;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '서울 특별시 중구', description: '출발지'})
    @Column('varchar', { name: 'start_point', length: 50 })
    start_point: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '서울 특별시 동작구', description: '목적지'})
    @Column('varchar', { name: 'destination', length: 50 })
    destination: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({ example: '2021-12-30', description: '이사 날짜'})
    @Column('date', { name: 'move_date'})
    move_date: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '15:30', description: '이사 시간'})
    @Column('varchar', { name: 'move_time', length: 5 })
    move_time: string;

    @IsNumber()
    @ApiProperty({ example: '5', description: '유저에게 선택된 기사님 id'})
    @Column('int', { name: 'picked_business_person', nullable: true })
    picked_business_person: number | null;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: '1', description: '유저 이사완료 확인 여부'})
    @Column('tinyint', { name: 'user_done', width: 1, default: () => "'0'" })
    user_done: boolean;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ example: '1', description: '기사님 이사완료 확인 여부'})
    @Column('tinyint', { name: 'business_person_done', width: 1, default: () => "'0'" })
    business_person_done: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('int', { name: 'UserId'})
    UserId: number;

    @Column('int', { name: 'MovingStatusId'})
    MovingStatusId: number;

    @OneToOne(() => MovingGoods, movinggoods => movinggoods.MovingInformation)
    MovingGoods: MovingGoods;

    @OneToOne(() => AreaCodes, areacodes => areacodes.MovingInformation)
    AreaCode: AreaCodes;

    @OneToMany(() => Negotiations, negotiations => negotiations.MovingInformation)
    Negotiations: Negotiations[];

    @ManyToOne(() => Users, users => users.MovingInformations, { 
        onUpdate: 'CASCADE', 
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
    User: Users;

    @ManyToOne(() => MovingStatuses, movingstatuses => movingstatuses.MovingInformations, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'MovingStatusId', referencedColumnName: 'id' }])
    MovingStatus: MovingStatuses;
}