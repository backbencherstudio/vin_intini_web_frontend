import ConnectionRequestList from "@/app/(Frond-End)/_components/mainPage/network/connectionRequests/ConnectionRequestList";

function page() {
  return (
    <div>
      <p className="text-sm  text-grayColor1 mt-1">
        1000 people are following you
      </p>
      <div className="mt-6">
        <ConnectionRequestList allReadyFriends={"follower"} />
      </div>
    </div>
  );
}

export default page;
