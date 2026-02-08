import { fetchApi } from "@/utils";
import { QueryResponse } from "../query-response";

export interface AuthMeResponse {
  id: number;
  name: string;
  bio: string;
  iconUrl: string | null;
  likedPostIds: number[];
}

export function authMe() {
  return {
    key: ["auth", "me"],
    fetcher: (): Promise<QueryResponse<AuthMeResponse>> => fetchApi("GET", "/auth/me"),
  };
}
