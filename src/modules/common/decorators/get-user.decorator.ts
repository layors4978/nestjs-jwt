import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    // convert to http request
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // if data === id
    // return req.user.id
    // if !data
    // return req.user
    return data ? user[data] : user;
  },
);
