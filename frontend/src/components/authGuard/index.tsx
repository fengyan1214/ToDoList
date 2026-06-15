import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
export default function AuthGuard({ children }) {
  const token = useSelector(
    (state: { auth: { token: string | null } }) => state.auth.token,
  );
  if (!token) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}
