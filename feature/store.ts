import { configureStore ,combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import baseApiSlice from "./slice/baseApi";
import onboardingSlice from "./slice/onboarding/onboardingSlice";
import { 
  persistStore, 
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER 
} from "redux-persist";

const rootReducer = combineReducers({
  [baseApiSlice.reducerPath]: baseApiSlice.reducer,
  onboarding:onboardingSlice   
})

const persistConfig={
  key:"root",
  version:1,
  storage,
  witelist:["onboarding"]

}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(baseApiSlice.middleware as any),
})

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;