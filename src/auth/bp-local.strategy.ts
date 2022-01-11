import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class BPLocalStrategy extends PassportStrategy(Strategy, 'bp-local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password'});
  }

  async validate(email: string, password: string): Promise<any> {
    const bp = await this.authService.validateBP(email, password);
    
    if (!bp) {
        throw new UnauthorizedException('회원 정보를 찾을 수 없습니다.');
    }
    return bp;
  }
}