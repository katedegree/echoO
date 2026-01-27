import { fetchMutation } from "../fetch-mutation";

export interface AuthLoginRequest {
  email: string;
  password: string;
}

export interface AuthLoginResponse {
  accessToken: string;
}

export function authLogin(req: AuthLoginRequest) {
  return {
    fetcher: () =>
      fetchMutation<AuthLoginRequest, AuthLoginResponse>(
        "POST",
        "/auth/login",
        req,
      ),
  };
}
