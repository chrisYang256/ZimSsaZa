import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class BPLocalAuthGuard extends AuthGuard('bp-local') {}