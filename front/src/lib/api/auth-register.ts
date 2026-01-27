import { fetchMutation } from "../fetch-mutation";

export interface AuthRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthRegisterResponse {
  accessToken: string;
}

export function authRegister(req: AuthRegisterRequest) {
  return {
    fetcher: () =>
      fetchMutation<AuthRegisterRequest, AuthRegisterResponse>(
        "POST",
        "/auth/register",
        req,
      ),
  };
}
