import { Express } from "express";
import prisma from "../../../helpers/globals";
import { responseWrapper } from "../../../helpers/responseWrapper";

const LOGIN = "/auth/logout";

export default function (app: Express) {
  app.post(LOGIN, async (req, res) => {
    return await responseWrapper(req, res, async () => {
      const token = req.body.token;

      await prisma.tokens.deleteMany({
        where: { user_id: req.user_id, token: token },
      });

      return { responseData: { status: "success" } };
    });
  });
}
