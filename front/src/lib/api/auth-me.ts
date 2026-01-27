import { fetchQuery } from "../fetch-query";

export interface AuthMeResponse {
  id: number;
  name: string;
  iconUrl: string | null;
  likedPostIds: number[];
}

export function authMe() {
  return {
    key: ["auth", "me"],
    fetcher: () => fetchQuery<{}, AuthMeResponse>("/auth/me"),
  };
}
