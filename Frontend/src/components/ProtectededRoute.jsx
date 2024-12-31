import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { currentUser } = useSelector((state) => state.user);

  if (currentUser) return children;
  else {
    return <Navigate to="/sign-in" />;
  }
}
