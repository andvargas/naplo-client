export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  const permission = await Notification.requestPermission();

  return permission === "granted";
}


export function showBreakNotification(onPause: () => void) {
  const notification = new Notification("Time for a stretch 🏃‍♂️", {
    body: "You've been working for 50 minutes. Click to end session",
    icon: "/icon-192.png",
    requireInteraction: true,
    silent: false,
  });

  notification.onclick = async () => {
    window.focus();
    await onPause();
    notification.close();
  };
}