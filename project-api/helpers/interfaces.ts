import { users } from "@prisma/client";
import { ERROR_CODES } from "./errorHandler";

declare global {
  namespace Express {
    export interface Request {
      user_id: string;
      user?: users | null;
      uid: string;
      auth_token?: string | null;
      organisation_id: string; // can be null as well, especially in auth routes
    }
  }

  type Json = Record<string, any>;

  interface ErrorHandlerType {
    status: number;
    error: { code: ERROR_CODES; message: string };
    metadata?: { stacktrace?: string; otherData?: Record<string, any> };
  }
}

// FOr Mobile Push Notifications
export enum NotificationType {}
