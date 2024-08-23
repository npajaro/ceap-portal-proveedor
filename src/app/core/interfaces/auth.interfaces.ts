export interface CheckTokenResponse {
  token: string;
  user: User;
}
export interface CheckTokenResponseError {
  message: string;

}
export interface CheckTokenResponseSuccess {
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export enum AuthStatus {
  checking = 'checking',
  authenticated = 'authenticated',
  notAuthenticated = 'noAuthenticated',
}

