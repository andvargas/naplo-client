import api from "./axios";

export interface DiaryEntry {
  _id: string;
  username: string;
  diaryEntry: string;
  date: string;
  entryType: string;
  aiSummary?: string;
  aiSummaryGeneratedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewDiaryEntry {
  username: string;
  diaryEntry: string;
  date: string;
  entryType: string;
  aiSummary?: string;
}

export const getDiaryEntries = () => api.get<DiaryEntry[]>("/entries");

export const addDiaryEntry = (data: NewDiaryEntry) => api.post("/entries/add", data);

export const generateDiarySummary = (id: string) => api.post<DiaryEntry>(`/entries/${id}/generate-summary`);

export const updateDiaryEntry = (id: string, data: Partial<NewDiaryEntry>) => api.patch<DiaryEntry>(`/entries/${id}`, data);

export const deleteDiaryEntry = (id: string) => api.delete(`/entries/${id}`);
