import { fetchApi } from "@/utils";
import { MutationResponse } from "../mutation-response";

export function dmRead(userId: number) {
  return {
    fetcher: (): Promise<MutationResponse> =>
      fetchApi("POST", `/dm/${userId}/read`),
  };
}
