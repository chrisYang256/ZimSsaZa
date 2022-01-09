import { PickType } from "@nestjs/swagger";
import { BusinessPersons } from "src/entities/BusinessPersons";

export class CreateBPDto extends PickType(BusinessPersons, [
    'name',
    'email',
    'password',
    'phone_number',
    'business_license',
]) {}