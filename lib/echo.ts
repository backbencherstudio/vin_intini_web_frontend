import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { CookieHelper } from "@/helper/cookie.helper";

// Make Pusher globally available as Echo expects
(window as any).Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "b317efddf3bcedbd0d81", // Pass the key directly here
  cluster: "mt1",
  forceTLS: true,
  authEndpoint: "https://vin.apphero.agency/api/broadcasting/auth",
  auth: {
    headers: {
      Authorization: `Bearer ${CookieHelper.get({ key: "accessToken" })}`,
      Accept: "application/json",
    },
  },
});

export default echo;
