import { PickType } from "@nestjs/swagger";
import { BusinessPersons } from "src/entities/BusinessPersons";

export class BPWithoutPasswordDto extends PickType(BusinessPersons, [
    'id', 
    'name', 
    'email', 
    'phone_number',
    'business_license',
    'finish_count',
]) {}