import { fetchQuery } from "../fetch-query";

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

export interface PostIndexExtra {
  total: number;
}

export function postIndex(req: PostIndexRequest, pageIndex?: number) {
  return {
    key: ["posts", req.userId, pageIndex] as const,
    fetcher: () =>
      fetchQuery<PostIndexRequest, PostIndexResponse, PostIndexExtra>(
        "/posts",
        req,
      ),
  };
}
