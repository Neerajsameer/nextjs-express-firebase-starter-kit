import { Express } from "express";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import errorHandler, { ERROR_CODES } from "../../../helpers/errorHandler";
import prisma from "../../../helpers/globals";
import { responseWrapper } from "../../../helpers/responseWrapper";

const ROUTE_PAYMENTS = "/webhooks/rzp_payment_webhook";

export default function (app: Express) {
  app.post(ROUTE_PAYMENTS, async (req, res) => {
    return await responseWrapper(
      req,
      res,
      async () => {
        const signature = req.headers["x-razorpay-signature"] as string;
        if (!signature) throw errorHandler(ERROR_CODES.MISSING_PARAMS, "Signature is required");

        validateWebhookSignature(JSON.stringify(req.body), signature, process.env.RAZORPAY_WEBHOOK_SECRET!);

        const payload = req.body as {
          event: "order.paid";
          payload: {
            order: {
              entity: {
                id: string;
                entity: "order";
                amount: number;
                amount_paid: number;
                amount_due: number;
                currency: string;
              };
            };
            payment: {
              entity: {
                id: string;
              };
            };
          };
        };

        if (payload.event !== "order.paid") return { responseData: "Order Failed" };

        return { responseData: { message: "NOT IMPLEMENTED YET" } };
      },
      false
    );
  });
}
