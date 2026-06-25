import { useEffect, useState } from "react";
import { getDiaryEntries, addDiaryEntry, type DiaryEntry, type NewDiaryEntry } from "@/api/diaryentries";
import { useAuth } from "@/context/AuthContext";

export default function useDiaryEntries() {
  const { user } = useAuth();

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = async () => {
    if (!user) return;

    try {
      const res = await getDiaryEntries();
      const filtered = res.data.filter((e) => e.username === user.username);

      const sorted = [...filtered].sort(
        (a, b) => new Date(b.date ?? b.createdAt).getTime() - new Date(a.date ?? a.createdAt).getTime()
      );

      setEntries(sorted);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [user]);

  const createEntry = async (data: Omit<NewDiaryEntry, "username">) => {
    if (!user) return;
    await addDiaryEntry({ ...data, username: user.username });
    await loadEntries();
  };

  return {
    entries,
    loading,
    refreshEntries: loadEntries,
    createEntry,
  };
}