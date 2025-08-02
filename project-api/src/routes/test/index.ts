import { Express } from "express";
import { responseWrapper } from "../../../helpers/responseWrapper";

const ROUTE_TEST = "/internal/test";

export default function (app: Express) {
  app.get(ROUTE_TEST, async (req, res) => {
    return await responseWrapper(req, res, async () => {
      return { responseData: { message: "JUST A TEST ROUTE FOR TESTING" } };
    });
  });
}
