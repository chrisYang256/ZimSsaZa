import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class NotLoggedInGuard implements CanActivate {
    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        console.log('request.headers:::', request.headers);
        // postman에서 token을 authorization에 담아주기 때문에 아래와 같이 설정
        return !request.headers.authorization;
    }
}