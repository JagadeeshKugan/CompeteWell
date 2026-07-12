import {
  authApiClient,
  RegisterPayload,
  LoginPayload,
  VerifyEmailPayload,
  ResetPasswordPayload,
  OnboardPayload,
  UserProfile,
  LoginResponse,
  RegisterResponse,
  GenericResponse,
} from "../lib/api/auth";

export const AuthService = {
  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    return authApiClient.register(payload);
  },

  async login(payload: LoginPayload): Promise<LoginResponse> {
    return authApiClient.login(payload);
  },

  async verifyEmail(payload: VerifyEmailPayload): Promise<GenericResponse> {
    return authApiClient.verifyEmail(payload);
  },

  async resendOtp(email: string): Promise<GenericResponse> {
    return authApiClient.resendOtp(email);
  },

  async forgotPassword(email: string): Promise<GenericResponse> {
    return authApiClient.forgotPassword(email);
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<GenericResponse> {
    return authApiClient.resetPassword(payload);
  },

  async onboard(payload: OnboardPayload): Promise<UserProfile> {
    return authApiClient.onboard(payload);
  },

  async logout(): Promise<GenericResponse> {
    return authApiClient.logout();
  },

  async getMe(): Promise<UserProfile> {
    return authApiClient.getMe();
  },
};
