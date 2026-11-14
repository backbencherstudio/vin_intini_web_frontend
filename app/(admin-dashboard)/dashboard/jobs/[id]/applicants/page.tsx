import AdminJobApplicantsPanel from "@/app/(Front-End)/_components/adminDashboard/jobs/AdminJobApplicantsPanel";

export default async function AdminJobApplicantsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AdminJobApplicantsPanel jobId={id} />;
}

