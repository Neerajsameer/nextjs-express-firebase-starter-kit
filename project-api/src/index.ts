import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { responseWrapper } from "../helpers/responseWrapper";

import routeLogin from "./routes/auth/login";
import routeLogout from "./routes/auth/logout";
import routePhoneAuth from "./routes/auth/phone_auth";
import routeProfile from "./routes/auth/profile";
import routeSignup from "./routes/auth/signup";
import routeGoogleAuth from "./routes/auth/social";
import routeSignedUrl from "./routes/misc/signed_url";
import routeProject from "./routes/projects/[id]";
import routeProjects from "./routes/projects/index";

import routeSendNotification from "./routes/internal/send_notification";

import routeGroupPaymentRzpCreateOrder from "./routes/payments/rzp_create_order";
import routeGroupPaymentRzpPaymentCallback from "./routes/payments/rzp_payment_callback";
import routeRzpWebhook from "./routes/payments/rzp_webhook";

import routeUser from "./routes/user";
import routeUserDeleteAccount from "./routes/user/delete_account";

import routeTest from "./routes/test";

const dotenv = require("dotenv").config();

export const app: express.Express = express();

app.use(
  bodyParser.json({
    strict: false,
    limit: "100mb",
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get("/", async (req, res) => {
  return responseWrapper(req, res, async () => {
    return { responseData: { ello: "Welcome to API" } };
  });
});

routeGoogleAuth(app);
routePhoneAuth(app);
routeLogin(app);
routeLogout(app);
routeProfile(app);
routeSignup(app);
routeSendNotification(app);
routeGroupPaymentRzpCreateOrder(app);
routeGroupPaymentRzpPaymentCallback(app);
routeUserDeleteAccount(app);
routeUser(app);
routeRzpWebhook(app);
routeTest(app);
routeProjects(app);
routeProject(app);
routeSignedUrl(app);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.info(
    `🚀 Server ready at: http://localhost:` + PORT,
    process.env.NODE_ENV,
    "Took " + process.uptime() + "Seconds to start"
  );
});

server.setTimeout(1000 * 60 * 10); // 10 min
