import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { CookieHelper } from "@/helper/cookie.helper";

// Essential for Echo to find Pusher in a browser environment
if (typeof window !== "undefined") {
  (window as any).Pusher = Pusher;
}

const pusherKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://backend.mindunite.com/api";
const echo = pusherKey ? new Echo({
  broadcaster: "pusher",
  key: pusherKey,
  cluster: pusherCluster,
  forceTLS: true,
  authEndpoint: `${baseUrl}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${CookieHelper.get({ key: "accessToken" })}`,
      Accept: "application/json",
    },
  },
}) : null;

export default echo;