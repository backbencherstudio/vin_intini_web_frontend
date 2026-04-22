import ConnectionRequestList from "@/app/(Frond-End)/_components/mainPage/network/connectionRequests/ConnectionRequestList";

function page() {
  return (
    <div>
      <div className="mt-6">
        <ConnectionRequestList allReadyFriends={"follower"} />
      </div>
    </div>
  );
}

export default page;
