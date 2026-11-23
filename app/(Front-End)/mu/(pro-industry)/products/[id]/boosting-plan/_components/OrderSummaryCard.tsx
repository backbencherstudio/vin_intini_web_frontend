"use client";

import { OrderSummary } from "@/types/boosting";
import { FileText } from "lucide-react";
import Image from "next/image";

interface OrderSummaryCardProps {
  orderSummary: OrderSummary;
  entityType?: "products" | "publications";
}

export default function OrderSummaryCard({
  orderSummary,
  entityType = "products",
}: OrderSummaryCardProps) {
  const isPublication =
    entityType === "publications" ||
    orderSummary.target_type === "publication" ||
    Boolean(orderSummary.publication_id);

  const displayName =
    orderSummary.product_name ||
    orderSummary.title ||
    (isPublication ? "Publication" : "Product");

  const displayId =
    (isPublication ? orderSummary.publication_id : null) ||
    orderSummary.product_id ||
    orderSummary.publication_id ||
    "";

  const idLabel =
    orderSummary.identifier_label ||
    (isPublication ? "Publication ID" : "Product ID");

  const isPdf =
    orderSummary.product_image &&
    orderSummary.product_image.toLowerCase().endsWith(".pdf");

  return (
    <div className="bg-gray-50/70 border border-borderColor rounded-xl p-4 md:p-6 space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-semibold text-headerColor mb-3">
          Order Summary
        </h2>
        <div className="w-full h-px bg-borderColor" />
      </div>

      {/* Item Information */}
      <div className="flex items-center gap-3.5 bg-white p-3.5 rounded-lg border border-borderColor/80 shadow-xs">
        <div className="w-14 h-12 rounded-lg bg-bgColor overflow-hidden shrink-0 flex items-center justify-center border border-borderColor/60">
          {orderSummary.product_image && !isPdf ? (
            <Image
              src={orderSummary.product_image}
              alt={displayName}
              width={56}
              height={48}
              className="w-full h-full object-cover"
            />
          ) : isPublication ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-teal-50 text-primaryColor">
              <FileText className="w-6 h-6 text-primaryColor" />
            </div>
          ) : (
            <span className="text-sm font-bold text-primaryColor">
              {(displayName || "P").charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="font-semibold text-sm text-headerColor truncate"
            title={displayName}
          >
            {displayName}
          </p>
          <p className="text-xs text-descriptionColor font-medium mt-0.5">
            {idLabel}: {displayId}
          </p>
        </div>
      </div>

      {/* Plan Info */}
      <div className="flex justify-between items-start pt-1">
        <div>
          <p className="text-base font-bold text-headerColor">
            {orderSummary.plan_title}
          </p>
          <p className="text-xs text-primaryColor font-semibold mt-1">
            {orderSummary.estimated_impressions} • {orderSummary.duration_text}
          </p>
        </div>
        <span className="text-base font-semibold text-headerColor">
          {orderSummary.subtotal_formatted}
        </span>
      </div>

      <div className="w-full h-px bg-borderColor" />

      {/* Subtotal & VAT */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm md:text-base">
          <span className="font-medium text-headerColor">Subtotal</span>
          <span className="font-semibold text-headerColor">
            {orderSummary.subtotal_formatted}
          </span>
        </div>
        <div className="flex justify-between text-sm md:text-base">
          <span className="font-medium text-headerColor">VAT</span>
          <span className="font-semibold text-headerColor">
            {orderSummary.vat_formatted}
          </span>
        </div>
      </div>

      <div className="w-full h-px bg-borderColor" />

      {/* Total */}
      <div className="flex justify-between items-start pt-1">
        <div>
          <p className="text-base font-semibold text-headerColor">Total</p>
          <p className="text-xs text-gray-400 mt-0.5">Including taxes</p>
        </div>
        <span className="text-2xl font-bold text-primaryColor">
          {orderSummary.total_formatted}
        </span>
      </div>
    </div>
  );
}
