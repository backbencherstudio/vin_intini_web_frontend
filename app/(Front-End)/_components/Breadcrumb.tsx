"use client";

import { scrollToTop } from "@/lib/utils";
import { DoubleArrowIcon } from "@/public/svgIcons/Icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { useBreadcrumbCustomTitle } from "@/lib/breadcrumbStore";

// Static mapping for common slugs across the app
const LABEL_MAP: Record<string, string> = {
  home: "Home",
  mu: "Home",
  message: "Messages",
  "industry-message": "Messages",
  jobs: "Jobs",
  "job-listing": "Job Listing",
  "post-job-position": "Post a Job Position",
  about: "About Us",
  "about-us": "About Us",
  "contact-us": "Contact Us",
  academia: "Academia",
  "my-network": "My Network",
  "my-connection": "My Connection",
  "psychology-network": "Psychology Network",
  fields: "Fields",
  careers: "Careers",
  industry: "Industry",
  "industry-profile": "Industry Profile",
  "industry-setting": "Industry Settings",
  "recruiter-dashboard": "Recruiter Dashboard",
  "neuroscience-network": "Neuroscience Network",
  notification: "Notifications",
  settings: "Settings",
  profile: "Profile",
  chat: "Chat",
  "jobs-details": "Job Details",
  "post-baccalaureate-programs": "Post-Baccalaureate Programs",
  products: "Products",
  "create-products": "Create Product",
  "boosting-plan": "Boosting Plan",
  publications: "Publications",
  advertisment: "Advertisement",
  analytics: "Analytics",
  "archive-jobs": "Archive Jobs",
  applicants: "Applicants",
  applicant: "Applicant",
  "custom-apply": "Apply for Job",
  edit: "Edit",
  "create-company-page": "Company Page",
};

/**
 * Checks if a URL slug is a dynamic identifier (numeric ID, UUID, hex hash)
 */
export function isDynamicId(slug: string): boolean {
  if (!slug) return false;
  // Numeric ID (e.g., 58, 104)
  if (/^\d+$/.test(slug)) return true;
  // Standard UUID format
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      slug
    )
  )
    return true;
  // 24-character hex ID (e.g., MongoDB/BSON ObjectIds)
  if (/^[0-9a-f]{24}$/i.test(slug)) return true;
  return false;
}

/**
 * Converts a slug into a readable label using LABEL_MAP or Title Case
 */
