import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.email', 'user.password', 'user.name', 'user.phone_number'])
            .where('user.email = :email', { email })
            .getOne()
        // console.log('auth service user:::', user);
        
        if (!user) {
            return null;
        }

        const result = await bcrypt.compare(password, user.password);

        if (result) {
            const { password, ...userInfoWithoutPassword } = user;
            return userInfoWithoutPassword;
        }

        return null;
    }

    async login(userId: number): Promise<{access_token: string}> {
        const payload = { id: userId }
        return {
          access_token: this.jwtService.sign(payload),
        }
    }
}
