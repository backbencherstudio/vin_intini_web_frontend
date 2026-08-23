import { IoIosTrendingDown, IoIosTrendingUp } from "react-icons/io";
import { IoArrowForward } from "react-icons/io5";

export default function TransactionStatusCard() {
    const CardData = [
        {
            title: "Total Transactions",
            value: "12,846",
            icon: IoIosTrendingUp,
            percentage: "59.2%",
        },
        {
            title: "Total Revenue",
            value: "$485 932.50",
            icon: IoIosTrendingUp,
            percentage: "59.2%",
        },
        {
            title: "Successful Payments",
            value: "17,856",
            icon: IoIosTrendingUp,
            percentage: "2.8%",
        },
        {
            title: "Refunded Amount",
            value: "$12,450.00",
            icon: IoIosTrendingDown,
            percentage: "12.2%",
        },
        {
            title: "Failed Payments",
            value: "400",
            icon: IoIosTrendingUp,
            percentage: "9.2%",
        },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {CardData.map((item, index) => {
                    const Icon = item.icon;

                    const isDown = item.icon === IoIosTrendingDown;

                    return (
                        <div
                            key={index}
                            className="rounded-lg bg-white p-4 border"
                        >
                            <div className=" flex items-center justify-between">
                                <h3 className="text-[#777980] font-['Segoe_UI'] text-[14px] font-normal leading-[19.6px] tracking-[0.07px]">
                                    {item.title}
                                </h3>
                                <div>
                                    <IoArrowForward className="text-[#777980]" />
                                </div>


                            </div>
                            <p className="text-headerColor font-['Segoe_UI'] text-[32px] font-semibold leading-[130%] py-3">
                                {item.value}
                            </p>

                            <div className="flex gap-2.5 ">
                                <div className={`flex items-center gap-1 rounded-full ${isDown ? "bg-[#FEECEE]" : "bg-[#E9FAF7]"}  p-1`}>
                                    <Icon
                                        size={20}
                                        className={
                                            isDown
                                                ? "text-[#EB3D4D] rotate-120 "
                                                : "text-primaryColor "
                                        }
                                    />

                                    <span
                                        className={
                                            isDown
                                                ? "text-[#EB3D4D] font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px]"
                                                : "text-primaryColor font-['Segoe_UI'] text-[12px] font-semibold leading-[132%] tracking-[0.06px]"
                                        }
                                    >
                                        {item.percentage}
                                    </span>
                                </div>

                                <p className="text-[#777980] font-['Segoe_UI'] text-[12px] font-normal leading-[132%] tracking-[0.06px] flex justify-center items-center">
                                    VS previous month
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}