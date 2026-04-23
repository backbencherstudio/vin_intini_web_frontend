import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import baseApiSlice from "./slice/baseApi";
import onboardingSlice from "./slice/onboarding/onboardingSlice";
import postComposeSlice from "./slice/postCompose/postComposeSlice";

const rootReducer = combineReducers({
  [baseApiSlice.reducerPath]: baseApiSlice.reducer,
  onboarding: onboardingSlice,
  postCompose: postComposeSlice,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["onboarding", "postCompose"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApiSlice.middleware as any),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
