import { fetchApi } from "@/utils";
import { MutationResponse } from "../mutation-response";

export interface UserUpdateRequest {
  name?: string;
  email?: string;
  bio?: string;
  iconId?: number;
}

export function userUpdate() {
  return {
    fetcher: (req: UserUpdateRequest): Promise<MutationResponse> =>
      fetchApi("PATCH", `/users`, req),
  };
}
