import ButtonReuseable from "@/components/reusable/CustomButton";

function SubscriptionCard() {
  return (
    <div className="bg-primaryColor  flex flex-col justify-center text-center gap-1 rounded-2xl md:p-4 p-3">
      <h3 className="text-lg text-whiteColor font-semibold">Subscription </h3>
      <p className="text-sm text-whiteColor">
        Try your experience for using more features
      </p>
      <ButtonReuseable
        title="Upgrade Now"
        className="bg-whiteColor! mt-2 text-primaryColor!"
      />
    </div>
  );
}

export default SubscriptionCard;
