import { fetchApi } from "@/utils";
import { MutationResponse } from "../mutation-response";

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export function authLogin() {
  return {
    fetcher: (req: AuthLoginRequest): Promise<
      MutationResponse<{
        accessToken: string;
      }>
    > => fetchApi("POST", "/auth/login", req),
  };
}
