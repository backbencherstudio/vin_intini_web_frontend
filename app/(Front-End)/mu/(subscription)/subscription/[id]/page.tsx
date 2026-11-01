import SubscriptionPayment from "../../_component/SubscriptionPayment";


async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <SubscriptionPayment pymentId={id} />
    </div>
  );
}

export default Page;
