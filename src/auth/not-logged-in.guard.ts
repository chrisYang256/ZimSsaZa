import { CanActivate, ExecutionContext, Injectable, UseInterceptors } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class NotLoggedInGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        console.log('request:::', request)

        return !request.user;
    }
}