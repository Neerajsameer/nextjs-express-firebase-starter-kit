import { CloudTasksClient } from "@google-cloud/tasks";
import { AxiosRequestConfig } from "axios";
import { cloneDeep } from "lodash";
import { BACKEND_URL, IS_PRODUCTION_ENV } from "./globals";
import { postRequest } from "./post_request";

const project = process.env.GOOGLE_PROJECT_ID!;
const location = process.env.GCP_REGION!;

let client: CloudTasksClient | null = null;

if (!client) client = new CloudTasksClient();

export type newCreateCloudTaskParams = {
  queue: "notifications" | "image-compressor" | "welcome-messages";
  inSecondsDelay?: number;
  httpBody: {
    headers?: Record<string, any>;
    body?: Record<string, any>;
    url: string;
    method: AxiosRequestConfig["method"];
  };
}[];

export default async function createCloudTask(tasks: newCreateCloudTaskParams) {
  const WORK_SIZE = IS_PRODUCTION_ENV ? 500 : 10;
  const work = cloneDeep(tasks).splice(0, tasks.length);
  let sleepNow = 0;

  while (work.length > 0) {
    const promises = work.splice(0, WORK_SIZE).map((x) => {
      const URL_PREFIX = x.httpBody.url.includes("http") ? "" : BACKEND_URL;

      if (!IS_PRODUCTION_ENV) {
        const fullUrl = x.httpBody.url.includes("http") ? x.httpBody.url : URL_PREFIX + x.httpBody.url;
        sleepNow += x.inSecondsDelay ?? 0;
        return postRequest(fullUrl, x.httpBody.body ?? {}, x.httpBody.headers);
      } else {
        return client!.createTask({
          parent: client!.queuePath(project, location, x.queue),
          task: {
            httpRequest: {
              body:
                x.httpBody.method == "POST"
                  ? Buffer.from(JSON.stringify(x.httpBody.body ?? {})).toString("base64")
                  : undefined,
              headers: { "content-type": "application/json", ...x.httpBody.headers },
              httpMethod: (x.httpBody.method as any) || "POST",
              url: URL_PREFIX + x.httpBody.url,
            },
            scheduleTime: {
              seconds: Math.floor(Date.now() / 1000) + (x.inSecondsDelay ?? 0),
            },
          },
        });
      }
    });

    await Promise.all(promises);
  }
}
