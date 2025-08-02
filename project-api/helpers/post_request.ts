import http from "http";
import https from "https";

export async function postRequest(url: string, data: any, reqHeaders?: any) {
  const requestResolver = process.env.NODE_ENV === "development" && !url.includes("https://") ? http : https;

  var dataString: string | null = null;
  try {
    dataString = JSON.stringify(data);
  } catch (e) {
    console.error("Failed to stringfy data");
  }
  const headers = {
    ...reqHeaders,
    "Content-Type": "application/json",
  } as any;

  const options = {
    method: "POST",
    headers: headers,
  };

  return new Promise((resolve, reject) => {
    const req = requestResolver.request(new URL(url), options);
    req.write(dataString);
    req.end(null, async () => {
      /* Request has been fully sent */
      await new Promise((resolve) => setTimeout(resolve, 1000));
      resolve(req);
    });
  }).catch((e) => {
    console.error(e);
  });
}
