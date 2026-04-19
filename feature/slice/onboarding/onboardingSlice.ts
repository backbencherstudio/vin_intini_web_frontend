import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnboardingState {
  formData: Record<string, any>;
  currentStep: number;
}

const initialState: OnboardingState = {
  formData: {},
  currentStep: 1,
};

export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<Record<string, any>>) => {
      state.formData = {
        ...state.formData,
        ...action.payload,
      };
    },
    setStep: (state, action: PayloadAction<number>) => {
      state.currentStep = Math.max(state.currentStep, action.payload);
    },

    onboardingReset: () => initialState,
  },
});

export const { updateFormData, setStep, onboardingReset } =
  onboardingSlice.actions;
export default onboardingSlice.reducer;
