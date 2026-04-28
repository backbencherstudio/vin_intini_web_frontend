import ConnectionRequestHeader from "@/app/(Frond-End)/_components/mainPage/network/connectionRequests/ConnectionRequestHeader";
import ConnectionRequestList from "@/app/(Frond-End)/_components/mainPage/network/connectionRequests/ConnectionRequestList";

function page() {
  return (
    <div>
      <ConnectionRequestHeader />
      <div>
        <ConnectionRequestList isNetwork= {true} />
      </div>
    </div>
  );
}

export default page;
