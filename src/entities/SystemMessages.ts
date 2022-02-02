import {
  Column,
  Entity,
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

@Entity({ schema: 'ZimSsaZa', name: 'system_messages' })
export class SystemMessages {
  @ApiProperty({ example: 3, description: 'system_messages PK' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '견적 요청이 완료되었습니다!',
    description: '진행사항 관련 메시지',
  })
  @Column('varchar', { name: 'message', length: 100 })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('int', { name: 'UserId', nullable: true })
  UserId: number | null;

  @Column('int', { name: 'BusinessPersonId', nullable: true })
  BusinessPersonId: number | null;

  @ManyToOne(() => Users, (users) => users.SystemMessages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([{ name: 'UserId', referencedColumnName: 'id' }])
  User: Users;

  @ManyToOne(
    () => BusinessPersons,
    (businessPersons) => businessPersons.SystemMessages,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'BusinessPersonId', referencedColumnName: 'id' }])
  BusinessPerson: BusinessPersons;
}
