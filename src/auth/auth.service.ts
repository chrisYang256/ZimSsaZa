import { ForbiddenException, Injectable } from '@nestjs/common';
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
            .select([
                'user.id', 
                'user.email', 
                'user.password', 
            ])
            .where('user.email = :email', { email })
            .getOne()
        // console.log('auth service user:::', user);
        
        if (!user) {
            throw new ForbiddenException(`'${email}' 회원을 찾을 수 없습니다.`)
        }

        const result = await bcrypt.compare(password, user.password);
        console.log('bcrypt result:::', result)

        if (result) {
            const { password, ...userInfoWithoutPassword } = user;
            return userInfoWithoutPassword;
        }

        throw new ForbiddenException(`비밀번호가 일치하지 않습니다.`)
    }

    async validateBusinessPerson(email: string, password: string) {
        const businessPerson = await this.businessPersons
            .createQueryBuilder('businessPerson')
            .select([
                'businessPerson.id', 
                'businessPerson.email', 
                'businessPerson.password', 
            ])
            .where('businessPerson.email = :email', { email })
            .getOne()
        // console.log('auth service businessPerson:::', businessPerson);
        
        if (!businessPerson) {
            throw new ForbiddenException(`'${email}' 회원을 찾을 수 없습니다.`)
        }

        const result = await bcrypt.compare(password, businessPerson.password);

        if (result) {
            const { password, ...BusinessPersonInfoWithoutPassword } = businessPerson;
            return BusinessPersonInfoWithoutPassword;
        }

        throw new ForbiddenException(`비밀번호가 일치하지 않습니다.`)
    }

    async login(user): Promise<{access_token: string}> {
        const payload = { id: user.id }
        const token = this.jwtService.sign(payload);
        // console.log('token:::', token)

        return { access_token: token }
    }
}
