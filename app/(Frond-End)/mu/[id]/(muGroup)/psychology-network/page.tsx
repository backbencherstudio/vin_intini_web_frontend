// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/page.tsx

import { redirect } from "next/navigation";

interface PsychologyNetworkPageProps {
  params: Promise<{ id: string }>;
}

export default async function PsychologyNetworkPage({
  params,
}: PsychologyNetworkPageProps) {
  const { id } = await params;
  redirect(`/mu/${id}/psychology-network/fields`);
}
