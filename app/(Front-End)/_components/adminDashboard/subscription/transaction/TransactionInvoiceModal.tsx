"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CustomBadge from "@/components/reusable/dashboard/CustomBadge";
import { useGetTransactionDetailQuery } from "@/feature/slice/admin/subscription/subscriptionApi";
import { Transaction } from "@/feature/slice/admin/subscription/subscriptionType";
import emptyUserImg from "@/public/empty_user.jpg";
import mindUniteLogo from "@/public/logo.png";
import toast from "react-hot-toast";
import {
  Building2,
  Calendar,
  Check,
  Copy,
  CreditCard,
  Crown,
  Download,
  ExternalLink,
  Eye,
  Globe,
  Layers,
  Loader2,
  Mail,
  MapPin,
  MousePointerClick,
  Package,
  Printer,
  Rocket,
  ShieldCheck,
  User,
} from "lucide-react";

interface TransactionInvoiceModalProps {
  open: boolean;
  transactionId: number | null;
  initialData?: Transaction | null;
  onClose: () => void;
}

const escapeHtml = (value: unknown): string => {
  const str = String(value ?? "");
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};

const formatCurrency = (amount: string | number | undefined, currency = "USD") => {
  const num = Number(amount ?? 0);
  if (!Number.isFinite(num)) return `${currency} ${amount ?? "0.00"}`;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(num);
  } catch {
    return `$${num.toFixed(2)}`;
  }
};

const formatDateTime = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatShortDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatStatusLabel = (status?: string) => {
  switch (status) {
    case "succeeded":
      return "Paid";
    case "failed":
      return "Failed";
    case "refunded":
    case "partially_refunded":
      return "Refunded";
    case "pending":
    default:
      return "Pending";
  }
};

const formatCardBrand = (brand?: string | null) => {
  if (!brand) return "Card";
  const normalized = brand.toLowerCase();
  if (normalized === "visa") return "VISA";
  if (
    normalized === "mastercard" ||
    normalized === "master_card" ||
    normalized === "mc"
  )
    return "Mastercard";
  if (normalized === "amex" || normalized === "american_express")
    return "American Express";
  if (normalized === "paypal") return "PayPal";
  return brand.toUpperCase();
};

const campaignStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "active" as const;
    case "completed":
      return "blue" as const;
    case "paused":
      return "yellow" as const;
    case "cancelled":
    case "canceled":
    case "failed":
      return "suspended" as const;
    default:
      return "gray" as const;
  }
};

