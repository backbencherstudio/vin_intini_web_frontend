import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OnboardingState {
  stepOne: any;
  stepTwo: any;
  stepThree: any;
  stepFour: any;
  stepFive: any;
  stepSix: any;
  stepSeven: any;
}

const initialState: OnboardingState = {
  stepOne: {},
  stepTwo: {},
  stepThree: {},
  stepFour: {},
  stepFive: {},
  stepSix: {},
  stepSeven: {},
};

export const onboardingSlice = createSlice({
  name: "onboarding",
  initialState,
  reducers: {
    setStepData: (
      state,
      action: PayloadAction<{ step: keyof OnboardingState; data: any }>,
    ) => {
      const { step, data } = action.payload;
      state[step] = data;
    },
    //  reset the onboarding state to initial state
    onboardingReset: () => initialState,
  },
});

export const { setStepData, onboardingReset } = onboardingSlice.actions;
export default onboardingSlice.reducer;
