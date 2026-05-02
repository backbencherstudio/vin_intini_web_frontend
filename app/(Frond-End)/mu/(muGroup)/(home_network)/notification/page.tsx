import Image from "next/image";

type NotificationItem = {
  id: number;
  titleBold: string;
  titleNormal: string;
  description: string;
  time: string;
  isUnread?: boolean;
};

const notifications: NotificationItem[] = [
  {
    id: 1,
    titleBold: "User Name",
    titleNormal: "commented on your post.",
    description: "Fantastic. I'm enjoying every moment of it.",
    time: "2 min ago",
  },
  {
    id: 2,
    titleBold: "User Name",
    titleNormal: "commented on your post.",
    description: "Fantastic. I'm enjoying every moment of it.",
    time: "2 min ago",
  },
  {
    id: 3,
    titleBold: "User Name",
    titleNormal: "replied on your comment",
    description: "Fantastic. I'm enjoying every moment of it.",
    time: "2 min ago",
  },
  {
    id: 4,
    titleBold: "User Name",
    titleNormal: "replied on your post",
    description: "Fantastic. I'm enjoying every moment of it.",
    time: "2 min ago",
    isUnread: true,
  },
  {
    id: 5,
    titleBold: "User Name",
    titleNormal: "accepted your invitation.",
    description: "You & Username are connection now.",
    time: "2 min ago",
  },
  {
    id: 6,
    titleBold: "User Name",
    titleNormal: "sent you connection request.",
    description: "",
    time: "2 min ago",
  },
];

function NotificationPage() {
  return (
    <section className="w-full bg-white px-3 pb-12 pt-4 md:px-4">
      <h1 className="text-lg font-semibold leading-tight text-headerColor">
        Notifications
      </h1>

      <div className="mt-4 border-t border-borderColor">
        {notifications.map((item) => (
          <article
            key={item.id}
            className="relative flex items-start justify-between gap-3 border-b border-[#d9d9d9] px-3 py-6 md:px-5"
          >
            {/* {item.isUnread && (
              <span className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-x-1.5 -translate-y-1/2 rounded-full bg-[#5b3df5]" />
            )} */}

            <div className="flex  items-start gap-3 md:gap-4">
              <div className="h-10 w-10 shrink-0 rounded-full ">
                <Image
                  src={"/empty_user.jpg"}
                  alt="User Avatar"
                  width={40}
                  height={40}
                  className="rounded-full w-full h-full"
                />
              </div>

              <div className="">
                <p className="text-sm leading-[1.2] text-headerColor ">
                  <span className="font-bold">{item.titleBold}</span>{" "}
                  <span className="font-normal">{item.titleNormal}</span>
                </p>

                {item.description ? (
                  <p className="mt-1 text-xs leading-tight text-descriptionColor ">
                    {item.description}
                  </p>
                ) : null}
              </div>
            </div>

            <p className="shrink-0 pt-1 text-xs leading-none text-descriptionColor">
              {item.time}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NotificationPage;
