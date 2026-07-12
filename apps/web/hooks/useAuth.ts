import { useAuthContext } from "../store/auth-context";

export function useAuth() {
  return useAuthContext();
}
