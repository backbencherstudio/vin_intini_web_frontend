"use client";

import { persistor, store } from "@/feature/store";
import React from "react";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Toaster />
      <Provider store={store}>
        {persistor ? (
          <PersistGate loading={null} persistor={persistor}>
            {children}
          </PersistGate>
        ) : (
          children
        )}
      </Provider>
    </div>
  );
}

export default ReduxProvider;
