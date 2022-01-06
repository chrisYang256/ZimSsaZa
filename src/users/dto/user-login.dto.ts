import { PickType } from "@nestjs/swagger";
import { Users } from "src/entities/Users";

export class UserLoginDto extends PickType(Users, ['email', 'password']) {}