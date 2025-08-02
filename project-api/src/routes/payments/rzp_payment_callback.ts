import { Express } from "express";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import errorHandler, { ERROR_CODES } from "../../../helpers/errorHandler";
import { RAZORPAY_KEY_SECRET } from "../../../helpers/globals";
import { responseWrapper } from "../../../helpers/responseWrapper";

const ROUTE_PAYMENT_CALLBACK = "/payments/rzp_payment_callback";

export default function (app: Express) {
  app.post(ROUTE_PAYMENT_CALLBACK, async (req, res) => {
    return await responseWrapper(req, res, async () => {
      const { rzp_order_id, rzp_payment_id, rzp_signature, payment_split_id } = req.body;

      if (!rzp_order_id) throw errorHandler(ERROR_CODES.MISSING_PARAMS, "rzp_order_id");
      if (!rzp_payment_id) throw errorHandler(ERROR_CODES.MISSING_PARAMS, "rzp_payment_id");
      if (!rzp_signature) throw errorHandler(ERROR_CODES.MISSING_PARAMS, "rzp_signature");
      if (!payment_split_id) throw errorHandler(ERROR_CODES.MISSING_PARAMS, "payment_split_id");

      const isValid = validatePaymentVerification(
        { order_id: rzp_order_id, payment_id: rzp_payment_id },
        rzp_signature,
        RAZORPAY_KEY_SECRET
      );
      if (!isValid) throw errorHandler(ERROR_CODES.INVALID_PARAMS, "Invalid Razorpay signature");

      // Implement your own logic here

      return { responseData: { rzp_order_id: "" } };
    });
  });
}
