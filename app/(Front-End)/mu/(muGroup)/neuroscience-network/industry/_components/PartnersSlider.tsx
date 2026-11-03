"use client";

import { useGetAllPartnersQuery } from "@/feature/slice/biotechnologySlice";
import Image from "next/image";
import Marquee from "react-fast-marquee";

interface Partner {
  id: string | number;
  name?: string;
  partner_name?: string;
  title?: string;
  slug?: string;
  logo?: string;
  partner_logo?: string;
  image?: string;
  website?: string;
  website_url?: string;
  tagline?: string;
}

export default function PartnersSlider() {
  const { data, isLoading } = useGetAllPartnersQuery();
  const partners: Partner[] = data?.partners || [];

  if (isLoading) {
    return (
      <div className="w-full mb-6 border-b border-borderColor h-[66px] pb-3 flex items-center">
        <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12 w-full">
          <div className="w-full text-center md:col-span-5 md:text-left lg:col-span-4">
            <h3 className="text-lg sm:text-xl font-semibold leading-tight text-headerColor">
              Mind Unite Partners
            </h3>
          </div>
          <div className="w-full md:col-span-7 lg:col-span-8 flex items-center gap-2">
            <div className="h-9 w-9 rounded-md bg-slate-100 animate-pulse" />
            <div className="h-9 w-9 rounded-md bg-slate-100 animate-pulse" />
            <div className="h-9 w-9 rounded-md bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-6 border-b border-borderColor h-[66px] pb-3 flex items-center">
      <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12 w-full">
        {/* Left Side: Header & Text */}
        <div className="w-full text-center md:col-span-5 md:text-left lg:col-span-4">
          <h3 className="text-lg sm:text-xl font-semibold leading-tight text-headerColor">
            Mind Unite Partners
          </h3>
        </div>

        {/* Right Side: Marquee Slider */}
        <div className="w-full overflow-hidden md:col-span-7 lg:col-span-8 flex items-center">
          {partners.length > 0 ? (
            <Marquee
              gradient={true}
              gradientWidth={40}
              gradientColor="#fff"
              speed={45}
              pauseOnHover={true}
              className="flex items-center"
            >
              {partners.map((partner, index) => {
                const imageUrl =
                  partner?.logo ||
                  partner?.partner_logo ||
                  partner?.image ||
                  "/placeholder.png";
                const partnerName =
                  partner?.name ||
                  partner?.partner_name ||
                  partner?.title ||
                  `Partner ${index + 1}`;
                const websiteUrl = partner?.website_url || partner?.website;
                const targetUrl = websiteUrl || `/mu/industry/${partner?.id}`;
                const isExternal = Boolean(websiteUrl);

                return (
                  <a
                    key={partner.id || index}
                    href={targetUrl}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    title={`${partnerName}${websiteUrl ? ` • ${websiteUrl}` : ""}`}
                    className="relative mx-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white p-1 overflow-hidden transition-transform duration-200 hover:scale-105 cursor-pointer"
                  >
                    <Image
                      src={imageUrl}
                      alt={partnerName}
                      width={80}
                      height={80}
                      className="h-full w-full object-contain rounded-md"
                      unoptimized
                    />
                  </a>
                );
              })}
            </Marquee>
          ) : (
            <p className="text-center text-sm text-gray-400">
              No partners found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
