import { SDK } from "@100mslive/server-sdk";
import { CloudTasksClient } from "@google-cloud/tasks";
import { Prisma, PrismaClient } from "@prisma/client";
import Razorpay from "razorpay";
import { customAlphabet } from "nanoid";

export const IS_DEV_MODE = process.env.NODE_ENV === "development";

const prisma = new PrismaClient({
  // log: ["query", "info", "warn", "error"],
});

export let client: CloudTasksClient | null = null;
if (!client) client = new CloudTasksClient();

// export let razorpay = null as any as Razorpay;

export const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID!;
export const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

// razorpay = new Razorpay({
//   key_id: RAZORPAY_KEY_ID,
//   key_secret: RAZORPAY_KEY_SECRET,
// });

export const IS_PRODUCTION_ENV = process.env.NODE_ENV === "production";
export const BACKEND_URL = process.env.BACKEND_URL;
export const ADMIN_SECRET = process.env.ADMIN_SECRET;

export default prisma as PrismaClient<Prisma.PrismaClientOptions, never>;

export const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);
