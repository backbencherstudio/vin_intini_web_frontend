import { redirect } from "next/navigation";

interface NeuroscienceNetworkPageProps {
  params: Promise<{ id: string }>;
}

export default async function NeuroscienceNetworkPage() {
  redirect(`/mu/neuroscience-network/fields`);
}
