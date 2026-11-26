export interface Subscriber {
  name: string;
  image: string;
}

export interface SubscriptionPlan {
  name: string;
  amount: string;
  billing_cycle: "monthly" | "yearly";
}

export interface Subscription {
  id: number;
  subscriber: Subscriber;
  plan: SubscriptionPlan;
  status: "active" | "canceled" | "cancelled" | "expired" | "past_due" | "trialing" | string;
  billing_cycle: "monthly" | "yearly" | null;
  next_billing_date: string | null;
  days_left: number | null;
  cancel_at_period_end: boolean;
  joined_at: string;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface GetSubscriptionsResponse {
  success: boolean;
  data: Subscription[];
  pagination: Pagination;
}

export interface GetSubscriptionsParams {
  query?: {
    page?: number;
    per_page?: number;
    status?: Subscription["status"];
    [key: string]: unknown;
  };
}

export interface CancelSubscriptionResponse {
  success: boolean;
  message?: string;
}

// Transaction Stats Type

export type StatDirection = "up" | "down" | "flat";
export type TransactionTypeFilter = "all" | "subscription" | "boosting";
export type TransactionType = "subscription" | "boosting";
export type TransactionPeriodFilter = "all" | "this_month";

export interface TransactionStatus {
  key?: string;
  label: string;
  format?: "currency" | "number";
  value: number;
  all_time_value?: number;
  monthly_value?: number;
  previous_value: number;
  difference: number;
  change_percent: number | null;
  direction: StatDirection;
  subtitle?: string;
}

export interface TransactionStatsSummary {
  total_revenue: number;
  subscription_revenue: number;
  boosting_revenue: number;
  successful_payments: number;
  failed_payments: number;
  refunded_amount: number;
  active_subscribers: number;
  active_campaigns: number;
}

export interface GetTransactionStatsParams {
  type?: TransactionTypeFilter;
  period?: TransactionPeriodFilter;
}

export interface GetTransactionStatusResponse {
  success: boolean;
  period?: TransactionPeriodFilter;
  type?: TransactionTypeFilter;
  data: TransactionStatus[];
  summary?: TransactionStatsSummary;
}

// Transaction History Table

export interface TransactionSubscriber {
  id?: number | null;
  name: string;
  username?: string | null;
  email?: string | null;
  image: string | null;
}

export interface TransactionPlan {
  id?: number;
  name: string;
  amount: string;
  billing_cycle: "monthly" | "yearly" | string;
}

export interface TransactionSubscription {
  id: number;
  status: string;
  platform: string;
  provider_subscription_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export interface TransactionBoostingItem {
  id: number;
  code: string | null;
  name: string;
  slug: string | null;
  image: string | null;
  type: string;
}

export interface TransactionBoostingIndustry {
  id: number;
  name: string;
  slug: string | null;
  logo: string | null;
  address: string | null;
  website: string | null;
}

export interface TransactionBoosting {
  campaign_id: number;
  package_id: number | null;
  package_name: string;
  is_custom: boolean;
  duration_days: number;
  ad_type: string;
  network_type: string | null;
  placements: string[];
  campaign_status: string;
  starts_at: string | null;
  ends_at: string | null;
  total_impressions: number;
  total_clicks: number;
  payment_platform: string;
  item: TransactionBoostingItem | null;
  industry: TransactionBoostingIndustry | null;
}

export interface TransactionInvoiceLineItem {
  title: string;
  description: string;
  quantity: number;
  unit_price: string;
  total: string;
}

export type TransactionStatusType =
  | "pending"
  | "succeeded"
  | "failed"
  | "refunded"
  | "partially_refunded";

export interface Transaction {
  id: number;
  invoice_number?: string;
  transaction_id: string;
  type: TransactionType;
  subscriber: TransactionSubscriber;
  plan: TransactionPlan | null;
  subscription?: TransactionSubscription | null;
  boosting?: TransactionBoosting | null;
  amount: string;
  currency: string;
  status: TransactionStatusType;
  card_brand: string | null;
  card_last4: string | null;
  refunded_amount: string;
  net_amount?: string;
  refunded_at?: string | null;
  purchased_at: string;
  checkout_session_id?: string | null;
  created_at?: string | null;
  issued_by?: {
    name: string;
    tagline: string;
    email: string;
  };
  line_items?: TransactionInvoiceLineItem[];
}

export interface TransactionCounts {
  all: number;
  subscription: number;
  boosting: number;
}

export interface GetTransactionsResponse {
  success: boolean;
  data: Transaction[];
  counts?: TransactionCounts;
  pagination: Pagination;
}

export interface GetTransactionDetailResponse {
  success: boolean;
  data: Transaction;
}

export interface GetTransactionsParams {
  query?: {
    page?: number;
    per_page?: number;
    type?: TransactionTypeFilter;
    status?: TransactionStatusType | string;
    plan_id?: number | string;
    boost_package_id?: number | string;
    search?: string;
    date_from?: string;
    date_to?: string;
    [key: string]: unknown;
  };
}

// plan and pricing

export type PlanBillingCycle = "monthly" | "yearly";
export type PlanStatus = "active" | "inactive";

export interface Plan {
  id: number;
  name: string;
  plan_type: "premium" | "industry";
  short_description: string | null;
  billing_rate: string;
  billing_cycle: PlanBillingCycle;
  discount_percent: string;
  discount_duration: string | null;
  badge_color: string;
  status: PlanStatus;
  sort_order?: number;
  features: string[];
  revenuecat_store_identifier_ios?: string | null;
  revenuecat_store_identifier_android?: string | null;
  revenuecat_entitlement_identifier?: string | null;
  subscribers?: number;
  total_subscribers?: number;
  created_at: string;
  updated_at: string;
}

export interface GetPlansResponse {
  success: boolean;
  data: Plan[];
}

export interface PlanPayload {
  name: string;
  plan_type: "premium" | "industry";
  short_description: string;
  billing_rate: number;
  billing_cycle: PlanBillingCycle;
  discount_percent: number;
  discount_duration: string | null; // "YYYY-MM-DD"
  badge_color: string;
  status: PlanStatus;
  features: PlanFeatureValue[];
  revenuecat_store_identifier_ios?: string | null;
  revenuecat_store_identifier_android?: string | null;
  revenuecat_entitlement_identifier?: string | null;
}

export interface CreatePlanResponse {
  success: boolean;
  data: Plan;
}

export interface UpdatePlanResponse {
  success: boolean;
  data: Plan;
}

export interface UpdatePlanArgs {
  id: number | string;
  body: PlanPayload;
}

export interface DeletePlanResponse {
  success: boolean;
  message?: string;
}

// features list:
export type PlanFeatureValue =
  | "company_profile"
  | "build_network"
  | "collaboration_groups"
  | "direct_messaging"
  | "posts_articles_photos_videos"
  | "profile_views_insights"
  | "job_applications"
  | "connect_organizations"
  | "product_advertisement";

export interface PlanFeatureOption {
  value: PlanFeatureValue;
  label: string;
  plan_types?: Array<"premium" | "industry">;
}

export interface GetPlanFeaturesResponse {
  success: boolean;
  data: PlanFeatureOption[];
}
