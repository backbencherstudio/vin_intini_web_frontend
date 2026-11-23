"use client";

import { TwoFactorSuccessIcon } from "@/public/svgIcons/AdminIcon";
import { OrderSummary } from "@/types/boosting";
import Link from "next/link";

interface PaymentSuccessStepProps {
  productId: string | number;
  entityType?: "products" | "publications";
  orderSummary: OrderSummary | null;
  backHref?: string;
  onDone?: () => void;
}

export default function PaymentSuccessStep({
  productId,
  entityType = "products",
  orderSummary,
  backHref,
  onDone,
}: PaymentSuccessStepProps) {
  const isPublication = entityType === "publications";
  const defaultReturnHref = isPublication ? "/mu/publications" : "/mu/products";
  const returnHref = backHref || defaultReturnHref;
  const isPremiumFlow = backHref?.includes("/premium");

  return (
    <div className="max-w-xl mx-auto py-12 px-4 md:px-6 bg-white rounded-2xl border border-borderColor shadow-xs text-center space-y-6 animate-in zoom-in-95 duration-200">
      <div className="w-20 h-20 bg-primaryColor/10 p-4 rounded-full flex items-center justify-center text-4xl mx-auto shadow-xs">
        <TwoFactorSuccessIcon className="stroke-3" />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-headerColor">Payment Process</h2>
        <p className="text-emerald-600 font-bold text-lg mt-1">
          Payment Successful
        </p>
      </div>

      <p className="text-sm text-descriptionColor leading-relaxed max-w-md mx-auto">
        {isPublication
          ? "Your publication boost campaign is now active! It will receive priority visibility and outreach across the Mind Unite professional network."
          : "Your product boost campaign is now active! It will receive priority visibility and outreach across the Mind Unite professional network."}
      </p>

      {orderSummary && (
        <div className="bg-gray-50/70 border border-borderColor rounded-xl p-5 text-sm text-left space-y-2 text-headerColor ">
          <div className="flex justify-between gap-1">
            <h4 className="text-descriptionColor">{isPublication ? "Publication:" : "Product:"}</h4>
            <p className="font-bold text-headerColor">
              {orderSummary.product_name || orderSummary.title}
            </p>
          </div>
          <div className="flex justify-between gap-1">
            <h4 className="text-descriptionColor">{isPublication ? "Publication ID:" : "Product ID:"}</h4>
            <p className="font-semibold text-headerColor">
              {(isPublication ? orderSummary.publication_id : null) ||
                orderSummary.product_id ||
                orderSummary.publication_id}
            </p>
          </div>
          <div className="flex justify-between gap-1">
            <h4 className="text-descriptionColor">Plan:</h4>
            <p className="font-semibold text-headerColor">
              {orderSummary.plan_title}
            </p>
          </div>
          <div className="flex justify-between gap-1">
            <h4 className="text-descriptionColor">Duration:</h4>
            <p className="font-semibold text-headerColor">
              {orderSummary.duration_text}
            </p>
          </div>
          <div className="flex justify-between pt-2 border-t border-borderColor font-bold text-sm">
            <h4 className="text-descriptionColor">Total Paid:</h4>
            <p className="text-primaryColor">{orderSummary.total_formatted}</p>
          </div>
        </div>
      )}

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={returnHref}
          onClick={() => onDone?.()}
          className="w-full sm:w-1/2 py-3.5 rounded-lg bg-primaryColor hover:bg-primaryColor/90 text-white font-bold text-sm transition shadow-xs cursor-pointer text-center"
        >
          {isPublication ? "Return to Publications" : "Return to Products"}
        </Link>
        <Link
          href={
            isPremiumFlow
              ? "/mu/neuroscience-network/industry/publications"
              : "/mu/advertisment"
          }
          onClick={() => onDone?.()}
          className="w-full sm:w-1/2 py-3.5 rounded-lg border border-borderColor hover:bg-gray-50 text-headerColor font-bold text-sm transition shadow-xs cursor-pointer text-center"
        >
          {isPremiumFlow ? "View in Feed" : "View Campaigns"}
        </Link>
      </div>
    </div>
  );
}
