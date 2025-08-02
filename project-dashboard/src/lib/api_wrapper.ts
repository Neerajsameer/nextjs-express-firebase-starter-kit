import axios, { AxiosError, AxiosRequestConfig } from "axios";
import FirebaseAuth from "./firebase/firebaseAuthClass";

type MakeApiCallProps = {
  url: string;
  body?: Record<string, any>;
  params?: Record<string, any>;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS" | "TRACE";
  authRequired?: boolean;
};

export default async function makeApiCall(config: MakeApiCallProps) {
  const headers: Record<string, any> = {};

  if (config.body && ["POST", "PUT", "PATCH"].includes(config.method)) {
    headers["Content-Type"] = "application/json";
  }

  const axiosConfig: AxiosRequestConfig = {
    url: "/api" + config.url,
    method: config.method,
    headers,
    data: config.body,
    params: config.params,
    withCredentials: true, // Include cookies for authentication
  };

  try {
    const res = await axios(axiosConfig);
    return res.data.data;
  } catch (e) {
    const error = e as AxiosError;
    const errorData = error.response?.data as any;

    // Check if the error is due to token expiration
    if (error.response?.status === 401) {
      console.log("Token expired, attempting to refresh...");
      try {
        const firebaseAuth = new FirebaseAuth();
        const success = await firebaseAuth.refreshToken();
        if (success) {
          console.log("Token refreshed successfully, retrying request...");
          const retryRes = await axios(axiosConfig);
          return retryRes.data.data;
        } else {
          console.error("Failed to refresh token");
          await firebaseAuth.signOut();
          window.location.href = "/login";
          throw new Error("Authentication failed");
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        const firebaseAuth = new FirebaseAuth();
        await firebaseAuth.signOut();
        window.location.href = "/login";
        throw new Error("Authentication failed");
      }
    }

    console.error({ error: error.response?.data ?? error.message });
    throw error.response?.data ?? error.message;
  }
}
