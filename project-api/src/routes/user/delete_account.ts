import { Express } from "express";
import { responseWrapper } from "../../../helpers/responseWrapper";

const ROUTE_FEED = "/user/delete_account";

export default function (app: Express) {
  app.post(ROUTE_FEED, async (req, res) => {
    return await responseWrapper(req, res, async () => {
      // IMPLEMENT DELETE ACCOUNT LOGIC HERE

      return { responseData: { status: "success" } };
    });
  });
}
