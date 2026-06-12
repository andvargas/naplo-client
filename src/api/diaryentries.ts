import api from "./axios";

export interface DiaryEntry {
  _id: string;
  username: string;
  diaryEntry: string;
  date: string;
  entryType: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewDiaryEntry {
  username: string;
  diaryEntry: string;
  date: string;
  entryType: string;
}

export const getDiaryEntries = () =>
  api.get<DiaryEntry[]>("/entries");

export const addDiaryEntry = (
  data: NewDiaryEntry
) => api.post("/entries/add", data);