import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { CookieHelper } from "@/helper/cookie.helper";

// Essential for Echo to find Pusher in a browser environment
if (typeof window !== "undefined") {
  (window as any).Pusher = Pusher;
}

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend.mindunite.com/api";

const echo = pusherKey
  ? new Echo({
      broadcaster: "pusher",
      key: pusherKey,
      cluster: pusherCluster,
      forceTLS: true,
      authorizer: (channel: { name: string }) => ({
        authorize: (
          socketId: string,
          callback: (error: Error | null, authData: any) => void,
        ) => {
          const token = CookieHelper.get({ key: "accessToken" });
          fetch(`${baseUrl}/broadcasting/auth`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token || ""}`,
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name,
            }),
          })
            .then((res) => {
              if (!res.ok) {
                throw new Error(
                  `Broadcast authorization failed with status ${res.status}`,
                );
              }
              return res.json();
            })
            .then((data) => callback(null, data))
            .catch((err) => callback(err, null));
        },
      }),
    })
  : null;

export default echo;