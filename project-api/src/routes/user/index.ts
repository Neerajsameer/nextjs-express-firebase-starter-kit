import { Express } from "express";
import prisma from "../../../helpers/globals";
import { responseWrapper } from "../../../helpers/responseWrapper";

const ROUTE = "/user";

export default function (app: Express) {
  app.get(ROUTE, async (req, res) => {
    return await responseWrapper(req, res, async () => {
      const token = req.query.token as string;

      const user = await prisma.users.update({
        where: { id: req.user_id },
        data: { last_active_at: new Date() },
      });

      if (token) {
        await prisma.tokens.upsert({
          where: { token_user_id: { token, user_id: req.user_id } },
          create: { token, user_id: req.user_id },
          update: { token },
        });
      }

      const organisations = await prisma.organisations.findMany({
        where: { Organisations_users: { some: { user_id: req.user_id } } },
      });

      (user as any).organisations = organisations;

      return { responseData: user };
    });
  });
}
