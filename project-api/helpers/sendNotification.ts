import admin from "firebase-admin";
import createCloudTask from "./cloud_tasks";
import { ADMIN_SECRET, IS_DEV_MODE } from "./globals";
import { NotificationType } from "./interfaces";
import { pgClient } from "./pg";

export async function scheduleNotification({
  title,
  message,
  notificationType,
}: {
  title: string;
  message: string;
  notificationType: NotificationType;
}) {
  if (IS_DEV_MODE) return;
  await createCloudTask([
    {
      queue: "notifications",
      httpBody: {
        url: "/internal/send_notification",
        method: "POST",
        headers: { api_key: ADMIN_SECRET },
        body: {
          title,
          type: notificationType,
          message: message.substring(0, 240),
          // Send any other info here for metadata
        },
      },
    },
  ]);
}

export async function sendNotificationToUsers({
  title,
  message,
  data,
}: {
  title: string;
  message: string;
  data: Record<string, any>;
}) {
  const queryData = await pgClient.query(`SELECT * FROM tokens WHERE *********`);

  const tokens = queryData.rows.map((token: any) => token.token);

  console.log("Sent to tokens: " + tokens.length);

  const chunkSize = 400;
  for (let i = 0; i < tokens.length; i += chunkSize) {
    const chunk = tokens.slice(i, i + chunkSize);

    const sentResponse = await admin.messaging().sendEachForMulticast({
      tokens: chunk,
      notification: {
        title,
        body: message,
      },
      apns: {
        payload: { aps: { sound: "default" } },
      },
      data,
    });

    console.log({ successCount: sentResponse.successCount, failureCount: sentResponse.failureCount });
  }
}
