import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('local auth guard context:::', context)
        const can  = await super.canActivate(context);

        if (can) {
            const request = context.switchToHttp().getRequest();
            console.log('login for Token');

            await super.logIn(request);
        }

        return true;
    }
}