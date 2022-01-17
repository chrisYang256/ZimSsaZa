import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BusinessPersonLocalAuthGuard extends AuthGuard('businessPerson-local') {}