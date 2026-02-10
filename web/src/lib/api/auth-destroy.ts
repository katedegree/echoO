import { fetchApi } from "@/utils";
import { MutationResponse } from "../mutation-response";

export function authDestroy() {
  return {
    fetcher: (): Promise<MutationResponse> => fetchApi("DELETE", "/auth"),
  };
}
