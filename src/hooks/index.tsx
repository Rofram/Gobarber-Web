import React from 'react';

import { AuthProvider } from './Auth';
import { ToastProvider } from './Toast';

export const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>{children}</ToastProvider>
  </AuthProvider>
);
