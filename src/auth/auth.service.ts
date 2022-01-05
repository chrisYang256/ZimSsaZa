import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .select('user.id, user.email, user.password, user.name, user.phone_number')
            .where('user.email = :email', { email })
            .getOne()
        console.log('auth service user:::', user)
        
        const result = await bcrypt.compare(password, user.password);

        if (result) {
            const { password, ...userInfoWithoutPassword } = user;
            return userInfoWithoutPassword;
        }

        return null;
        // throw new ForbiddenException('비밀번호가 틀렸습니다.')
    }
}
