import { IS_DEV_MODE } from "./globals";

type SentryTags = Partial<{
  error_type: "gpt" | "core" | "syncing" | "write";
  job_id: string;
}>;

export class UtilsClass {
  traceHeader: string;
  request_id: string;
  user_id?: string;
  url: string;

  constructor({
    traceHeader,
    request_id,
    user_id,
    url,
  }: {
    traceHeader: string;
    request_id: string;
    user_id?: string;
    url: string;
  }) {
    this.traceHeader = traceHeader;
    this.request_id = request_id;
    this.user_id = user_id;
    this.url = url;
  }

  info(message: string, data?: Record<string, any>) {
    this.logGCP({ message, data, severity: "INFO" });
    // Sentry.addBreadcrumb({ message: message, level: "info", data });
  }

  error(message: string, data?: Record<string, any>, tags: SentryTags = {}) {
    this.logGCP({ message, data: { ...(data ?? {}), ...tags }, severity: "ERROR" });
    // Sentry.addBreadcrumb({ message: message, data, level: "error" }); // message: data?.e.message ??
    // Sentry.captureException(data?.e ? (data?.e?.error ? new Error(message) : data?.e) : new Error(message), {
    //   user: { id: this.org_id?.toString(), email: this.org.name ?? "NEW_ORG", username: this.user?.email ?? this.org.name ?? "NEW_ORG" },
    //   tags: { request_id: this.request_id, company_id: this.company_id, integration_type: this.integration_type, org_id: this.org_id, org_plan: this.org.plan, ...tags },
    // });
  }

  private logGCP({
    message,
    data = {},
    severity = "INFO",
  }: {
    message: string;
    data?: Record<string, any>;
    severity: "INFO" | "ERROR" | "CRITICAL" | "DEBUG";
  }) {
    if (IS_DEV_MODE) return console.log(message, data);

    // Handle case where traceHeader is undefined
    if (!this.traceHeader) {
      console.log(
        JSON.stringify({
          severity: severity,
          message: message,
          utils: {
            request_id: this.request_id,
            url: this.url,
          },
          ...data,
        })
      );
      return;
    }

    const [trace] = this.traceHeader.split("/");

    // Complete a structured log entry.
    const entry = Object.assign({
      "logging.googleapis.com/trace": `projects/${process.env.GOOGLE_PROJECT_ID}/traces/${trace}`,
      severity: severity,
      message: message,
      // All Custom Fields.
      utils: {
        request_id: this.request_id,
        url: this.url,
      },
      ...data,
    });
    console.log(JSON.stringify(entry));
  }
}
