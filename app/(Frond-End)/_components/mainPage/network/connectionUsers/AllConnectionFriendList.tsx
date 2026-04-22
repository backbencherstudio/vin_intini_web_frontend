import ConnectionRequestList from "../connectionRequests/ConnectionRequestList";

function AllConnectionFriendList() {
  return (
    <div className="mt-4 pb-10">
      <ConnectionRequestList allReadyFriends={"friend"} />
    </div>
  );
}

export default AllConnectionFriendList;
