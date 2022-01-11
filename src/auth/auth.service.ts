import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BusinessPersons } from 'src/entities/BusinessPersons';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        @InjectRepository(BusinessPersons)
        private businessPersons: Repository<BusinessPersons>,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.email', 'user.password', 'user.name', 'user.phone_number'])
            .where('user.email = :email', { email })
            .getOne()
        console.log('auth service user:::', user);
        
        if (!user) {
            return null;
        }

        const result = await bcrypt.compare(password, user.password);
        console.log('bcrypt result:::', result)

        if (result) {
            const { password, ...userInfoWithoutPassword } = user;
            console.log('userInfoWithoutPassword:::', userInfoWithoutPassword)
            return userInfoWithoutPassword;
        }

        return null;
    }

    async validateBP(email: string, password: string) {
        const bp = await this.businessPersons
            .createQueryBuilder('bp')
            .select([
                'bp.id', 
                'bp.name', 
                'bp.email', 
                'bp.password', 
                'bp.phone_number', 
                'bp.business_license', 
                'bp.finish_count',
            ])
            .where('bp.email = :email', { email })
            .getOne()
        // console.log('auth service bp:::', bp);
        
        if (!bp) {
            return null;
        }

        const result = await bcrypt.compare(password, bp.password);

        if (result) {
            const { password, ...BPInfoWithoutPassword } = bp;
            return BPInfoWithoutPassword;
        }

        return null;
    }

    async login(user): Promise<{access_token: string}> {
        const payload = { id: user.id }
        const token = this.jwtService.sign(payload);
        // console.log('token:::', token)

        return { access_token: token }
    }
}
