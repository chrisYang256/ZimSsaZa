import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class BusinessPersonJwtAuthGuard extends AuthGuard('businessPerson-jwt') {}