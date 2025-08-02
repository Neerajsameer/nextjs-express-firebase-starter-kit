import { Express } from "express";
import { responseWrapper } from "../../../helpers/responseWrapper";

const ROUTE_FEED = "/payments/rzp_create_order";

export default function (app: Express) {
  app.post(ROUTE_FEED, async (req, res) => {
    return await responseWrapper(req, res, async () => {
      // const rzpOrder = await razorpay.orders.create({
      //   amount: amount * 100,
      //   currency: "INR",
      //   receipt: id.toString(),
      // });

      return { responseData: { rzp_order_id: "NOT IMPLEMENTED YET" } };
    });
  });
}
