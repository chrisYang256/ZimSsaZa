import { PickType } from '@nestjs/swagger';
import { Users } from 'src/entities/Users';

export class LoginDto extends PickType(Users, ['email', 'password']) {}
