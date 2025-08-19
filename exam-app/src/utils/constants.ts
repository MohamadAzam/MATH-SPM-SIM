// Exam configuration constants
export const EXAM_CONFIG = {
  TOTAL_QUESTIONS: 10,
  EXAM_DURATION: 90 * 60, // 90 minutes in seconds
  WARNING_TIME: 15 * 60, // 15 minutes warning in seconds
  TOPICS: [
    'Algebra',
    'Geometry',
    'Trigonometry',
    'Statistics',
    'Probability',
    'Calculus',
    'Functions',
    'Coordinate Geometry',
    'Matrices',
    'Sequences and Series'
  ],
  DIFFICULTY_DISTRIBUTION: {
    easy: 3,
    medium: 5,
    hard: 2
  }
};

// Grading scale for SPM
export const GRADING_SCALE = {
  'A+': { min: 90, max: 100 },
  'A': { min: 80, max: 89 },
  'A-': { min: 70, max: 79 },
  'B+': { min: 65, max: 69 },
  'B': { min: 60, max: 64 },
  'C+': { min: 55, max: 59 },
  'C': { min: 50, max: 54 },
  'D': { min: 45, max: 49 },
  'E': { min: 40, max: 44 },
  'G': { min: 0, max: 39 }
};

// Local storage keys
export const STORAGE_KEYS = {
  EXAM_STATE: 'spm_exam_state',
  EXAM_HISTORY: 'spm_exam_history',
  USER_PREFERENCES: 'spm_user_preferences'
};

// API endpoints
export const API_CONFIG = {
  GEMINI_ENDPOINT: '/api/gemini/generate-questions',
  RATE_LIMIT_DELAY: 1000 // 1 second between API calls
};