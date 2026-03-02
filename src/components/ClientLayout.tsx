'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
};
