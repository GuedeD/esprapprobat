import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
``;

const ProtectedRoute = ({ children, adminRequired }) => {
  const { userInfo } = useSelector((state) => state.projet);
  if (!userInfo) {
    return <Navigate to="/connexion" replace />;
  }

  if (adminRequired && userInfo.role !== "administrateur") {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
