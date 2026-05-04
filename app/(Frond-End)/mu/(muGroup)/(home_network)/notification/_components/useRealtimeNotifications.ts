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
    const channelName = `App.Models.User.${userId}`;
    const channel = echo.private(channelName);

    channel.notification((data: any) => {
      console.log("🔥 Notification Received:", data);
      dispatch(baseApiSlice.util.invalidateTags(["Notifications"]));
    });

    return () => {
      console.log(`🛑 Unsubscribing from: ${channelName}`);
      echo.leave(channelName);
    };
  }, [userId, dispatch]);
};
