import ApplicantUserDetails from "../../../_component/applicant/ApplicantUserDetails";

async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ applicantID: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { applicantID } = await params;
  const { status } = await searchParams;

  return (
    <div>
      <ApplicantUserDetails status={status} applicantId={applicantID} />
    </div>
  );
}

export default Page;
