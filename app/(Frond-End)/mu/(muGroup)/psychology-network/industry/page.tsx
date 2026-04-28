import { redirect } from "next/navigation";

interface IndustryPageProps {
  params: Promise<{ id: string }>;
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { id } = await params;
  redirect(`/mu/${id}/psychology-network/industry/biotechnology`);
}
