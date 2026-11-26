import { Suspense } from "react";
import LoginForm from "../_components/LoginForm";

function Page() {
  return (
    <div>
      <h4 className="text-lg md:text-xl lg:text-2xl font-semibold text-headerColor text-center max-w-93.75 mx-auto">
        Connecting the Minds Shaping the Brain Health Sciences.
      </h4>
      <Suspense fallback={<div className="py-8 text-center text-sm text-grayColor1">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

export default Page;
