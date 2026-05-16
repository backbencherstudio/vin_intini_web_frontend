import { redirect } from "next/navigation";

interface IndustryPageProps {
  params: Promise<{ id: string }>;
}

export default async function IndustryPage() {
  redirect(`/mu/neuroscience-network/industry/biotechnology`);
}