export default function TransactionInvoiceModal({
  open,
  transactionId,
  initialData,
  onClose,
}: TransactionInvoiceModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const {
    currentData: detailResp,
    isLoading,
    isFetching,
  } = useGetTransactionDetailQuery(transactionId ?? 0, {
    skip: !open || !transactionId,
  });

  const matchedDetail =
    detailResp?.data && detailResp.data.id === transactionId
      ? detailResp.data
      : null;
  const matchedInitial =
    initialData && initialData.id === transactionId ? initialData : null;
  const txn: Transaction | null = matchedDetail ?? matchedInitial ?? null;

  const markImageFailed = (url?: string | null) => {
    if (!url) return;
    setFailedImages((prev) => (prev[url] ? prev : { ...prev, [url]: true }));
  };

  const handleCopy = (text: string, key: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const loadImageAsDataUrl = (
    src: string,
    trimTransparent = false,
  ): Promise<{ dataUrl: string; width: number; height: number } | null> =>
    new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        try {
          const w = img.naturalWidth || 300;
          const h = img.naturalHeight || 80;
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(null);
          ctx.drawImage(img, 0, 0);

          if (trimTransparent) {
            const { data } = ctx.getImageData(0, 0, w, h);
            let minX = w;
            let minY = h;
            let maxX = 0;
            let maxY = 0;
            for (let y = 0; y < h; y++) {
              for (let x = 0; x < w; x++) {
                if (data[(y * w + x) * 4 + 3] > 10) {
                  if (x < minX) minX = x;
                  if (x > maxX) maxX = x;
                  if (y < minY) minY = y;
                  if (y > maxY) maxY = y;
                }
              }
            }
            if (maxX > minX && maxY > minY) {
              const cropW = maxX - minX + 1;
              const cropH = maxY - minY + 1;
              const trimmed = document.createElement("canvas");
              trimmed.width = cropW;
              trimmed.height = cropH;
              const tCtx = trimmed.getContext("2d");
              if (tCtx) {
                tCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
                return resolve({
                  dataUrl: trimmed.toDataURL("image/png"),
                  width: cropW,
                  height: cropH,
                });
              }
            }
          }

          resolve({
            dataUrl: canvas.toDataURL("image/png"),
            width: w,
            height: h,
          });
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = src;
    });

  const handleDownloadPdf = async () => {
    if (!txn || isDownloadingPdf) return;
    setIsDownloadingPdf(true);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 16;
      const contentW = pageW - margin * 2;
      const isBoosting = txn.type === "boosting";
      const statusLabel = formatStatusLabel(txn.status);
      const invNo = txn.invoice_number || `INV-${txn.id}`;
      const curr = txn.currency || "USD";
      const refunded = Number(txn.refunded_amount ?? 0);
      const net =
        txn.net_amount ?? Math.max(0, Number(txn.amount) - refunded).toFixed(2);

      // Top brand accent bar
      doc.setFillColor(4, 161, 183);
      doc.rect(0, 0, pageW, 3.5, "F");

      let y = 14;

      // Official MindUnite logo (auto-trimmed transparent padding for exact alignment)
      const logoAsset = await loadImageAsDataUrl(mindUniteLogo.src, true);
      if (logoAsset) {
        const targetH = 10.5;
        const aspect = logoAsset.width / logoAsset.height;
        let logoH = targetH;
        let logoW = targetH * aspect;
        if (logoW > 58) {
          logoW = 58;
          logoH = logoW / aspect;
        }
        doc.addImage(logoAsset.dataUrl, "PNG", margin, y, logoW, logoH);
      } else {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(4, 161, 183);
        doc.text("MindUnite", margin, y + 8);
      }

      // Brand sub-text
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(
        txn.issued_by?.tagline || "Psychology & Neuroscience Professional Network",
        margin,
        y + 15.5,
      );
      doc.text(txn.issued_by?.email || "billing@mindunite.com", margin, y + 20);

      // Right letterhead: INVOICE + Number + Badges
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(4, 161, 183);
      doc.text(
        isBoosting ? "BOOSTING INVOICE & RECEIPT" : "SUBSCRIPTION INVOICE & RECEIPT",
        pageW - margin,
        y + 3,
        { align: "right" },
      );

      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text(invNo, pageW - margin, y + 10.5, { align: "right" });

      // Status & Type badge pills
      const statusText = statusLabel.toUpperCase();
      const typeText = isBoosting ? "BOOSTING" : "SUBSCRIPTION";
      doc.setFontSize(7.5);
      const statusW = doc.getTextWidth(statusText) + 7;
      const typeW = doc.getTextWidth(typeText) + 7;

      const statusFill: [number, number, number] =
        txn.status === "succeeded"
          ? [236, 253, 245]
          : txn.status === "failed"
            ? [254, 242, 242]
            : [255, 251, 235];
      const statusFg: [number, number, number] =
        txn.status === "succeeded"
          ? [4, 120, 87]
          : txn.status === "failed"
            ? [185, 28, 28]
            : [180, 83, 9];

      doc.setFillColor(...statusFill);
      doc.roundedRect(pageW - margin - statusW, y + 14, statusW, 5.5, 2.5, 2.5, "F");
      doc.setTextColor(...statusFg);
      doc.text(statusText, pageW - margin - statusW / 2, y + 17.8, { align: "center" });

      const typeFill: [number, number, number] = isBoosting
        ? [236, 254, 255]
        : [245, 243, 255];
      const typeFg: [number, number, number] = isBoosting
        ? [14, 116, 144]
        : [109, 40, 217];
      doc.setFillColor(...typeFill);
      doc.roundedRect(
        pageW - margin - statusW - typeW - 2.5,
        y + 14,
        typeW,
        5.5,
        2.5,
        2.5,
        "F",
      );
      doc.setTextColor(...typeFg);
      doc.text(typeText, pageW - margin - statusW - 2.5 - typeW / 2, y + 17.8, {
        align: "center",
      });

      y += 27.5;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageW - margin, y);
      y += 6;

      // 4-Column Executive Summary Strip
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentW, 17, 2.5, 2.5, "FD");

      const stripCols = [
        { k: "INVOICE DATE", v: formatShortDate(txn.created_at || txn.purchased_at) },
        { k: "PAID ON", v: formatShortDate(txn.purchased_at) },
        {
          k: "PAYMENT METHOD",
          v: `${formatCardBrand(txn.card_brand)}${txn.card_last4 ? ` •••• ${txn.card_last4}` : ""}`,
        },
        { k: "AMOUNT PAID", v: `${formatCurrency(net, curr)} ${curr}`, highlight: true },
      ];
      const colW = contentW / 4;
      stripCols.forEach((col, i) => {
        const cx = margin + i * colW + 4;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(col.k, cx, y + 6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(col.highlight ? 10.5 : 9.5);
        if (col.highlight) {
          doc.setTextColor(4, 161, 183);
        } else {
          doc.setTextColor(15, 23, 42);
        }
        doc.text(col.v, cx, y + 12.5);
      });

      y += 23;

      // Two-Column Parties Cards
      const halfW = (contentW - 6) / 2;
      const partyBoxH = 26;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, halfW, partyBoxH, 2.5, 2.5, "FD");
      doc.roundedRect(margin + halfW + 6, y, halfW, partyBoxH, 2.5, 2.5, "FD");

      // Left: Customer
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text("BILLED TO (CUSTOMER)", margin + 4, y + 6);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text(txn.subscriber?.name || "Unknown User", margin + 4, y + 12.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(71, 85, 105);
      if (txn.subscriber?.email) {
        doc.text(txn.subscriber.email, margin + 4, y + 17.5);
      }
      if (txn.subscriber?.username) {
        doc.text(`@${txn.subscriber.username}`, margin + 4, y + 22);
      }

      // Right: Industry or Issued By
      const rx = margin + halfW + 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      if (isBoosting && txn.boosting?.industry) {
        doc.text("INDUSTRY / ORGANIZATION", rx, y + 6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42);
        doc.text(txn.boosting.industry.name, rx, y + 12.5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        if (txn.boosting.industry.address) {
          doc.text(txn.boosting.industry.address, rx, y + 17.5);
        }
        if (txn.boosting.industry.website) {
          doc.text(txn.boosting.industry.website, rx, y + 22);
        }
      } else {
        doc.text("ISSUED BY", rx, y + 6);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42);
        doc.text(txn.issued_by?.name || "MindUnite", rx, y + 12.5);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(
          txn.issued_by?.tagline || "Psychology & Neuroscience Network",
          rx,
          y + 17.5,
        );
        doc.text(txn.issued_by?.email || "billing@mindunite.com", rx, y + 22);
      }

      y += partyBoxH + 6;

      // Context Details Box (Boosting Campaign OR Subscription)
      if (isBoosting && txn.boosting) {
        const boxH = 34;
        doc.setFillColor(246, 253, 254);
        doc.setDrawColor(165, 243, 252);
        doc.roundedRect(margin, y, contentW, boxH, 2.5, 2.5, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(14, 116, 144);
        doc.text(
          `BOOSTING CAMPAIGN #${txn.boosting.campaign_id}`,
          margin + 4,
          y + 6.5,
        );
        doc.text(
          `Campaign: ${(txn.boosting.campaign_status || "Pending").toUpperCase()}`,
          pageW - margin - 4,
          y + 6.5,
          { align: "right" },
        );

        doc.setDrawColor(207, 250, 254);
        doc.line(margin + 4, y + 9, pageW - margin - 4, y + 9);

        const prodLabel = txn.boosting.item?.name
          ? `${txn.boosting.item.name}${txn.boosting.item.code ? ` (#${txn.boosting.item.code})` : ""}`
          : "—";

        const detailsLeft = [
          { k: "Boosted Product", v: prodLabel },
          {
            k: "Network & Placements",
            v: `${txn.boosting.network_type ? txn.boosting.network_type.toUpperCase() : "—"}${txn.boosting.placements?.length ? ` • ${txn.boosting.placements.join(", ")}` : ""}`,
          },
        ];
        const detailsRight = [
          {
            k: "Package & Duration",
            v: `${txn.boosting.package_name} (${txn.boosting.duration_days} days)`,
          },
          {
            k: "Active Window",
            v: `${formatShortDate(txn.boosting.starts_at)} — ${formatShortDate(txn.boosting.ends_at)}`,
          },
        ];

        detailsLeft.forEach((d, idx) => {
          const dy = y + 14.5 + idx * 10;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.2);
          doc.setTextColor(100, 116, 139);
          doc.text(d.k, margin + 4, dy);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(15, 23, 42);
          const clipped = doc.splitTextToSize(d.v, halfW - 6)[0] || d.v;
          doc.text(clipped, margin + 4, dy + 4);
        });

        detailsRight.forEach((d, idx) => {
          const dy = y + 14.5 + idx * 10;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.2);
          doc.setTextColor(100, 116, 139);
          doc.text(d.k, rx, dy);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.5);
          doc.setTextColor(15, 23, 42);
          const clipped = doc.splitTextToSize(d.v, halfW - 6)[0] || d.v;
          doc.text(clipped, rx, dy + 4);
        });

        y += boxH + 7;
      } else if (txn.plan || txn.subscription) {
        const boxH = 30;
        doc.setFillColor(250, 248, 255);
        doc.setDrawColor(221, 214, 254);
        doc.roundedRect(margin, y, contentW, boxH, 2.5, 2.5, "FD");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(109, 40, 217);
        doc.text("SUBSCRIPTION DETAILS", margin + 4, y + 6.5);
        if (txn.subscription?.status) {
          doc.text(
            `Subscription: ${txn.subscription.status.toUpperCase()}`,
            pageW - margin - 4,
            y + 6.5,
            { align: "right" },
          );
        }

        doc.setDrawColor(237, 233, 254);
        doc.line(margin + 4, y + 9, pageW - margin - 4, y + 9);

        const subCols = [
          { k: "Plan", v: txn.plan?.name || "—" },
          { k: "Billing Cycle", v: (txn.plan?.billing_cycle || "—").toUpperCase() },
          {
            k: "Billing Period",
            v: `${formatShortDate(txn.subscription?.current_period_start)} — ${formatShortDate(txn.subscription?.current_period_end)}`,
          },
        ];
        const sw = contentW / 3;
        subCols.forEach((sc, idx) => {
          const sx = margin + 4 + idx * sw;
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.2);
          doc.setTextColor(100, 116, 139);
          doc.text(sc.k, sx, y + 15);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8.8);
          doc.setTextColor(15, 23, 42);
          doc.text(sc.v, sx, y + 20);
        });

        y += boxH + 7;
      }

      // Itemized Line Items Table
      const lineItems =
        txn.line_items && txn.line_items.length > 0
          ? txn.line_items
          : [
              {
                title: isBoosting
                  ? `${txn.boosting?.package_name || "Product Boost"} — Ad Campaign #${txn.boosting?.campaign_id ?? ""}`
                  : `${txn.plan?.name || "Subscription"} Subscription`,
                description: isBoosting
                  ? [
                      txn.boosting?.item?.name
                        ? `Boosted Item: ${txn.boosting.item.name}`
                        : "",
                      txn.boosting?.duration_days
                        ? `Duration: ${txn.boosting.duration_days} days`
                        : "",
                      txn.boosting?.network_type
                        ? `${txn.boosting.network_type} network`
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" • ")
                  : txn.plan?.billing_cycle
                    ? `${txn.plan.billing_cycle} billing`
                    : "Recurring plan",
                quantity: 1,
                unit_price: txn.amount,
                total: txn.amount,
              },
            ];

      // Table Header
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.rect(margin, y, contentW, 8, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text("#", margin + 3, y + 5.2);
      doc.text("DESCRIPTION", margin + 11, y + 5.2);
      doc.text("QTY", pageW - margin - 52, y + 5.2, { align: "right" });
      doc.text("UNIT PRICE", pageW - margin - 27, y + 5.2, { align: "right" });
      doc.text("AMOUNT", pageW - margin - 3, y + 5.2, { align: "right" });
      y += 8;

      lineItems.forEach((item, idx) => {
        const descLines = item.description
          ? doc.splitTextToSize(item.description, contentW - 76)
          : [];
        const rowH = Math.max(13, 9 + descLines.length * 4);
        doc.setDrawColor(241, 245, 249);
        doc.line(margin, y + rowH, pageW - margin, y + rowH);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(String(idx + 1), margin + 3, y + 5.5);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(item.title, margin + 11, y + 5.5);

        if (descLines.length > 0) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.8);
          doc.setTextColor(100, 116, 139);
          doc.text(descLines, margin + 11, y + 10);
        }

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        doc.text(String(item.quantity), pageW - margin - 52, y + 5.5, {
          align: "right",
        });
        doc.text(
          formatCurrency(item.unit_price, curr),
          pageW - margin - 27,
          y + 5.5,
          { align: "right" },
        );
        doc.setFont("helvetica", "bold");
        doc.setTextColor(15, 23, 42);
        doc.text(formatCurrency(item.total, curr), pageW - margin - 3, y + 5.5, {
          align: "right",
        });

        y += rowH;
      });

      y += 7;

      // Bottom Split: Verification Box (Left) + Totals (Right)
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, 96, 22, 2, 2, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      doc.text("Verified Payment Receipt", margin + 4, y + 6);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text(`Ref: ${txn.transaction_id || "—"}`, margin + 4, y + 12);
      doc.text(`Paid At: ${formatDateTime(txn.purchased_at)}`, margin + 4, y + 17.5);

      const totLeft = pageW - margin - 68;
      let ty = y + 5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.8);
      doc.setTextColor(71, 85, 105);
      doc.text("Subtotal", totLeft, ty);
      doc.text(formatCurrency(txn.amount, curr), pageW - margin, ty, {
        align: "right",
      });
      ty += 6;

      doc.text("Tax / VAT", totLeft, ty);
      doc.text(formatCurrency(0, curr), pageW - margin, ty, { align: "right" });
      ty += 6;

      if (refunded > 0) {
        doc.setTextColor(180, 83, 9);
        doc.text("Refunded", totLeft, ty);
        doc.text(`-${formatCurrency(refunded, curr)}`, pageW - margin, ty, {
          align: "right",
        });
        ty += 6;
      }

      doc.setDrawColor(15, 23, 42);
      doc.setLineWidth(0.5);
      doc.line(totLeft, ty - 2, pageW - margin, ty - 2);
      ty += 4;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(`Total Paid (${curr})`, totLeft, ty);
      doc.setTextColor(4, 161, 183);
      doc.text(formatCurrency(net, curr), pageW - margin, ty, { align: "right" });

      // Footer at bottom of A4
      const footY = 282;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(margin, footY - 5, pageW - margin, footY - 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text(
        "This is an electronically generated official receipt from MindUnite.",
        margin,
        footY,
      );
      doc.text(
        txn.issued_by?.email || "billing@mindunite.com",
        pageW - margin,
        footY,
        { align: "right" },
      );

      doc.save(`${invNo}.pdf`);
      toast.success(`Downloaded ${invNo}.pdf`);
    } catch {
      toast.error("Failed to generate PDF invoice. Please try again.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handlePrintInvoice = () => {
    if (!txn) return;
    const isBoosting = txn.type === "boosting";
    const statusLabel = formatStatusLabel(txn.status);
    const invoiceNumber = txn.invoice_number || `INV-${txn.id}`;
    const currency = txn.currency || "USD";
    const refundedVal = Number(txn.refunded_amount ?? 0);
    const netVal =
      txn.net_amount ?? Math.max(0, Number(txn.amount) - refundedVal).toFixed(2);
    const logoUrl = `${window.location.origin}/logo.png`;

    const lineItems =
      txn.line_items && txn.line_items.length > 0
        ? txn.line_items
        : [
            {
              title: isBoosting
                ? `${txn.boosting?.package_name || "Product Boost"} — Ad Campaign #${txn.boosting?.campaign_id ?? ""}`
                : `${txn.plan?.name || "Subscription"} Subscription`,
              description: isBoosting
                ? [
                    txn.boosting?.item?.name
                      ? `Boosted Item: ${txn.boosting.item.name}`
                      : "",
                    txn.boosting?.duration_days
                      ? `Duration: ${txn.boosting.duration_days} days`
                      : "",
                    txn.boosting?.network_type
                      ? `${txn.boosting.network_type} network`
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" • ")
                : txn.plan?.billing_cycle
                  ? `${txn.plan.billing_cycle} billing`
                  : "Recurring plan",
              quantity: 1,
              unit_price: txn.amount,
              total: txn.amount,
            },
          ];

    const statusBadgeClass =
      txn.status === "succeeded"
        ? "stamp-paid"
        : txn.status === "failed"
          ? "stamp-failed"
          : txn.status === "refunded" || txn.status === "partially_refunded"
            ? "stamp-refunded"
            : "stamp-pending";

    const rightPartyBlock =
      isBoosting && txn.boosting?.industry
        ? `
        <div class="party-card">
          <div class="party-label">Industry / Organization</div>
          <div class="party-name">${escapeHtml(txn.boosting.industry.name)}</div>
          ${txn.boosting.industry.address ? `<div class="party-meta">${escapeHtml(txn.boosting.industry.address)}</div>` : ""}
          ${txn.boosting.industry.website ? `<div class="party-meta">${escapeHtml(txn.boosting.industry.website)}</div>` : ""}
        </div>`
        : `
        <div class="party-card">
          <div class="party-label">Issued By</div>
          <div class="party-name">${escapeHtml(txn.issued_by?.name || "MindUnite")}</div>
          <div class="party-meta">${escapeHtml(txn.issued_by?.tagline || "Psychology & Neuroscience Professional Network")}</div>
          <div class="party-meta">${escapeHtml(txn.issued_by?.email || "billing@mindunite.com")}</div>
        </div>`;

    const contextSection =
      isBoosting && txn.boosting
        ? `
        <div class="detail-box">
          <div class="detail-header">
            <span>Boosting Campaign Summary — #${escapeHtml(txn.boosting.campaign_id)}</span>
            <span class="pill-cyan">${escapeHtml(txn.boosting.campaign_status)}</span>
          </div>
          <div class="detail-grid">
            <div><span class="k">Boosted Product</span><span class="v">${escapeHtml(txn.boosting.item?.name || "—")}${txn.boosting.item?.code ? ` (#${escapeHtml(txn.boosting.item.code)})` : ""}</span></div>
            <div><span class="k">Package</span><span class="v">${escapeHtml(txn.boosting.package_name)} (${escapeHtml(txn.boosting.duration_days)} days)</span></div>
            <div><span class="k">Network & Placements</span><span class="v">${escapeHtml(txn.boosting.network_type || "—")}${txn.boosting.placements?.length ? ` • ${escapeHtml(txn.boosting.placements.join(", "))}` : ""}</span></div>
            <div><span class="k">Campaign Schedule</span><span class="v">${escapeHtml(formatShortDate(txn.boosting.starts_at))} — ${escapeHtml(formatShortDate(txn.boosting.ends_at))}</span></div>
          </div>
        </div>`
        : txn.plan || txn.subscription
          ? `
        <div class="detail-box">
          <div class="detail-header">
            <span>Subscription Summary</span>
            <span class="pill-purple">${escapeHtml(txn.subscription?.status || "Active")}</span>
          </div>
          <div class="detail-grid">
            <div><span class="k">Plan Name</span><span class="v">${escapeHtml(txn.plan?.name || "—")}</span></div>
            <div><span class="k">Billing Cycle</span><span class="v">${escapeHtml(txn.plan?.billing_cycle || "—")}</span></div>
            <div><span class="k">Billing Period</span><span class="v">${escapeHtml(formatShortDate(txn.subscription?.current_period_start))} — ${escapeHtml(formatShortDate(txn.subscription?.current_period_end))}</span></div>
            <div><span class="k">Platform</span><span class="v">${escapeHtml(txn.subscription?.platform || "Stripe")}</span></div>
          </div>
        </div>`
          : "";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invoice ${escapeHtml(invoiceNumber)} — MindUnite</title>
  <style>
    @page { size: A4; margin: 14mm; }
    * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif; color: #0f172a; margin: 0; padding: 0; background: #fff; font-size: 13px; line-height: 1.5; }
    .sheet { max-width: 780px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    .accent-bar { height: 6px; background: linear-gradient(90deg, #04A1B7 0%, #13B8B2 50%, #22CAAD 100%); }
    .inner { padding: 30px 32px 26px; }
    .letterhead { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; padding-bottom: 22px; border-bottom: 1px solid #e2e8f0; }
    .logo-img { height: 50px; width: auto; object-fit: contain; display: block; margin: -10px 0 -8px -4px; }
    .brand-sub { font-size: 11.5px; color: #64748b; margin-top: 2px; }
    .inv-right { text-align: right; }
    .inv-eyebrow { font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #04A1B7; }
    .inv-num { font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 2px; letter-spacing: -0.02em; }
    .badges-row { margin-top: 8px; display: flex; justify-content: flex-end; gap: 6px; align-items: center; }
    .stamp { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
    .stamp-paid { background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; }
    .stamp-refunded { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
    .stamp-failed { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
    .stamp-pending { background: #f8fafc; color: #475569; border: 1px solid #cbd5e1; }
    .type-pill { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 10.5px; font-weight: 700; }
    .type-boost { background: #ecfeff; color: #0e7490; border: 1px solid #a5f3fc; }
    .type-sub { background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; }
    .kpi-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 20px 0; padding: 14px 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; }
    .kpi-k { display: block; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; font-weight: 600; }
    .kpi-v { display: block; font-size: 13px; font-weight: 700; color: #0f172a; margin-top: 3px; }
    .kpi-v.primary { color: #04A1B7; font-size: 15px; }
    .parties { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px; }
    .party-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; }
    .party-label { font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; margin-bottom: 6px; }
    .party-name { font-size: 15px; font-weight: 700; color: #0f172a; }
    .party-meta { font-size: 12px; color: #475569; margin-top: 2px; word-break: break-word; }
    .detail-box { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; margin-bottom: 20px; background: #fbfdfe; }
    .detail-header { display: flex; justify-content: space-between; align-items: center; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #334155; padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; }
    .pill-cyan { background: #ecfeff; color: #0e7490; border: 1px solid #a5f3fc; border-radius: 999px; padding: 2px 9px; font-size: 10px; text-transform: capitalize; }
    .pill-purple { background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; border-radius: 999px; padding: 2px 9px; font-size: 10px; text-transform: capitalize; }
    .detail-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 18px; }
    .k { display: block; font-size: 10.5px; color: #64748b; font-weight: 500; }
    .v { display: block; font-size: 12.5px; font-weight: 600; color: #0f172a; margin-top: 2px; text-transform: capitalize; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 18px; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; }
    thead th { background: #f8fafc; text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
    th.right, td.right { text-align: right; }
    tbody td { padding: 13px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    .item-title { font-weight: 700; color: #0f172a; font-size: 13px; }
    .item-desc { font-size: 11.5px; color: #64748b; margin-top: 3px; }
    .summary-wrap { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; margin-top: 6px; }
    .receipt-note { flex: 1; font-size: 11.5px; color: #475569; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; }
    .receipt-note strong { color: #0f172a; display: block; margin-bottom: 2px; }
    .totals { width: 270px; flex-shrink: 0; }
    .t-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12.5px; color: #475569; }
    .t-row.refund { color: #b45309; font-weight: 600; }
    .t-row.grand { border-top: 2px solid #0f172a; margin-top: 8px; padding-top: 9px; font-size: 15px; font-weight: 800; color: #0f172a; }
    .footer { margin-top: 24px; padding-top: 14px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; color: #334155; }
  </style>
</head>
<body>
  <div class="sheet">
    <div class="accent-bar"></div>
    <div class="inner">
      <div class="letterhead">
        <div>
          <img src="${escapeHtml(logoUrl)}" alt="MindUnite" class="logo-img" />
          <div class="brand-sub">${escapeHtml(txn.issued_by?.tagline || "Psychology & Neuroscience Professional Network")}</div>
          <div class="brand-sub">${escapeHtml(txn.issued_by?.email || "billing@mindunite.com")}</div>
        </div>
        <div class="inv-right">
          <div class="inv-eyebrow">${isBoosting ? "Boosting Invoice & Receipt" : "Subscription Invoice & Receipt"}</div>
          <div class="inv-num">${escapeHtml(invoiceNumber)}</div>
          <div class="badges-row">
            <span class="type-pill ${isBoosting ? "type-boost" : "type-sub"}">${isBoosting ? "Boosting" : "Subscription"}</span>
            <span class="stamp ${statusBadgeClass}">${escapeHtml(statusLabel)}</span>
          </div>
        </div>
      </div>

      <div class="kpi-strip">
        <div>
          <span class="kpi-k">Invoice Date</span>
          <span class="kpi-v">${escapeHtml(formatShortDate(txn.created_at || txn.purchased_at))}</span>
        </div>
        <div>
          <span class="kpi-k">Paid On</span>
          <span class="kpi-v">${escapeHtml(formatShortDate(txn.purchased_at))}</span>
        </div>
        <div>
          <span class="kpi-k">Payment Method</span>
          <span class="kpi-v">${escapeHtml(formatCardBrand(txn.card_brand))} ${txn.card_last4 ? `•••• ${escapeHtml(txn.card_last4)}` : ""}</span>
        </div>
        <div>
          <span class="kpi-k">Amount Paid</span>
          <span class="kpi-v primary">${escapeHtml(formatCurrency(netVal, currency))} ${escapeHtml(currency)}</span>
        </div>
      </div>

      <div class="parties">
        <div class="party-card">
          <div class="party-label">Billed To (Customer)</div>
          <div class="party-name">${escapeHtml(txn.subscriber?.name || "Unknown User")}</div>
          ${txn.subscriber?.email ? `<div class="party-meta">${escapeHtml(txn.subscriber.email)}</div>` : ""}
          ${txn.subscriber?.username ? `<div class="party-meta">@${escapeHtml(txn.subscriber.username)}</div>` : ""}
        </div>
        ${rightPartyBlock}
      </div>

      ${contextSection}

      <table>
        <thead>
          <tr>
            <th style="width: 36px;">#</th>
            <th>Description</th>
            <th class="right" style="width: 56px;">Qty</th>
            <th class="right" style="width: 110px;">Unit Price</th>
            <th class="right" style="width: 110px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${lineItems
            .map(
              (item, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>
                <div class="item-title">${escapeHtml(item.title)}</div>
                ${item.description ? `<div class="item-desc">${escapeHtml(item.description)}</div>` : ""}
              </td>
              <td class="right">${escapeHtml(item.quantity)}</td>
              <td class="right">${escapeHtml(formatCurrency(item.unit_price, currency))}</td>
              <td class="right"><strong>${escapeHtml(formatCurrency(item.total, currency))}</strong></td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>

      <div class="summary-wrap">
        <div class="receipt-note">
          <strong>Payment Verification</strong>
          Payment Reference: <span class="mono">${escapeHtml(txn.transaction_id || "—")}</span><br />
          Timestamp: ${escapeHtml(formatDateTime(txn.purchased_at))}
        </div>
        <div class="totals">
          <div class="t-row">
            <span>Subtotal</span>
            <span>${escapeHtml(formatCurrency(txn.amount, currency))}</span>
          </div>
          <div class="t-row">
            <span>Tax / VAT</span>
            <span>${escapeHtml(formatCurrency(0, currency))}</span>
          </div>
          ${
            refundedVal > 0
              ? `<div class="t-row refund">
                  <span>Refunded</span>
                  <span>-${escapeHtml(formatCurrency(refundedVal, currency))}</span>
                </div>`
              : ""
          }
          <div class="t-row grand">
            <span>Total Paid (${escapeHtml(currency)})</span>
            <span>${escapeHtml(formatCurrency(netVal, currency))}</span>
          </div>
        </div>
      </div>

      <div class="footer">
        <span>This is an electronically generated official receipt from MindUnite.</span>
        <span>Questions? Contact ${escapeHtml(txn.issued_by?.email || "billing@mindunite.com")}</span>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      var imgs = Array.prototype.slice.call(document.images);
      Promise.all(imgs.map(function(img) {
        if (img.complete) return Promise.resolve();
        return new Promise(function(resolve) { img.onload = resolve; img.onerror = resolve; });
      })).then(function() {
        setTimeout(function() { window.print(); }, 150);
      });
    };
  </script>
</body>
</html>`;

    const printWindow = window.open("", "_blank", "width=920,height=780");
    if (!printWindow) {
      toast.error("Please allow pop-ups to print or save the invoice as PDF.");
      return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const isBoosting = txn?.type === "boosting";
  const statusLabel = formatStatusLabel(txn?.status);
  const currency = txn?.currency || "USD";
  const refundedVal = Number(txn?.refunded_amount ?? 0);
  const netVal =
    txn?.net_amount ??
    Math.max(0, Number(txn?.amount ?? 0) - refundedVal).toFixed(2);
  const invoiceNumber =
    txn?.invoice_number || (transactionId ? `INV-${transactionId}` : "Invoice");

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[92vh] p-0 overflow-hidden flex flex-col gap-0 bg-slate-50">
        {/* Top Brand Gradient Bar */}
        <div className="h-1.5 w-full bg-linear-to-r from-[#04A1B7] via-[#13B8B2] to-[#22CAAD] shrink-0" />

        {/* Modal Sticky Action Header */}
        <DialogHeader className="px-6 py-3.5 border-b border-gray-200/80 bg-white shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3 pr-7">
            <div>
              <DialogTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span>
                  {isBoosting
                    ? "Boosting Invoice & Receipt"
                    : "Subscription Invoice & Receipt"}
                </span>
                {isFetching && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#04A1B7]" />
                )}
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 mt-0.5">
                Official billing record • {invoiceNumber}
              </DialogDescription>
            </div>

            {txn && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  title="Copy Invoice Number"
                  aria-label="Copy Invoice Number"
                  onClick={() => handleCopy(invoiceNumber, "inv-num")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  {copiedKey === "inv-num" ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  title="Print Invoice"
                  aria-label="Print Invoice"
                  onClick={handlePrintInvoice}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:border-[#04A1B7] hover:bg-cyan-50/50 hover:text-[#04A1B7] transition-colors cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  title="Download PDF Invoice"
                  aria-label="Download PDF Invoice"
                  disabled={isDownloadingPdf}
                  onClick={handleDownloadPdf}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#04A1B7] text-white hover:bg-[#038a9d] transition-colors cursor-pointer shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isDownloadingPdf ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Scrollable Paper Invoice Body */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1">
          {isLoading && !txn ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2 bg-white rounded-xl border border-gray-200/80">
              <Loader2 className="h-6 w-6 animate-spin text-[#04A1B7]" />
              <span className="text-sm">Loading invoice details...</span>
            </div>
          ) : !txn ? (
            <div className="py-16 text-center text-sm text-gray-500 bg-white rounded-xl border border-gray-200/80">
              Unable to load transaction details.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200/90 shadow-xs overflow-hidden">
              <div className="p-5 sm:p-7 space-y-6">
                {/* 1. Official MindUnite Letterhead */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-gray-100">
                  <div>
                    <div className="overflow-hidden -ml-1.5 -mt-2 -mb-2">
                      <img
                        src={mindUniteLogo.src}
                        alt="MindUnite"
                        className="h-12 sm:h-13 w-auto object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {txn.issued_by?.tagline ||
                        "Psychology & Neuroscience Professional Network"}
                    </p>
                    <p className="inline-flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Mail className="h-3 w-3 text-gray-400" />
                      {txn.issued_by?.email || "billing@mindunite.com"}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#04A1B7]">
                      Invoice
                    </p>
                    <p className="text-xl font-extrabold text-gray-900 tracking-tight mt-0.5">
                      {invoiceNumber}
                    </p>
                    <div className="flex sm:justify-end items-center gap-2 mt-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                          isBoosting
                            ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        {isBoosting ? (
                          <Rocket className="h-3 w-3" />
                        ) : (
                          <Crown className="h-3 w-3" />
                        )}
                        {isBoosting ? "Boosting" : "Subscription"}
                      </span>
                      <CustomBadge
                        color={
                          statusLabel === "Paid"
                            ? "active"
                            : statusLabel === "Failed"
                              ? "suspended"
                              : statusLabel === "Refunded"
                                ? "orange"
                                : "yellow"
                        }
                        className="text-[11px] py-0.5! uppercase tracking-wider"
                      >
                        {statusLabel}
                      </CustomBadge>
                    </div>
                  </div>
                </div>

                {/* 2. Executive Key Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl bg-slate-50/90 border border-gray-200/70 p-3.5">
                  <div>
                    <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">
                      Invoice Date
                    </span>
                    <span className="block text-xs sm:text-sm font-semibold text-gray-900 mt-0.5">
                      {formatShortDate(txn.created_at || txn.purchased_at)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">
                      Paid Date
                    </span>
                    <span className="block text-xs sm:text-sm font-semibold text-gray-900 mt-0.5">
                      {formatShortDate(txn.purchased_at)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">
                      Payment Method
                    </span>
                    <span className="block text-xs sm:text-sm font-semibold text-gray-900 mt-0.5">
                      {formatCardBrand(txn.card_brand)}{" "}
                      {txn.card_last4 ? `•••• ${txn.card_last4}` : ""}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10.5px] font-semibold uppercase tracking-wider text-gray-400">
                      Amount Paid
                    </span>
                    <span className="block text-sm sm:text-base font-extrabold text-[#04A1B7] mt-0.5">
                      {formatCurrency(netVal, currency)}
                    </span>
                  </div>
                </div>

                {/* 3. Billed To & Industry / Organization */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Billed To Customer */}
                  <div className="rounded-xl border border-gray-200/80 p-4">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                      <User className="h-3.5 w-3.5" />
                      Billed To (Customer)
                    </div>
                    <div className="flex items-start gap-3">
                      <img
                        key={`customer-avatar-${txn.id}-${txn.subscriber?.image || "default"}`}
                        src={
                          txn.subscriber?.image &&
                          !failedImages[txn.subscriber.image]
                            ? txn.subscriber.image
                            : emptyUserImg.src
                        }
                        alt={txn.subscriber?.name || "Customer"}
                        onError={() => markImageFailed(txn.subscriber?.image)}
                        className="h-11 w-11 rounded-full object-cover border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {txn.subscriber?.name || "Unknown User"}
                        </p>
                        {txn.subscriber?.email && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {txn.subscriber.email}
                          </p>
                        )}
                        {txn.subscriber?.username && (
                          <a
                            href={`/mu/profile/${txn.subscriber.username}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#04A1B7] hover:underline mt-1"
                          >
                            @{txn.subscriber.username}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Organization / Industry OR Payment Platform */}
                  {isBoosting && txn.boosting?.industry ? (
                    <div className="rounded-xl border border-gray-200/80 p-4">
                      <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                        <Building2 className="h-3.5 w-3.5" />
                        Industry / Organization
                      </div>
                      <div className="flex items-start gap-3">
                        {txn.boosting.industry.logo &&
                        !failedImages[txn.boosting.industry.logo] ? (
                          <img
                            key={`ind-logo-${txn.id}-${txn.boosting.industry.logo}`}
                            src={txn.boosting.industry.logo}
                            alt={txn.boosting.industry.name}
                            onError={() =>
                              markImageFailed(txn.boosting?.industry?.logo)
                            }
                            className="h-11 w-11 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="h-11 w-11 rounded-lg bg-slate-100 border border-gray-200 flex items-center justify-center shrink-0">
                            <Building2 className="h-5 w-5 text-slate-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {txn.boosting.industry.name}
                          </p>
                          {txn.boosting.industry.address && (
                            <p className="flex items-center gap-1 text-xs text-gray-500 truncate mt-0.5">
                              <MapPin className="h-3 w-3 shrink-0" />
                              {txn.boosting.industry.address}
                            </p>
                          )}
                          {txn.boosting.industry.website && (
                            <a
                              href={
                                txn.boosting.industry.website.startsWith("http")
                                  ? txn.boosting.industry.website
                                  : `https://${txn.boosting.industry.website}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#04A1B7] hover:underline mt-1 truncate max-w-full"
                            >
                              <Globe className="h-3 w-3 shrink-0" />
                              <span className="truncate">
                                {txn.boosting.industry.website}
                              </span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-gray-200/80 p-4">
                      <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-gray-400 mb-3">
                        <CreditCard className="h-3.5 w-3.5" />
                        Billing Account & Gateway
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Payment Gateway</span>
                          <span className="font-semibold text-gray-900 capitalize">
                            {txn.subscription?.platform || "Stripe"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Currency</span>
                          <span className="font-semibold text-gray-900">
                            {currency}
                          </span>
                        </div>
                        {txn.subscription?.provider_subscription_id && (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-gray-500 shrink-0">
                              Sub ID
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  txn.subscription?.provider_subscription_id ||
                                    "",
                                  "sub-id",
                                )
                              }
                              className="inline-flex items-center gap-1 font-mono text-[11px] text-gray-700 hover:text-[#04A1B7] truncate cursor-pointer"
                            >
                              <span className="truncate max-w-[160px]">
                                {txn.subscription.provider_subscription_id}
                              </span>
                              {copiedKey === "sub-id" ? (
                                <Check className="h-3 w-3 text-emerald-600 shrink-0" />
                              ) : (
                                <Copy className="h-3 w-3 shrink-0" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Campaign OR Subscription Service Details */}
                {isBoosting && txn.boosting ? (
                  <div className="rounded-xl border border-cyan-200/70 bg-cyan-50/25 p-4 space-y-3.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-900">
                        <Rocket className="h-4 w-4 text-cyan-600" />
                        Boosting Campaign #{txn.boosting.campaign_id}
                      </div>
                      <CustomBadge
                        color={campaignStatusColor(txn.boosting.campaign_status)}
                      >
                        Campaign:{" "}
                        {txn.boosting.campaign_status
                          ? txn.boosting.campaign_status
                              .charAt(0)
                              .toUpperCase() +
                            txn.boosting.campaign_status.slice(1)
                          : "Pending"}
                      </CustomBadge>
                    </div>

                    {txn.boosting.item && (
                      <div className="flex items-center gap-3 rounded-lg bg-white border border-gray-200/80 p-3">
                        {txn.boosting.item.image &&
                        !failedImages[txn.boosting.item.image] ? (
                          <img
                            key={`prod-img-${txn.id}-${txn.boosting.item.image}`}
                            src={txn.boosting.item.image}
                            alt={txn.boosting.item.name}
                            onError={() =>
                              markImageFailed(txn.boosting?.item?.image)
                            }
                            className="h-12 w-12 rounded-lg object-cover border border-gray-200 shrink-0"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-slate-100 border border-gray-200 flex items-center justify-center shrink-0">
                            <Package className="h-5 w-5 text-slate-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                            Boosted {txn.boosting.ad_type || "Product"}
                            {txn.boosting.item.code
                              ? ` • #${txn.boosting.item.code}`
                              : ""}
                          </p>
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {txn.boosting.item.name}
                          </p>
                        </div>
                        {txn.boosting.network_type && (
                          <span className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 capitalize">
                            {txn.boosting.network_type}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="rounded-lg bg-white border border-gray-200/70 p-2.5">
                        <span className="text-gray-400 block text-[11px]">
                          Package
                        </span>
                        <span className="font-semibold text-gray-900 mt-0.5 block">
                          {txn.boosting.package_name}
                        </span>
                      </div>
                      <div className="rounded-lg bg-white border border-gray-200/70 p-2.5">
                        <span className="text-gray-400 block text-[11px]">
                          Duration
                        </span>
                        <span className="font-semibold text-gray-900 mt-0.5 block">
                          {txn.boosting.duration_days}{" "}
                          {txn.boosting.duration_days === 1 ? "day" : "days"}
                        </span>
                      </div>
                      <div className="rounded-lg bg-white border border-gray-200/70 p-2.5">
                        <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                          <Eye className="h-3 w-3" /> Impressions
                        </span>
                        <span className="font-semibold text-gray-900 mt-0.5 block">
                          {txn.boosting.total_impressions.toLocaleString()}
                        </span>
                      </div>
                      <div className="rounded-lg bg-white border border-gray-200/70 p-2.5">
                        <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                          <MousePointerClick className="h-3 w-3" /> Clicks
                        </span>
                        <span className="font-semibold text-gray-900 mt-0.5 block">
                          {txn.boosting.total_clicks.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600 pt-0.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>
                          Active Window:{" "}
                          <strong className="text-gray-800">
                            {formatShortDate(txn.boosting.starts_at)} —{" "}
                            {formatShortDate(txn.boosting.ends_at)}
                          </strong>
                        </span>
                      </div>
                      {txn.boosting.placements &&
                        txn.boosting.placements.length > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Layers className="h-3.5 w-3.5 text-gray-400" />
                            {txn.boosting.placements.map((place) => (
                              <span
                                key={place}
                                className="rounded bg-white border border-gray-200 px-2 py-0.5 text-[11px] font-medium capitalize text-gray-700"
                              >
                                {place.replace(/_/g, " ")}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-purple-200/70 bg-purple-50/25 p-4 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-900">
                        <Crown className="h-4 w-4 text-purple-600" />
                        Subscription Service Details
                      </div>
                      {txn.subscription?.status && (
                        <CustomBadge
                          color={
                            txn.subscription.status === "active" ||
                            txn.subscription.status === "trialing"
                              ? "active"
                              : "gray"
                          }
                        >
                          Subscription:{" "}
                          {txn.subscription.status.charAt(0).toUpperCase() +
                            txn.subscription.status.slice(1)}
                        </CustomBadge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="rounded-lg bg-white border border-gray-200/70 p-2.5">
                        <span className="text-gray-400 block text-[11px]">
                          Plan
                        </span>
                        <span className="font-semibold text-gray-900 mt-0.5 block">
                          {txn.plan?.name || "—"}
                        </span>
                      </div>
                      <div className="rounded-lg bg-white border border-gray-200/70 p-2.5">
                        <span className="text-gray-400 block text-[11px]">
                          Billing Cycle
                        </span>
                        <span className="font-semibold text-gray-900 mt-0.5 block capitalize">
                          {txn.plan?.billing_cycle || "—"}
                        </span>
                      </div>
                      <div className="rounded-lg bg-white border border-gray-200/70 p-2.5">
                        <span className="text-gray-400 block text-[11px]">
                          Period Start
                        </span>
                        <span className="font-semibold text-gray-900 mt-0.5 block">
                          {formatShortDate(
                            txn.subscription?.current_period_start,
                          )}
                        </span>
                      </div>
                      <div className="rounded-lg bg-white border border-gray-200/70 p-2.5">
                        <span className="text-gray-400 block text-[11px]">
                          Period End
                        </span>
                        <span className="font-semibold text-gray-900 mt-0.5 block">
                          {formatShortDate(
                            txn.subscription?.current_period_end,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Itemized Financial Breakdown Table */}
                <div className="rounded-xl border border-gray-200/90 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-gray-200/80 text-[11px] uppercase tracking-wider text-gray-500">
                          <th className="py-2.5 px-4 font-semibold w-10">#</th>
                          <th className="py-2.5 px-4 font-semibold">
                            Description
                          </th>
                          <th className="py-2.5 px-4 font-semibold text-right w-14">
                            Qty
                          </th>
                          <th className="py-2.5 px-4 font-semibold text-right w-28">
                            Unit Price
                          </th>
                          <th className="py-2.5 px-4 font-semibold text-right w-28">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {(txn.line_items && txn.line_items.length > 0
                          ? txn.line_items
                          : [
                              {
                                title: isBoosting
                                  ? `${txn.boosting?.package_name || "Product Boost"}`
                                  : `${txn.plan?.name || "Subscription"} Plan`,
                                description: isBoosting
                                  ? `${txn.boosting?.item?.name || "Product"} • ${txn.boosting?.duration_days ?? 0} days`
                                  : `${txn.plan?.billing_cycle || "monthly"} billing`,
                                quantity: 1,
                                unit_price: txn.amount,
                                total: txn.amount,
                              },
                            ]
                        ).map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-3.5 px-4 text-xs text-gray-400 font-medium">
                              {idx + 1}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-gray-900 text-sm">
                                {item.title}
                              </p>
                              {item.description && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {item.description}
                                </p>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-right text-gray-600 text-sm">
                              {item.quantity}
                            </td>
                            <td className="py-3.5 px-4 text-right text-gray-600 text-sm">
                              {formatCurrency(item.unit_price, currency)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-bold text-gray-900 text-sm">
                              {formatCurrency(item.total, currency)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Block */}
                  <div className="bg-slate-50/70 px-4 py-4 border-t border-gray-200/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="flex items-start gap-2.5 text-xs text-gray-500 max-w-sm">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-700">
                          Verified Payment Receipt
                        </p>
                        <p className="mt-0.5">
                          Paid on {formatDateTime(txn.purchased_at)} via{" "}
                          {formatCardBrand(txn.card_brand)}
                          {txn.card_last4 ? ` •••• ${txn.card_last4}` : ""}.
                        </p>
                      </div>
                    </div>

                    <div className="w-full sm:w-64 space-y-1.5 text-sm">
                      <div className="flex items-center justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatCurrency(txn.amount, currency)}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-500 text-xs">
                        <span>Tax / VAT</span>
                        <span>{formatCurrency(0, currency)}</span>
                      </div>
                      {refundedVal > 0 && (
                        <div className="flex items-center justify-between text-amber-700 font-medium">
                          <span>
                            Refunded
                            {txn.refunded_at
                              ? ` (${formatShortDate(txn.refunded_at)})`
                              : ""}
                          </span>
                          <span>-{formatCurrency(refundedVal, currency)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between border-t-2 border-gray-900 pt-2 text-base font-extrabold text-gray-900">
                        <span>Total Paid ({currency})</span>
                        <span>{formatCurrency(netVal, currency)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Audit Reference & Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Transaction Ref:</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(txn.transaction_id, "footer-ref")
                      }
                      className="inline-flex items-center gap-1.5 font-mono text-[11.5px] font-medium text-gray-700 hover:text-[#04A1B7] cursor-pointer"
                    >
                      <span>{txn.transaction_id || "—"}</span>
                      {copiedKey === "footer-ref" ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    Official MindUnite Billing Document
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
