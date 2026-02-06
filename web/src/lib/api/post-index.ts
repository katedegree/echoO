import { fetchApi } from "@/utils";
import { QueryResponse } from "../query-response";

export interface PostIndexRequest {
  limit: number;
  offset: number;
  userId: number | null;
}

export interface PostIndexResponse {
  id: number;
  content: string;
  media: {
    id: number;
    label: string;
    url: string;
  }[];
  likesCount: number;
}
[];

export function postIndex() {
  return {
    key: ["posts"] as const,
    infiniteKey: (userId: number | null) => ["posts", userId] as const,
    fetcher: (
      req: PostIndexRequest,
    ): Promise<
      QueryResponse<
        PostIndexResponse,
        {
          total: number;
        }
      >
    > => fetchApi("GET", "/posts", req),
  };
}
