import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { MovingInformations } from './MovingInformations';

@Entity({ schema: 'ZimSsaZa', name: 'moving_statuses' })
export class MovingStatuses {
  @ApiProperty({ example: 3, description: 'move_statuses PK' })
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'NEGO', description: '이사 진행 상태' })
  @Column('varchar', { name: 'status', length: 10 })
  status: string;

  @OneToMany(
    () => MovingInformations,
    (movinginformations) => movinginformations.MovingStatus,
  )
  MovingInformations: MovingInformations[];
}
