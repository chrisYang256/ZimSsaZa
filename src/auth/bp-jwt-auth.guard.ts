import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class BPJwtAuthGuard extends AuthGuard('bp-jwt') {}