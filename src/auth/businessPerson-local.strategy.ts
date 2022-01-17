import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class BusinessPersonLocalStrategy extends PassportStrategy(Strategy, 'businessPerson-local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password'});
  }

  async validate(email: string, password: string): Promise<any> {
    const bp = await this.authService.validateBP(email, password);
    // console.log('business-person:::', bp);
    
    return bp;
  }
}