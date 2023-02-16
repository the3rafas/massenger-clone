import { createParamDecorator } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces';

export const CurrentUser = createParamDecorator(
  (file, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp();
 
    console.log(user);
    return user;
  },
);
