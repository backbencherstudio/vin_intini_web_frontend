import JobsDetailsPage from "@/app/(Frond-End)/mu/(pro-industry)/_component/jobs/JobsDetailsPage";
import JobDetailsHeader from "../../../(pro-industry)/_component/jobs/JobDetailsHeader";

async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <JobDetailsHeader />
      <JobsDetailsPage id={id} />
    </div>
  );
}

export default page;
