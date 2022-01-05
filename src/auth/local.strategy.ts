import { ForbiddenException, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            secretOrkey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload, done: CallableFunction) {
        const user = await this.authService.validateUser(payload.email, payload.password);

        if (!user) {
            throw new ForbiddenException('존재하지 않는 회원입니다.')
        }
        
        console.log('local strategy payload:::', payload);
        console.log('local strategy done:::', done);
        return done(null, user);
    }
}