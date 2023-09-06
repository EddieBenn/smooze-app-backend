export interface UserPayload {
  id: string;
  email: string;
  verified: boolean;
  isLoggedIn?: boolean;
  role: string;
  is_premium: boolean;
}
