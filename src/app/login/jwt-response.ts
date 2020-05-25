export interface IJwtResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    exp: string;
  };
}
