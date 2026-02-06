import { fetchApi } from "@/utils";

export interface PostLikeResponse {
  id: number;
  user: {
    id: number;
    name: string;
    iconUrl: string | null;
  };
}

export function postLike(postId: number) {
  return {
    fetcher: (): Promise<PostLikeResponse> =>
      fetchApi("POST", `/posts/${postId}/like`),
  };
}
