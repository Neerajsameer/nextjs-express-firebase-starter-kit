export const API_URLS = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    SOCIAL: "/auth/social",
  },
  PROJECTS: {
    BASE: "/projects",
    DETAIL: (id: any) => `/projects/${id}`,
  },
  SIGNED_URL: "/get-signed-url",
};
