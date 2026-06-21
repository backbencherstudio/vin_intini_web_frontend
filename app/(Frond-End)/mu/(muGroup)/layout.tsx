import Loading from "@/components/reusable/Loader";
import { Suspense } from "react";

export default function FrontEndLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="h-full w-full">
        <div className="">
          <div className=" h-full">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
