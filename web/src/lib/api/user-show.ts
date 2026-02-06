import { fetchApi } from "@/utils";

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
    fetcher: (): Promise<UserShowResponse> => fetchApi("GET", `/users/${id}`),
  };
}
