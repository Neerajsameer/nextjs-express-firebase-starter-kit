import { Express } from "express";
import prisma from "../../../helpers/globals";
import { responseWrapper } from "../../../helpers/responseWrapper";

const ROUTE_LOGIN = "/auth/social";

export default function (app: Express) {
  app.post(ROUTE_LOGIN, async (req, res) => {
    return await responseWrapper(
      req,
      res,
      async () => {
        const { photo_url, name, email, token, uid, device_info } = req.body;

        let user: any = await prisma.users.findUnique({ where: { uid } });

        if (user) {
          if (token) {
            await prisma.tokens.upsert({
              where: { token_user_id: { token, user_id: user.id } },
              create: { token, user_id: user.id },
              update: { user_id: user.id },
            });
          }
        } else {
          const newUser = await prisma.users.upsert({
            where: { uid },
            create: {
              uid,
              email,
              name: name ?? email.split("@")[0],
              photo_url: user?.photo_url ?? photo_url,
              tokens: token ? { create: { token } } : undefined,
              Organisations_users: {
                create: { organisation: { create: { name: (name ?? "Personal").split(" ")[0] + "'s Personal" } } },
              },
            },
            update: {
              uid,
              email,
              name: name ?? undefined,
              photo_url: user?.photo_url ?? photo_url ?? undefined,
              tokens: token ? { create: { token } } : undefined,
            },
          });

          user = newUser;
        }

        return { responseData: user };
      },
      false
    );
  });
}
