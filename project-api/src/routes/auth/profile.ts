import { Express } from "express";
import admin from "firebase-admin";
import prisma from "../../../helpers/globals";
import { responseWrapper } from "../../../helpers/responseWrapper";
import errorHandler, { ERROR_CODES } from "../../../helpers/errorHandler";

const ROUTE_PROFILE = "/auth/profile";

export default function (app: Express) {
  app.get(ROUTE_PROFILE, async (req, res) => {
    return await responseWrapper(req, res, async () => {
      const user = await prisma.users.findUniqueOrThrow({
        where: { id: req.user_id },
      });

      return { responseData: user };
    });
  });

  app.put(ROUTE_PROFILE, async (req, res) => {
    return await responseWrapper(req, res, async () => {
      const { name, photo_url, bio, user_name } = req.body;

      if (user_name) {
        const existingUser = await prisma.users.findUnique({
          where: { user_name },
        });

        if (existingUser && existingUser.id !== req.user_id) {
          throw errorHandler(ERROR_CODES.OPERATION_DENIED, "Username already exists");
        }
      }

      const user = await prisma.users.update({
        where: { id: req.user_id },
        data: {
          name: name ?? undefined,
          photo_url: photo_url,
          bio: bio || null,
          user_name: user_name ?? undefined,
        },
      });

      await admin.auth().updateUser(req.uid, { displayName: name, photoURL: photo_url });

      return { responseData: user };
    });
  });
}
