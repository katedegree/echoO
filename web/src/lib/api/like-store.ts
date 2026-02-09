import { fetchApi } from "@/utils";
import { MutationResponse } from "../mutation-response";

export interface LikeStoreRequest {
  postId: number;
}

export interface LikeStoreResponse {
  user: {
    id: number;
    name: string;
  } | null;
}

export function likeStore(req: LikeStoreRequest) {
  return {
    fetcher: (): Promise<MutationResponse<LikeStoreResponse>> =>
      fetchApi("POST", "/likes", req),
  };
}
