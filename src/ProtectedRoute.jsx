// ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { auth } from './firebase'; // Import Firebase auth instance

const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser; // Get current user
  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
