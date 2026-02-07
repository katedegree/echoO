import { fetchApi } from "@/utils";
import { MutationResponse } from "../mutation-response";

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
    fetcher: (): Promise<MutationResponse<PostLikeResponse>> =>
      fetchApi("POST", `/posts/${postId}/like`),
  };
}
