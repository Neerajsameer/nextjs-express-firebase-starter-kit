import { Express } from "express";
import errorHandler, { ERROR_CODES } from "../../../helpers/errorHandler";
import { responseWrapper } from "../../../helpers/responseWrapper";
import { sendNotificationToUsers } from "../../../helpers/sendNotification";

const ROUTE_FEED = "/internal/send_notification";

export default function (app: Express) {
  app.post(ROUTE_FEED, async (req, res) => {
    return await responseWrapper(req, res, async () => {
      const { message, title, ...reqBody } = req.body;

      if (!title) throw errorHandler(ERROR_CODES.MISSING_PARAMS, "title is required");
      if (!message) throw errorHandler(ERROR_CODES.MISSING_PARAMS, "message is required");
      if (!reqBody.type) throw errorHandler(ERROR_CODES.MISSING_PARAMS, "type is required");

      await sendNotificationToUsers({
        title,
        message,
        data: reqBody,
      });

      return { responseData: { status: "success" } };
    });
  });
}
