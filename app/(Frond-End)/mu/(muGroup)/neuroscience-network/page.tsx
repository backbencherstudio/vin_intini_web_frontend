import { redirect } from "next/navigation";

interface NeuroscienceNetworkPageProps {
  params: Promise<{ id: string }>;
}

export default async function NeuroscienceNetworkPage({
  params,
}: NeuroscienceNetworkPageProps) {
  const { id } = await params;
  redirect(`/mu/${id}/neuroscience-network/fields`);
}
