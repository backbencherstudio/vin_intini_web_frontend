import CreateAdvertisementForm from "../../../_component/advertisements/CreateAdvertisementForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return (
    <div>
      <CreateAdvertisementForm id={id} />
    </div>
  );
}