export function toLabel(slug: string): string {
  if (LABEL_MAP[slug]) return LABEL_MAP[slug];
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Produces contextual labels when an action follows an entity ID
 * (e.g. /job-listing/58/edit -> "Edit Job Position", /products/12/edit -> "Edit Product")
 */
function getContextualActionLabel(parentSlug: string, actionSlug: string): string {
  const normParent = (parentSlug || "").toLowerCase();
  const normAction = (actionSlug || "").toLowerCase();

  if (normAction === "edit") {
    if (normParent.includes("job")) return "Edit Job Position";
    if (normParent.includes("product")) return "Edit Product";
    if (normParent.includes("publication")) return "Edit Publication";
    if (normParent.includes("company")) return "Edit Company Page";
    if (normParent.includes("profile")) return "Edit Profile";
    return `Edit ${toLabel(parentSlug)}`;
  }

  if (normAction === "job-details") return "Job Details";
  if (normAction === "applicants") return "Applicants";
  if (normAction === "boosting-plan") return "Boosting Plan";
  if (normAction === "custom-apply") return "Apply for Job";
  if (normAction === "archive-jobs") return "Archive Jobs";
  if (normAction === "create-products") return "Create Product";

  return toLabel(actionSlug);
}

/**
 * Entity detail labels when ID is terminal
 */
function getDetailsLabel(parentSlug: string): string {
  const normParent = (parentSlug || "").toLowerCase();
  if (normParent === "applicant") return "Applicant Details";
  if (normParent.includes("job")) return "Job Details";
  if (normParent.includes("product")) return "Product Details";
  if (normParent.includes("publication")) return "Publication Details";
  if (normParent.includes("profile")) return "Profile";
  if (normParent.includes("message")) return "Messages";
  if (normParent.includes("company")) return "Company Profile";
  return toLabel(parentSlug);
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function buildBreadcrumbs(
  pathname: string,
  customTitle?: string | null
): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [];

  const items: BreadcrumbItem[] = [];
  let pathSoFar = "";

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    pathSoFar += `/${seg}`;

    // Root segment "mu" -> "Home"
    if (seg === "mu") {
      items.push({
        label: "Home",
        href: "/mu/home",
      });
      continue;
    }

    // Skip redundant /mu/home
    if (seg === "home" && segments[i - 1] === "mu") {
      continue;
    }

    // Dynamic ID check
    if (isDynamicId(seg)) {
      const prevSeg = segments[i - 1] || "";
      const nextSeg = segments[i + 1];

      if (nextSeg) {
        // An action/subpage follows this ID (e.g. /job-listing/58/edit or /jobs-details/58/custom-apply)
        // If parent is a prefix-only route (e.g. jobs-details), update parent's link to include ID
        if (items.length > 0 && prevSeg === "jobs-details") {
          items[items.length - 1].href = pathSoFar;
        }
        // Do not add the raw ID to the breadcrumb
        continue;
      } else {
        // Terminal ID (e.g. /jobs-details/58, /products/12, /applicant/104)
        if (customTitle) {
          items.push({
            label: customTitle,
            href: pathSoFar,
          });
        } else if (prevSeg === "products" || prevSeg === "publications") {
          items.push({
            label: getDetailsLabel(prevSeg),
            href: pathSoFar,
          });
        } else if (prevSeg === "applicant") {
          if (items.length > 0 && items[items.length - 1].label === "Applicant") {
            items[items.length - 1].label = "Applicant Details";
            items[items.length - 1].href = pathSoFar;
          } else {
            items.push({
              label: "Applicant Details",
              href: pathSoFar,
            });
          }
        } else if (items.length > 0) {
          // Update the previous node's href to the full path so it links to the real entity
          items[items.length - 1].href = pathSoFar;
        }
        continue;
      }
    }

    // Non-ID segment: check if it's an action following an ID
    const prevSeg = segments[i - 1];
    const prevIsId = prevSeg ? isDynamicId(prevSeg) : false;

    if (prevIsId) {
      const entitySeg = segments[i - 2] || "";
      const actionLabel = getContextualActionLabel(entitySeg, seg);
      items.push({
        label: actionLabel,
        href: pathSoFar,
      });
      continue;
    }

    // Standard slug
    items.push({
      label: toLabel(seg),
      href: pathSoFar,
    });
  }

  return items;
}

export default function Breadcrumb({ className = "" }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const customTitle = useBreadcrumbCustomTitle(pathname);

  const items = buildBreadcrumbs(pathname, customTitle);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      const parentHref =
        items.length > 1 ? items[items.length - 2].href : "/mu/home";
      router.push(parentHref);
    }
  };

  return (
    <div
      className={`flex gap-6 truncate items-center my-4 md:my-6 ${className}`}
    >
      <button
        type="button"
        onClick={handleBack}
        className="flex text-sm cursor-pointer gap-1 font-semibold text-headerColor items-center hover:opacity-80 transition-opacity"
      >
        <IoIosArrowBack />
        Back
      </button>
      <div className="flex gap-1 text-sm items-center">
        {items.map((item, i) => (
          <span
            key={`${item.href}-${i}`}
            className="flex text-nowrap items-center gap-1"
          >
            {i > 0 && <DoubleArrowIcon />}
            {i === items.length - 1 ? (
              <span className="text-headerColor font-medium max-w-[200px] md:max-w-[320px] truncate">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:underline text-grayColor1 hover:text-headerColor transition-colors"
                onClick={item.href === "/mu/home" ? scrollToTop : undefined}
              >
                {item.label}
              </Link>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
