import BasicUserActivity from "@/app/(Frond-End)/_components/adminDashboard/usermanagement/BasicUser/BasicUserActivity";
import { initialJobs } from "@/app/(Frond-End)/_components/adminDashboard/usermanagement/BasicUser/BasicUserDemoData";
import BasicUserDetails from "@/app/(Frond-End)/_components/adminDashboard/usermanagement/BasicUser/BasicUserDetails";
import Coverphoto from "@/public/images/admin/advertise1.png"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    console.log("initialJobs:", initialJobs);

    const user = initialJobs.find(
        (item) => item.id === Number(id)
    );

    console.log("Selected User:", user);

    return (
        <div>
            <div className="w-full h-[225px] rounded-lg overflow-hidden">
                <img className="w-full h-full object-cover" src={Coverphoto.src} alt="" />
            </div>
            <div className="w-[480px] bg-white -mt-9 ml-5">
                <img src={user.img} alt="ald" width={33} height={33}/>

              

               
            </div>
            <div className="flex flex-col md:flex-row justify-between">
                <div>
                      <p className="text-lg font-bold mt-2">{user.name}</p>
                <p>location</p>
                <p>Total Connection</p>
                </div>
                <div>
                    <p>Company Name & <br /> Logo</p>
                  <p>Graduated institution <br />  Name</p>
                </div>
            </div>
            <div>
                <BasicUserDetails user={user} />
            </div>
            <div>
                <BasicUserActivity user={user}/>
            </div>
        </div>
    );
}