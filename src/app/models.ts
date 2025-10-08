export interface Habit {
  id?: string;           // Firestore ID
  name: string;          // Habit name
  frequency: string;     // "daily" | "weekly"
  streak: number;        // Current streak count
  lastCompleted?: string; // YYYY-MM-DD of last completion
}
