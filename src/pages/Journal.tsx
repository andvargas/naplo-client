import { useState } from "react";
import useDiaryEntries from "@/hooks/useDiaryEntries";
import Modal from "@/components/Modal/Modal";
import AddDiaryEntryForm from "@/components/DiaryEntries/AddDiaryEntryForm";
import { updateDiaryEntry, deleteDiaryEntry, type DiaryEntry } from "@/api/diaryentries";

const ENTRY_TYPES = ["work", "personal", "decision", "health"];

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

  const formatDate = (date?: string) => (date ? new Date(date).toLocaleDateString() : "—");

  if (loading) {
    return <div className="p-6 text-gray-500">Loading journal...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Journal</h1>
        <button onClick={() => setShowAddModal(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Add Entry
        </button>
      </div>

      <div className="flex gap-2 mb-4">
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

      <div className="space-y-3">
        {filteredEntries.map((entry) => (
          <div key={entry._id} className="border rounded-lg p-3 bg-white">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="font-bold text-sm text-gray-500 mb-1 text-left">
                  {formatDate(entry.date)} · <span className="uppercase text-xs font-bold">{entry.entryType}</span>
                </div>
                <div className="whitespace-pre-wrap text-left">{entry.diaryEntry}</div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditingEntry(entry)} className="px-3 py-1 text-sm border rounded hover:bg-gray-100">
                  Edit
                </button>
                <button onClick={() => handleDelete(entry._id)} className="px-3 py-1 text-sm border rounded text-red-600 hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          </div>
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