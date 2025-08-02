import { Express } from "express";
import errorHandler, { ERROR_CODES } from "../../../helpers/errorHandler";
import prisma from "../../../helpers/globals";
import { responseWrapper } from "../../../helpers/responseWrapper";

const LOGIN = "/auth/login";

export default function (app: Express) {
  app.post(LOGIN, async (req, res) => {
    return await responseWrapper(
      req,
      res,
      async () => {
        const { uid, email, token } = req.body;
        if (!uid || !email) throw errorHandler(ERROR_CODES.MISSING_PARAMS, "uid");
        const user = await prisma.users.findFirstOrThrow({ where: { uid, email } });

        if (token) {
          await prisma.tokens.upsert({
            where: { token_user_id: { token, user_id: user.id } },
            create: { token, user_id: user.id },
            update: { user_id: user.id },
          });
        }

        return { responseData: user };
      },
      false
    );
  });
}
