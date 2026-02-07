import { fetchApi } from "@/utils";
import { MutationResponse } from "../mutation-response";

export interface PostStoreRequest {
  content: string;
  mediaIds: number[];
}

export function postStore() {
  return {
    fetcher: (req: PostStoreRequest): Promise<MutationResponse> =>
      fetchApi("POST", "/posts", req),
  };
}
