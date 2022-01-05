import { PickType } from "@nestjs/swagger";
import { Users } from "src/entities/Users";

export class UserSignUpDto extends PickType(Users, [
    'name',
    'email',
    'password',
    'phone_number',
]) {}