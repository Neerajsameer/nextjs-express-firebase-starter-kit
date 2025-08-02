import * as Sentry from "@sentry/node";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { FirebaseError } from "firebase-admin";
import _ from "lodash";
import errorHandler, { ERROR_CODES } from "./errorHandler";
import { fAuth } from "./firebase";
import prisma from "./globals";
import {} from "./interfaces";
import { UtilsClass } from "./utils_class";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

interface FunctionResponse {
  responseData: any;
  returnType?: "json" | "file";
}

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
});

export async function responseWrapper(
  req: Request,
  res: Response,
  f: () => Promise<FunctionResponse>,
  authRequired: boolean = true
) {
  process.env.TZ = "Asia/Kolkata";
  let responseBody: any = {};
  let statusCode = 200;
  const requestTs = new Date();
  const request_id = randomUUID();

  // if preflight request, return 200
  if (req.method === "OPTIONS") return res.status(200).send("ok");

  Sentry.addBreadcrumb({
    message: "Request",
    data: { url: req.url, method: req.method, body: req.body, headers: req.headers },
  });

  const traceHeader = req.header("X-Cloud-Trace-Context") as string;

  const utils = new UtilsClass({ url: req.url, traceHeader, request_id });

  if (process.env.NODE_ENV !== "development") {
    utils.info(`API Request for ${req.url}`, {
      body: req.body,
      query: req.query,
      params: req.params,
      url: req.url,
      headers: req.headers,
    });
  }

  try {
    const access_token = req.headers["authorization"]?.replace("Bearer ", "") as string;
    let user_id: string | null = null;

    if (req.headers.api_key == process.env.ADMIN_SECRET) {
      req.user_id = !req.headers.user_id ? null : (Number(req.headers.user_id) as any);
      utils.user_id = req.user_id;
    } else {
      const data = await validateToken(access_token as string, authRequired);

      user_id = data?.user_id ?? null;

      req.user_id = user_id as any;
      req.auth_token = access_token;
      req.uid = data.uid as any;
      req.user = data.user;
    }

    req.organisation_id = req.headers["x-organisation-id"] as string;

    const response: FunctionResponse = await f();
    responseBody = { data: response.responseData };
  } catch (e: any) {
    utils.error("API Call Failed: " + e?.error?.code, { e });
    if (e.code == "P2025") {
      statusCode = errorHandler(ERROR_CODES.RECORD_NOT_FOUND).status;
      responseBody.error = errorHandler(ERROR_CODES.RECORD_NOT_FOUND).error;
    } else if (e.error) {
      const errorHandlerObject: ErrorHandlerType = e;
      statusCode = errorHandlerObject.status ?? 400;
      responseBody.error = errorHandlerObject.error;
    } else {
      const err = e as PrismaClientKnownRequestError;

      statusCode = 500;

      const error = errorHandler(ERROR_CODES.INTERNAL_ERROR).error;

      responseBody["error"] = error;
      Sentry.captureException(e);
    }
  } finally {
    const responseTs = new Date();

    responseBody = {
      ...responseBody,
      request_timestamp: requestTs.toISOString(),
      response_timestamp: responseTs.toISOString(),
      request_id: request_id,
    };

    res.status(statusCode).send(responseBody);

    const nonTrackableRoutes = [] as string[];

    if (!nonTrackableRoutes.includes(req.url!) && !req.url!.includes("listener=true")) {
      await prisma.api_logs.create({
        data: {
          id: request_id,
          body: _.isObject(req.body) ? req.body : {},
          error: responseBody.error,
          end_time: responseTs,
          method: req.method!,
          response_time: responseTs.getTime() - requestTs.getTime(),
          start_time: requestTs,
          status_code: statusCode,
          url: req.url!.split("?")[0],
          params: req.url!.includes("?") ? Object.fromEntries(new URLSearchParams(req.url!.split("?")[1])) : {},
          created_at: requestTs,
          user_id: req.user_id,
        },
      });
    }
  }
}

export async function validateToken(access_token: string, authRequired: boolean) {
  try {
    const data = await fAuth.verifyIdToken(access_token);
    const user = await prisma.users.findUnique({ where: { uid: data.uid } });
    if (!user && authRequired)
      throw errorHandler(ERROR_CODES.INVALID_TOKEN, "invalid user or User may have been deleted");

    return { user_id: user?.id, uid: data.uid, user };
  } catch (e) {
    const err = e as FirebaseError;
    if (authRequired == false) return { user_id: null };
    if (err.code == "auth/id-token-expired" || err.code === "auth/argument-error")
      throw errorHandler(ERROR_CODES.TOKEN_EXPIRED);
    if (err.code == "auth/user-not-found") throw errorHandler(ERROR_CODES.ACCESS_DENIED);
    else throw e;
  }
}
