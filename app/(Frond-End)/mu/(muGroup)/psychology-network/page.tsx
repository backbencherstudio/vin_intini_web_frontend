// app/(Frond-End)/mu/[id]/(muGroup)/psychology-network/page.tsx

import { redirect } from "next/navigation";

interface PsychologyNetworkPageProps {
  params: Promise<{ id: string }>;
}

export default async function PsychologyNetworkPage() {
  redirect(`/mu/psychology-network/fields`);
}
