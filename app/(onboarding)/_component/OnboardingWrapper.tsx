import React from "react";

function OnboardingWrapper({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <div className=" bg-whiteColor rounded-lg p-4 md:p-6 ">
        <div className="max-w-[345px]  mx-auto text-center">
          <h4 className="text-lg  md:text-xl lg:text-2xl font-medium text-headerColor">
            {title}
          </h4>
          {description && (
            <p className="text-descriptionColor text-base  mt-2">
              {description}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}

export default OnboardingWrapper;
