// User
export interface User {
  id: string
  username: string
  email: string
  activityTypes: string[]
}

export interface AuthResponse {
  token: string
  user: User
}

// Timelog
export interface Timelog {
  _id: string
  username: string
  tasksAccomplished: [string, boolean][]
  duration: number
  startDate: string
  project: string
  customer: string
  activityType: string
  totalDailyMinutes: number
  createdAt: string
  updatedAt: string
}

export type NewTimelog = Omit<Timelog, '_id' | 'createdAt' | 'updatedAt'>

// Weekly data (from /timelogs/weekly)
export interface WeeklyEntry {
  _id: string  // date string e.g. "2024-11-01"
  totalDuration: number
}
// mapping the old array-based format to the new object-based format
export interface LegacyTask {
  originalTask: string;
  completed: boolean;
  completedTask: string;
}

// Task
export interface Subtask {
  title: string
  completed: boolean
}

export interface Task {
  _id: string
  username: string  // ObjectId ref to User
  title: string
  subtasks: Subtask[]
  due?: string
  description?: string
  important: boolean
  list?: string  // ObjectId ref to Project
  createdAt: string
  updatedAt: string
}

export type NewTask = Omit<Task, '_id' | 'createdAt' | 'updatedAt'>

// Project
export interface Project {
  _id: string
  username: string
  projectName?: string
  statusActive?: boolean
  description?: string
  customer?: string
  createdAt: string
  updatedAt: string
}

export type NewProject = Omit<Project, '_id' | 'createdAt' | 'updatedAt'>

// Diary Entry
export interface DiaryEntry {
  _id: string
  username: string
  diaryEntry: string
  date?: string
  entryType: string
  createdAt: string
  updatedAt: string
}

export type NewDiaryEntry = Omit<DiaryEntry, '_id' | 'createdAt' | 'updatedAt'>