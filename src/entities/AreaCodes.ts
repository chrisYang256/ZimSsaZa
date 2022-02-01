import {
  Index,
  Entity,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BusinessPersons } from './BusinessPersons';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { MovingInformations } from './MovingInformations';

@Index('BusinessPersonId', ['BusinessPersonId'], {})
@Entity({ schema: 'ZimSsaZa', name: 'area_codes' })
export class AreaCodes {
  @ApiProperty({ example: 3, description: 'area_codes PK' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: '1', description: '이사 지역 코드' })
  @Column('int', { name: 'code', width: 10 })
  code: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column('int', { name: 'BusinessPersonId', nullable: true })
  BusinessPersonId: number | null;

  @Column('int', { name: 'MovingInformationId', nullable: true })
  MovingInformationId: number | null;

  @OneToOne(
    () => MovingInformations,
    (movingformations) => movingformations.AreaCode,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'MovingInformationId', referencedColumnName: 'id' }])
  MovingInformation: MovingInformations;

  @ManyToOne(
    () => BusinessPersons,
    (businesspersons) => businesspersons.AreaCodes,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'BusinessPersonId', referencedColumnName: 'id' }])
  BusinessPerson: BusinessPersons;
}
