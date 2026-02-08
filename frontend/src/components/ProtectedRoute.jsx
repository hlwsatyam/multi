import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../services/auth';

const ProtectedRoute = ({ children, role }) => {
  const user = getCurrentUser();

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If role is specified and user doesn't have it, redirect
  if (role && user.role !== role) {
    if (user.role === 'admin') {
      return <Navigate to="/admin" />;
    } else {
      return <Navigate to="/member" />;
    }
  }

  return children;
};

export default ProtectedRoute;