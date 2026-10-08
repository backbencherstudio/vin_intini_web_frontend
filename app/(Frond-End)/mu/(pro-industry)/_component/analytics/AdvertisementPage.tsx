"use client";

import GraphSkeleton from "@/components/reusable/All Skleton/GraphSkeleton";
import StateCardSkleton from "@/components/reusable/All Skleton/StateCardSkleton";
import CommonStateCard from "@/components/reusable/CommonStateCard";
import { useGetAdvertisementsQuery } from "@/feature/slice/jobs/analyticSlice";
import { ActiveIcon, OpenEyeIcon } from "@/public/svgIcons/Icons";
import { Package, ThumbsUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SeriesItem {
  name: string;
  key: string;
  data: number[];
}

interface RangeData {
  labels: string[];
  series: SeriesItem[];
  total_views?: number;
  total_likes?: number;
}

export default function AdvertisementPage() {
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetAdvertisementsQuery({});

  const adData = response?.data;
  const cards = adData?.cards;
  const topProducts = adData?.top_performing_products || [];
  const graph = adData?.graph;

  // Available ranges for the chart
  const availableRanges = useMemo(() => {
    if (graph?.ranges && typeof graph.ranges === "object") {
      const keys = Object.keys(graph.ranges);
      if (keys.length > 0) return keys;
    }
    return ["weekly", "monthly", "yearly"];
  }, [graph?.ranges]);

  const [activeRange, setActiveRange] = useState<string>("monthly");

  // Sync with API active range if provided
  useEffect(() => {
    if (graph?.active && availableRanges.includes(graph.active)) {
      setActiveRange(graph.active);
    }
  }, [graph?.active, availableRanges]);

  // Current range data
  const currentRangeData: RangeData | undefined = useMemo(() => {
    if (graph?.ranges?.[activeRange]) {
      return graph.ranges[activeRange];
    }
    return graph;
  }, [graph, activeRange]);

  const labels: string[] = currentRangeData?.labels || [];
  const series: SeriesItem[] = currentRangeData?.series || [];

  // Transform data for Recharts
  const chartData = useMemo(() => {
    if (!labels.length) return [];
    return labels.map((label, index) => {
      const row: Record<string, any> = { name: label };
      series.forEach((s) => {
        row[s.key] = s.data?.[index] ?? 0;
      });
      return row;
    });
  }, [labels, series]);

  // Max value for Y-axis domain
  const maxChartVal = useMemo(() => {
    let max = 0;
    chartData.forEach((row) => {
      series.forEach((s) => {
        const val = Number(row[s.key]) || 0;
        if (val > max) max = val;
      });
    });
    if (max === 0) return 1000;
    if (max <= 10) return 15;
    return Math.ceil(max * 1.25);
  }, [chartData, series]);

  const formatYAxis = (val: number) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(0)}k`;
    }
    return val.toString();
  };

  // 4 Top Cards configuration
  const cardItems = [
    {
      id: "total_products",
      title: "Total Products",
      total: cards?.total_products?.total ?? 0,
      growthPercentage: cards?.total_products?.growth_percentage ?? 0,
      isPositive: cards?.total_products?.is_positive ?? true,
      icon: Package,
    },
    {
      id: "active_products",
      title: "Active Products",
      total: cards?.active_products?.total ?? 0,
      growthPercentage: cards?.active_products?.growth_percentage ?? 0,
      isPositive: cards?.active_products?.is_positive ?? true,
      icon: ActiveIcon,
    },
    {
      id: "product_views",
      title: "Product Views",
      total: cards?.product_views?.total ?? 0,
      growthPercentage: cards?.product_views?.growth_percentage ?? 0,
      isPositive: cards?.product_views?.is_positive ?? true,
      icon: OpenEyeIcon,
    },
    {
      id: "total_likes",
      title: "Total Like",
      total: cards?.total_likes?.total ?? 0,
      growthPercentage: cards?.total_likes?.growth_percentage ?? 0,
      isPositive: cards?.total_likes?.is_positive ?? true,
      icon: ThumbsUp,
    },
  ];

  // Custom Tooltip matching design
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
      <div className="bg-white rounded-xl shadow-xl border border-borderColor/80 p-3.5 min-w-[160px] text-xs">
        <p className="font-bold text-headerColor text-xs pb-1.5 mb-2 border-b border-borderColor/60">
          Product Insight
        </p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => {
            const isViews = entry.dataKey === "views";
            return (
              <div
                key={index}
                className="flex items-center justify-between gap-4 text-descriptionColor"
              >
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-600 font-medium">
                    {isViews ? "Product Views" : "Product Like"}
                  </span>
                </span>
                <span className="font-bold text-headerColor">
                  {Number(entry.value).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <StateCardSkleton />
        <GraphSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-borderColor/80 p-8 text-center space-y-3">
        <p className="text-red-500 font-semibold text-sm">
          Failed to load advertisement analytics.
        </p>
        <button
          onClick={() => refetch()}
          className="text-xs bg-primaryColor text-white px-4 py-2 rounded-lg hover:bg-primaryColor/90 transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 4 Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
        {cardItems.map((item) => (
          <CommonStateCard
            key={item.id}
            title={item.title}
            total={item.total}
            growthPercentage={item.growthPercentage}
            isPositive={item.isPositive}
            icon={item.icon}
          />
        ))}
      </div>

      {/* Main Content: Left (Top Performing Products) + Right (Advertisement Performance Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Top Performing Products */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-borderColor/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-headerColor">
              Top Performing Products
            </h3>

            <div className="mt-4">
              {/* Table Header */}
              <div className="grid grid-cols-12 text-xs font-semibold text-headerColor pb-3 border-b border-borderColor/60">
                <span className="col-span-6">Products</span>
                <span className="col-span-3 text-right">Views</span>
                <span className="col-span-3 text-right">Click</span>
              </div>

              {/* Product Rows */}
              {topProducts.length > 0 ? (
                <div className="divide-y divide-borderColor/40">
                  {topProducts.map((product: any, idx: number) => (
                    <div
                      key={product.id || idx}
                      className="grid grid-cols-12 items-center py-3.5 text-xs hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="col-span-6 flex items-center gap-2 min-w-0 pr-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00A896] shrink-0" />
                        <span className="font-medium text-headerColor truncate">
                          {product.name ||
                            product.title ||
                            product.product_name ||
                            `Product ${idx + 1}`}
                        </span>
                      </div>
                      <span className="col-span-3 text-right font-medium text-descriptionColor">
                        {(product.views ?? 0).toLocaleString()}
                      </span>
                      <span className="col-span-3 text-right font-medium text-descriptionColor">
                        {(
                          product.clicks ??
                          product.click ??
                          0
                        ).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-descriptionColor">
                  No performing products found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Advertisement Performance (Line Chart) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-borderColor/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-headerColor">
                  {graph?.title || "Advertisement Performance"}
                </h3>
                <p className="text-xs text-descriptionColor mt-0.5">
                  {graph?.subtitle || "Views vs Like"}
                </p>
              </div>

              {/* Range Toggle Tabs */}
              <div className="bg-bgLightColor border border-bgColor rounded-md p-0.75 flex items-center gap-1 self-start sm:self-auto">
                {availableRanges.map((range) => {
                  const isActive = activeRange === range;
                  return (
                    <button
                      key={range}
                      type="button"
                      onClick={() => setActiveRange(range)}
                      className={`px-3.5 py-1 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-headerColor shadow-xs"
                          : "text-grayColor1 hover:text-headerColor"
                      }`}
                    >
                      {range}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Legends */}
            <div className="flex items-center justify-end gap-5 mt-3 text-xs font-medium text-grayColor1">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primaryColor" />
                <span>Views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primaryColor" />
                <span>Like</span>
              </div>
            </div>

            {/* Recharts Multi-Line Chart */}
            <div className="h-72 sm:h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#F3F4F6"
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    domain={[0, maxChartVal]}
                    tickFormatter={formatYAxis}
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{
                      stroke: "#F3F4F6",
                      strokeWidth: 5,
                      strokeLinecap: "round",
                    }}
                    content={<CustomTooltip />}
                  />
                  <Line
                    type="natural"
                    dataKey="views"
                    name="Views"
                    stroke="#0284C7"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      stroke: "#0284C7",
                      strokeWidth: 2,
                      fill: "#ffffff",
                    }}
                  />
                  <Line
                    type="natural"
                    dataKey="likes"
                    name="Like"
                    stroke="#14B8A6"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{
                      r: 5,
                      stroke: "#14B8A6",
                      strokeWidth: 2,
                      fill: "#ffffff",
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
