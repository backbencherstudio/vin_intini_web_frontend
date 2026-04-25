import AllConnectionFriendList from "@/app/(Frond-End)/_components/mainPage/network/connectionUsers/AllConnectionFriendList";
import ConnectionListHeader from "@/app/(Frond-End)/_components/mainPage/network/connectionUsers/ConnectionListHeader";

function page() {
  return (
    <div>
      <ConnectionListHeader />
      <div>
        <AllConnectionFriendList />
      </div>
    </div>
  );
}

export default page;
