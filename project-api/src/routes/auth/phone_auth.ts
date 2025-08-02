import { Express } from "express";
import prisma from "../../../helpers/globals";
import { responseWrapper } from "../../../helpers/responseWrapper";

const ROUTE_AUTH = "/auth/phone";

export default function (app: Express) {
  app.post(ROUTE_AUTH, async (req, res) => {
    return await responseWrapper(
      req,
      res,
      async () => {
        const { photo_url, phone, token, uid, device_info } = req.body;

        let user = await prisma.users.findUnique({ where: { uid } });

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
              phone,
              photo_url: photo_url,
              name: "Unknown User",
              device_info,
              tokens: token ? { create: { token } } : undefined,
            },
            update: {
              uid,
              phone,
              device_info,
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
