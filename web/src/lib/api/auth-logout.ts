import { fetchApi } from "@/utils";
import { MutationResponse } from "../mutation-response";

export function authLogout() {
  return {
    fetcher: (): Promise<MutationResponse> => fetchApi("POST", "/auth/logout"),
  };
}
