// Question types for SPM Math/Add Math exam
export interface Question {
  id: string;
  type: 'mcq' | 'subjective';
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string; // in Bahasa Malaysia
  marks: number;
}

// Exam state types
export interface ExamState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: { [key: string]: string };
  timeRemaining: number; // in seconds
  isStarted: boolean;
  isCompleted: boolean;
  startTime: Date | null;
  endTime: Date | null;
}

// Exam results
export interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage
  grade: string;
  timeSpent: number; // in seconds
  weakAreas: string[];
  detailedResults: QuestionResult[];
}

export interface QuestionResult {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
  timeTaken?: number;
}

// API response types
export interface GeminiApiResponse {
  questions: Question[];
  success: boolean;
  error?: string;
}