import { Prisma } from '../../generated/prisma/client';

export type UserSelectPayload = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    firstName: true;
    lastName: true;
    roleId: true;
    createdAt: true;
  };
}>;

export type UserTypesSelectPayload = Prisma.UserTypeGetPayload<{
  select: {
    id: true;
    type: true;
    createdAt: true;
  };
}>;
