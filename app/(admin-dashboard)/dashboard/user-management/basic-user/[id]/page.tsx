import AdminUserDetailsPanel from "@/app/(Front-End)/_components/adminDashboard/usermanagement/AdminUserDetailsPanel";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <AdminUserDetailsPanel userId={id} />;
}
