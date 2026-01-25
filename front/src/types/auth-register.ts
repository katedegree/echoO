export interface AuthRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthRegisterResponse {
  accessToken: string;
};
