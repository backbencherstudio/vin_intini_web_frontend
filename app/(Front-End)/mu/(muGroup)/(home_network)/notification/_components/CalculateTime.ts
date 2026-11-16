export const calculateTime = (timestamp?: string | null): string => {
  if (!timestamp) return "";
  const now = new Date();
  const past = new Date(timestamp);
  if (isNaN(past.getTime())) return String(timestamp);

  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - past.getTime()) / 1000));

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return mins === 1 ? "1 minute ago" : `${mins} minutes ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return days === 1 ? "1 day ago" : `${days} days ago`;
  } else {
    return past.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: now.getFullYear() === past.getFullYear() ? undefined : "numeric",
    });
  }
};
