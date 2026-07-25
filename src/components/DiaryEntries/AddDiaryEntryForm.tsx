import { useState } from "react";

const ENTRY_TYPES = ["work", "personal", "decision", "health"] as const;

interface DiaryFormData {
  diaryEntry: string;
  date: string;
  entryType: string;
  aiSummary?: string;
}

interface Props {
  onSubmit: (data: DiaryFormData) => Promise<void> | void;
  initialValues?: Partial<DiaryFormData>;
  submitLabel?: string;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function AddDiaryEntryForm({ onSubmit, initialValues, submitLabel = "Save Entry" }: Props) {
  const [diaryEntry, setDiaryEntry] = useState(initialValues?.diaryEntry ?? "");
  const [date, setDate] = useState(initialValues?.date ?? todayStr());
  const [entryType, setEntryType] = useState(initialValues?.entryType ?? ENTRY_TYPES[0]);
  const [aiSummary, setAiSummary] = useState(initialValues?.aiSummary ?? "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!diaryEntry.trim()) return;

    await onSubmit({ diaryEntry, date, entryType, aiSummary: aiSummary.trim() || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        className="w-full border rounded p-2 min-h-[120px]"
        placeholder="What did you work on?"
        value={diaryEntry}
        onChange={(e) => setDiaryEntry(e.target.value)}
      />

      <div className="flex gap-3">
        <input
          type="date"
          className="border rounded p-2 flex-1"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <select
          className="border rounded p-2 flex-1"
          value={entryType}
          onChange={(e) => setEntryType(e.target.value)}
        >
          {ENTRY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="ai-summary">
          AI daily summary <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <textarea
          id="ai-summary"
          className="w-full border rounded p-2 min-h-[88px]"
          placeholder="An optional AI-generated summary appears here after Finish."
          value={aiSummary}
          onChange={(e) => setAiSummary(e.target.value)}
        />
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        {submitLabel}
      </button>
    </form>
  );
}
