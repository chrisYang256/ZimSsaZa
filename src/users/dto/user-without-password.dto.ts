import { PickType } from "@nestjs/swagger";
import { Users } from "src/entities/Users";

export class UserWithoutPasswordDto extends PickType(Users, [
    'id', 
    'name', 
    'email', 
    'phone_number'
]) {}