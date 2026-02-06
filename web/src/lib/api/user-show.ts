import { fetchQuery } from "../fetch-query";

export interface UserShowResponse {
  id: number;
  name: string;
  bio: string;
  iconUrl: string | null;
  likesCount: number;
}

export function userShow(id: number) {
  return {
    key: ["user", id] as const,
    fetcher: () => fetchQuery<{}, UserShowResponse>(`/users/${id}`),
  };
}
