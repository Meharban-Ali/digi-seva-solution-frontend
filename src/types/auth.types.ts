export interface AdminUserDto {
  id: number;
  email: string;
  fullName: string;
  isFirstLogin: boolean;
  firstLogin?: boolean;
}

export interface JwtAuthResponse {
  accessToken: string;
  token?: string;
  tokenType?: string;
  expiresInMs?: number;
  expirationMs?: number;
  user: AdminUserDto;
  adminUser?: AdminUserDto;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otpCode: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}
