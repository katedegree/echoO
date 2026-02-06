import { fetchApi } from "@/utils";
import { MutationResponse } from "../mutation-response";

export interface AuthRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export function authRegister() {
  return {
    fetcher: (req: AuthRegisterRequest): Promise<
      MutationResponse<{
        accessToken: string;
      }>
    > => fetchApi("POST", "/auth/register", req),
  };
}
