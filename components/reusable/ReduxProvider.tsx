"use client";

import { store } from "@/feature/store";
import React from "react";
import { Toaster } from 'react-hot-toast';
import { Provider } from "react-redux";

function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Toaster />
      <Provider store={store}>{children}</Provider>
    </div>
  );
}

export default ReduxProvider;
