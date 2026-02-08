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
  isPublic: boolean;
}
[];

export function postIndex() {
  return {
    key: ["posts"] as const,
    infiniteKey:
      (userId: number | null) =>
      (pageIndex: number, previousPageData: PostIndexResponse[] | null) => {
        if (previousPageData && !previousPageData.length) return null;
        return ["posts", userId, pageIndex] as const;
      },
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
