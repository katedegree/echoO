import { fetchApi } from "@/utils";
import { QueryResponse } from "../query-response";

export interface PostIndexRequest {
  limit: number;
  cursor: string | null;
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

type PostIndexPageData = QueryResponse<
  PostIndexResponse[],
  { cursor: string | null }
>;

export function postIndex() {
  return {
    key: ["posts"] as const,
    infiniteKey:
      (userId: number | null) =>
      (
        _pageIndex: number,
        previousPageData: PostIndexPageData | null,
      ) => {
        if (previousPageData && !previousPageData.data.length) return null;
        const cursor = previousPageData?.cursor ?? null;
        return ["posts", userId, cursor] as const;
      },
    fetcher: (req: PostIndexRequest): Promise<PostIndexPageData> =>
      fetchApi("GET", "/posts", req),
  };
}
