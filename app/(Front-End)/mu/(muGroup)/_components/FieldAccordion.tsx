"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FieldAccordionData {
  id: string;
  category: string;
  bulletPoints: string[];
}

interface FieldAccordionProps {
  field: FieldAccordionData;
}

export function FieldAccordion({ field }: FieldAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const detailsId = `field-details-${field.id}`;

  return (
    <>
      <div className="hidden w-full flex-col items-start gap-3 self-stretch border-b border-borderColor p-3 hover:bg-sectionColor md:flex">
        <h3 className="flex-1 text-2xl font-semibold leading-[130%] tracking-[0.12px] text-primaryColor">
          {field.category}
        </h3>
        <FieldBulletList points={field.bulletPoints} />
      </div>

      <div className="w-full border-b border-borderColor md:hidden">
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={detailsId}
          onClick={() => setIsOpen((open) => !open)}
          className="flex w-full items-center justify-between p-3 hover:bg-sectionColor"
        >
          <span className="flex-1 text-left text-lg font-semibold leading-[130%] tracking-[0.12px] text-primaryColor">
            {field.category}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`h-5 w-5 text-primaryColor transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div id={detailsId} hidden={!isOpen} className="px-3 pb-3">
          <FieldBulletList points={field.bulletPoints} compact />
        </div>
      </div>
    </>
  );
}

function FieldBulletList({
  points,
  compact = false,
}: {
  points: string[];
  compact?: boolean;
}) {
  return (
    <ul
      className={`flex flex-1 list-disc flex-col gap-2 pl-6 text-headerColor ${
        compact ? "text-sm" : "text-base"
      }`}
    >
      {points.map((point, index) => (
        <li key={`${index}-${point}`}>{point}</li>
      ))}
    </ul>
  );
}
