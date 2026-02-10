import { fetchApi } from "@/utils";
import { MutationResponse } from "../mutation-response";

export interface DmStoreRequest {
  receiverUserId: number;
  content: string;
  mediaIds: number[];
}

export function dmStore() {
  return {
    fetcher: (req: DmStoreRequest): Promise<MutationResponse> =>
      fetchApi("POST", "/dm", req),
  };
}
