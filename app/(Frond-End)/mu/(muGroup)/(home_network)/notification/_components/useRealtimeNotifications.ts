import { useEffect } from "react";
import { useDispatch } from "react-redux";
import echo from "@/lib/echo";
import baseApiSlice from "@/feature/slice/baseApi";

export const useRealtimeNotifications = (
  userId: string | number | undefined,
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;
    const channel = echo.private(`App.Models.User.${userId}`);
    console.log(`Subscribed to channel: App.Models.User: `, userId);

    channel.listen(
      ".Illuminate\\Notifications\\Events\\BroadcastNotificationCreated",
      (data: any) => {
        console.log("GOT IT! Raw notification arrived:", data);
        dispatch(baseApiSlice.util.invalidateTags(["Notifications"]));
      },
    );

    return () => {
      echo.leave(`App.Models.User.${userId}`);
    };
  }, [userId, dispatch]);
};
