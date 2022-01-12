import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AreaCodes } from 'src/entities/AreaCodes';
import { BusinessPersons } from 'src/entities/BusinessPersons';
import { LoadImages } from 'src/entities/LoadImages';
import { MovingGoods } from 'src/entities/MovingGoods';
import { MovingInformations } from 'src/entities/MovingInformations';
import { Negotiations } from 'src/entities/Negotiations';
import { Users } from 'src/entities/Users';
import { UserWithoutPasswordDto } from 'src/users/dto/user-without-password.dto';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(BusinessPersons)
        private businessPersonsRepository: Repository<BusinessPersons>,
        @InjectRepository(Negotiations)
        private negotiationsRepository: Repository<Negotiations>,
        @InjectRepository(MovingInformations)
        private movingInformationsRepository: Repository<MovingInformations>,
        @InjectRepository(MovingGoods)
        private movingGoodsRepository: Repository<MovingGoods>,
        @InjectRepository(LoadImages)
        private loadImageRepository: Repository<LoadImages>,
        @InjectRepository(AreaCodes)
        private areaCodesRepository: Repository<AreaCodes>,
        private connection: Connection,
    ) {}

    async submitMovingInfo(user: UserWithoutPasswordDto) {

    }
}
