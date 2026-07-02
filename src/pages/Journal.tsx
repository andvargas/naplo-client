import { useState } from "react";
import useDiaryEntries from "@/hooks/useDiaryEntries";
import Modal from "@/components/Modal/Modal";
import AddDiaryEntryForm from "@/components/DiaryEntries/AddDiaryEntryForm";
import { updateDiaryEntry, deleteDiaryEntry, type DiaryEntry } from "@/api/diaryentries";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

const ENTRY_TYPES = ["work", "personal", "decision", "health"];

const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : "—");

function JournalEntry({ entry, onEdit, onDelete }: { entry: DiaryEntry; onEdit: (entry: DiaryEntry) => void; onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg bg-white overflow-hidden">
      {/* Top row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 gap-4">
        <div className="text-xs text-gray-500 font-semibold">
          {formatDate(entry.date)} · <span className="uppercase tracking-wide">{entry.entryType}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => onEdit(entry)} className="px-2 py-0.5 text-xs border rounded hover:bg-gray-100">
            Edit
          </button>
          <button onClick={() => onDelete(entry._id)} className="px-2 py-0.5 text-xs border rounded text-red-600 hover:bg-red-50">
            Delete
          </button>
        </div>
      </div>

      {/* Text */}
      <div className="px-4 pb-2 text-left">
        <p className={`text-sm whitespace-pre-wrap text-gray-800 ${expanded ? "" : "line-clamp-3"}`}>{entry.diaryEntry}</p>
      </div>

      {/* Expand/collapse toggle */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-center py-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors border-t border-gray-100"
      >
        {expanded ? <LuChevronUp size={16} /> : <LuChevronDown size={16} />}
      </button>
    </div>
  );
}

const Journal: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [filterType, setFilterType] = useState<string>("");

  const { entries, loading, refreshEntries, createEntry } = useDiaryEntries();

  const filteredEntries = filterType ? entries.filter((e) => e.entryType === filterType) : entries;

  const handleAdd = async (data: { diaryEntry: string; date: string; entryType: string }) => {
    try {
      await createEntry(data);
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      setError("Failed to add entry");
    }
  };

  const handleUpdate = async (data: { diaryEntry: string; date: string; entryType: string }) => {
    if (!editingEntry) return;

    try {
      await updateDiaryEntry(editingEntry._id, data);
      await refreshEntries();
      setEditingEntry(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update entry");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDiaryEntry(id);
      await refreshEntries();
    } catch (err) {
      console.error(err);
      setError("Failed to delete entry");
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading journal...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Journal</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm">
          Add Entry
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setFilterType("")}
          className={`px-3 py-1 text-sm rounded border ${filterType === "" ? "bg-gray-800 text-white" : "hover:bg-gray-100"}`}
        >
          All
        </button>
        {ENTRY_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1 text-sm rounded border capitalize ${filterType === type ? "bg-gray-800 text-white" : "hover:bg-gray-100"}`}
          >
            {type}
          </button>
        ))}
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="space-y-2">
        {filteredEntries.map((entry) => (
          <JournalEntry key={entry._id} entry={entry} onEdit={setEditingEntry} onDelete={handleDelete} />
        ))}

        {filteredEntries.length === 0 && <div className="text-gray-500 text-center py-8">No journal entries yet.</div>}
      </div>

      <Modal isOpen={showAddModal} title="Add Journal Entry" onClose={() => setShowAddModal(false)}>
        <AddDiaryEntryForm onSubmit={handleAdd} />
      </Modal>

      <Modal isOpen={!!editingEntry} title="Edit Journal Entry" onClose={() => setEditingEntry(null)}>
        {editingEntry && (
          <AddDiaryEntryForm
            initialValues={{
              diaryEntry: editingEntry.diaryEntry,
              date: editingEntry.date ? editingEntry.date.slice(0, 10) : "",
              entryType: editingEntry.entryType,
            }}
            submitLabel="Save changes"
            onSubmit={handleUpdate}
          />
        )}
      </Modal>
    </div>
  );
};

export default Journal;