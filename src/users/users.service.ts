import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) {}

    async signUp(userJoinDto: CreateUserDto) {
        const { name, email, password, phone_number } = userJoinDto;
        const passwordRegex = /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        const phoneNumberRegex = /^010-\d{3,4}-\d{4}$/;

        if (email === '') {
            throw new ForbiddenException('이메일이 입력되지 않았습니다.');
        }

        if (password === '') {
            throw new ForbiddenException('비밀번호가 입력되지 않았습니다.');
        }

        if (!passwordRegex.test(password)) {
            throw new ForbiddenException('비밀번호 형식이 올바르지 않습니다.');
        }

        if (!phoneNumberRegex.test(phone_number)) {
            throw new ForbiddenException('전화번호 형식이 올바르지 않습니다.');
        }

        try {
            const user = await this.usersRepository
                .createQueryBuilder('users')
                .where('users.email = :email', { email })
                .getOne();
    
            if (user) {
                throw new ForbiddenException(`'${email}'는 이미 가입된 이메일입니다.`)
            }
    
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
    
            await this.usersRepository
                .createQueryBuilder()
                .insert()
                .into('users')
                .values({ 
                    name, 
                    email, 
                    password: hashedPassword, 
                    phone_number,
                })
                .execute();
            return { 'message': '회원 가입 성공', 'statusCode': 200 }
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}