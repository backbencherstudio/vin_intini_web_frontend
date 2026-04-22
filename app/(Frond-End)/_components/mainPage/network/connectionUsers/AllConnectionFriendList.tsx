import ConnectionRequestList from "../connectionRequests/ConnectionRequestList";

function AllConnectionFriendList() {
  return (
    <div className="mt-4 pb-10">
      <ConnectionRequestList allReadyFriends={true} />
    </div>
  );
}

export default AllConnectionFriendList;
