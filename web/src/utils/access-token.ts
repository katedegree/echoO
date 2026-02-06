import Cookie from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";

export const accessToken = {
  get: () => Cookie.get(ACCESS_TOKEN_KEY),
  set: (value: string) =>
    Cookie.set(ACCESS_TOKEN_KEY, value, { expires: 31 }),
  remove: () => Cookie.remove(ACCESS_TOKEN_KEY),
};
