import { redirect } from "next/navigation";

export default function LegacySubscriptionTransactionsRedirect() {
  redirect("/dashboard/transactions");
}
