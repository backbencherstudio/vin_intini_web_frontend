import ConnectionRequestList from "@/app/(Frond-End)/_components/mainPage/network/connectionRequests/ConnectionRequestList";

function page() {
  return (
    <div>
      <p className="text-sm  text-grayColor1 mt-1">
        You are following 100 people out of your network
      </p>
      <div className="mt-6">
        <ConnectionRequestList allReadyFriends={"follower"} />
      </div>
    </div>
  );
}

export default page;
