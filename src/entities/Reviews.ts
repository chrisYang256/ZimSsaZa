import {
  Index,
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './Users';
import { ApiProperty } from '@nestjs/swagger';
import { BusinessPersons } from './BusinessPersons';
import { IsNotEmpty, IsString } from 'class-validator';

@Index('UserId', ['UserId'], {})
@Index('BusinessPersonId', ['BusinessPersonId'], {})
@Entity({ schema: 'ZimSsaZa', name: 'reviews' })
export class Reviews {
  @ApiProperty({ example: 3, description: 'reviews PK' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '김치킨', description: '작성자 이름' })
  @Column('varchar', { name: 'writer' })
  writer: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '너무 친절하신 기사님이에요!',
    description: '유저 리뷰',
  })
  @Column('text', { name: 'content' })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '5', description: '평점' })
  @Column('int', { name: 'star', width: 5 })
  star: number;

  @Column('int', { name: 'moving_information_id', nullable: true })
  moving_information_id: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('int', { name: 'UserId', nullable: true })
  UserId: number | null; // onDelete: 'SET NULL'

  @Column('int', { name: 'BusinessPersonId' })
  BusinessPersonId: number;

  @ManyToOne(() => Users, (users) => users.Reviews, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;

  @ManyToOne(
    () => BusinessPersons,
    (businesspersons) => businesspersons.Reviews,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'BusinessPersonId', referencedColumnName: 'id' }])
  BusinessPerson: BusinessPersons;
  length: number;
}
