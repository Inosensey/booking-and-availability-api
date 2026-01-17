import { Prisma } from '@prisma/client';

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

export type TalentSelectedPayload = Prisma.TalentGetPayload<{
  select: {
    id: true;
    talent: true;
    userId: true;
    isActive: true;
    User: {
      select: {
        firstName: true;
        lastName: true;
      };
    };
  };
}>;

export type BookingSelectedPayload = Prisma.BookingGetPayload<{
  select: {
    start: true;
    end: true;
    talent: {
      select: {
        talent: true;
        User: {
          select: {
            firstName: true;
            lastName: true;
          };
        };
      };
    };
    status: true;
  };
}>;
