import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { updateUserSettings } from "@/api/user";

export default function Settings() {
  const { user, updateSettings } = useAuth();

  const [breakReminderMinutes, setBreakReminderMinutes] = useState(
    user?.settings?.breakReminderMinutes ?? 50
  );

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.settings?.notificationsEnabled ?? true
  );

  const [saved, setSaved] = useState(false);

  if (!user) {
    return null;
  }

  const handleSave = async () => {
    const settings = {
      breakReminderMinutes,
      notificationsEnabled,
    };

    await updateUserSettings(user.username, settings);
    updateSettings(settings);

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };


  return (
    <div className="max-w-2xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Settings
      </h1>


      <div className="bg-gray-100 border border-gray-300 rounded p-6 space-y-6">

        <div>
          <h2 className="font-semibold text-lg">
            Notifications
          </h2>

          <p className="text-sm text-gray-600">
            Configure your work reminders.
          </p>
        </div>


        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) =>
              setNotificationsEnabled(e.target.checked)
            }
          />

          Enable break reminders
        </label>


        <div>
          <label className="block mb-2 font-medium">
            Remind me after
          </label>

          <select
            value={breakReminderMinutes}
            onChange={(e) =>
              setBreakReminderMinutes(Number(e.target.value))
            }
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value={25}>25 minutes</option>
            <option value={50}>50 minutes</option>
            <option value={60}>60 minutes</option>
            <option value={90}>90 minutes</option>
          </select>
        </div>


        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Save Settings
        </button>


        {saved && (
          <p className="text-green-600">
            Settings saved
          </p>
        )}

      </div>

    </div>
  );
}