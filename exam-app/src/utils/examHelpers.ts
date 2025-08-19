import { Question, ExamResult, QuestionResult, ExamState } from '@/types/exam';
import { GRADING_SCALE, STORAGE_KEYS } from './constants';

// Shuffle array using the specified method in requirements
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  return shuffled.sort(() => Math.random() - 0.5);
}

// Calculate exam grade based on percentage
export function calculateGrade(percentage: number): string {
  for (const [grade, range] of Object.entries(GRADING_SCALE)) {
    if (percentage >= range.min && percentage <= range.max) {
      return grade;
    }
  }
  return 'G';
}

// Calculate exam results
export function calculateExamResults(
  questions: Question[],
  answers: { [key: string]: string },
  timeSpent: number
): ExamResult {
  const detailedResults: QuestionResult[] = questions.map(question => {
    const userAnswer = answers[question.id] || '';
    const isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
    
    return {
      question,
      userAnswer,
      isCorrect
    };
  });

  const correctAnswers = detailedResults.filter(result => result.isCorrect).length;
  const score = Math.round((correctAnswers / questions.length) * 100);
  const grade = calculateGrade(score);

  // Identify weak areas
  const weakAreas = detailedResults
    .filter(result => !result.isCorrect)
    .map(result => result.question.topic)
    .filter((topic, index, array) => array.indexOf(topic) === index);

  return {
    totalQuestions: questions.length,
    correctAnswers,
    score,
    grade,
    timeSpent,
    weakAreas,
    detailedResults
  };
}

// Format time for display
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Save exam state to localStorage
export function saveExamState(state: ExamState): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EXAM_STATE, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving exam state:', error);
  }
}

// Load exam state from localStorage
export function loadExamState(): ExamState | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.EXAM_STATE);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Error loading exam state:', error);
    return null;
  }
}

// Clear exam state
export function clearExamState(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.EXAM_STATE);
  } catch (error) {
    console.error('Error clearing exam state:', error);
  }
}

// Save exam result to history
export function saveExamResult(result: ExamResult): void {
  try {
    const history = loadExamHistory();
    const updatedHistory = [
      ...history,
      {
        ...result,
        timestamp: new Date().toISOString()
      }
    ];
    localStorage.setItem(STORAGE_KEYS.EXAM_HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving exam result:', error);
  }
}

// Load exam history
export function loadExamHistory(): (ExamResult & { timestamp: string })[] {
  try {
    const history = localStorage.getItem(STORAGE_KEYS.EXAM_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error loading exam history:', error);
    return [];
  }
}