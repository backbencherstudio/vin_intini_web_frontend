import ConnectionRequestHeader from "./connectionRequests/ConnectionRequestHeader";
import ConnectionRequestList from "./connectionRequests/ConnectionRequestList";
import SuggestConnectionList from "./connectionUsers/SuggestConnectionList";

function ConnectionRequestSection({
  isLoading = false,
}: {
  isLoading?: boolean;
}) {
  return (
    <section className="w-full bg-white  pb-4 pt-2 md:px-3">
      <ConnectionRequestHeader />
      <div>
        <ConnectionRequestList />
      </div>
      <div className="mt-10">
        <h3 className="mb-5 text-xl font-semibold leading-[120%] text-headerColor">
          Connect With New Network
        </h3>

        <SuggestConnectionList />
      </div>
    </section>
  );
}

export default ConnectionRequestSection;
