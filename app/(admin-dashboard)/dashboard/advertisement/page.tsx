import { redirect } from "next/navigation";

export default function AdvertisementRootRedirect() {
  redirect("/dashboard/advertisement/overview");
}
