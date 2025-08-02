import { Express } from "express";
import admin from "firebase-admin";
import errorHandler, { ERROR_CODES } from "../../../helpers/errorHandler";
import prisma from "../../../helpers/globals";
import { responseWrapper } from "../../../helpers/responseWrapper";

const SIGNUP = "/auth/signup";

export default function (app: Express) {
  app.post(SIGNUP, async (req, res) => {
    return await responseWrapper(
      req,
      res,
      async () => {
        const { name, email, uid, token, device_info } = req.body;

        if (!name || !email || !uid) throw errorHandler(ERROR_CODES.MISSING_PARAMS, "name, email or uid");

        const user = await prisma.users.findUnique({ where: { uid } });
        if (user) throw errorHandler(ERROR_CODES.RECORD_ALREADY_EXISTS, "email already exists");

        const data = await prisma.users.create({
          data: {
            name,
            email,
            uid,
            device_info,
            Organisations_users: { create: { organisation: { create: { name: "Personal" } } } },
          },
        });

        await admin.auth().updateUser(uid, { displayName: name });

        if (token) {
          await prisma.tokens.upsert({
            where: { token_user_id: { token, user_id: data.id } },
            create: { token, user_id: data.id },
            update: { user_id: data.id },
          });
        }

        return { responseData: data };
      },
      false
    );
  });
}
