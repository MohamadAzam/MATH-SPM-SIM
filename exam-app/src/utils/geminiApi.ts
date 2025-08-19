import { GoogleGenerativeAI } from '@google/generative-ai';
import { Question } from '@/types/exam';
import { EXAM_CONFIG } from './constants';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Generate SPM Math/Add Math questions using Gemini API
export async function generateQuestions(): Promise<Question[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
Generate exactly ${EXAM_CONFIG.TOTAL_QUESTIONS} SPM Mathematics/Additional Mathematics exam questions in JSON format. 
The questions should be based on SPM 2021-2025 and trial papers.

Requirements:
- Mix of ${EXAM_CONFIG.DIFFICULTY_DISTRIBUTION.easy} easy, ${EXAM_CONFIG.DIFFICULTY_DISTRIBUTION.medium} medium, and ${EXAM_CONFIG.DIFFICULTY_DISTRIBUTION.hard} hard questions
- Include both multiple choice (MCQ) and subjective questions
- Topics should cover: ${EXAM_CONFIG.TOPICS.join(', ')}
- All explanations must be in Bahasa Malaysia starting with "Ini cara dapat jawapan:"
- For MCQ questions, provide exactly 4 options labeled A, B, C, D

Return ONLY a valid JSON array with this exact format:
[
  {
    "id": "q1",
    "type": "mcq",
    "topic": "Algebra",
    "difficulty": "easy",
    "question": "Selesaikan persamaan 2x + 5 = 11",
    "options": ["A. x = 2", "B. x = 3", "C. x = 4", "D. x = 5"],
    "correctAnswer": "B",
    "explanation": "Ini cara dapat jawapan: 2x + 5 = 11, 2x = 11 - 5, 2x = 6, x = 3",
    "marks": 2
  },
  {
    "id": "q2",
    "type": "subjective",
    "topic": "Geometry",
    "difficulty": "medium",
    "question": "Kirakan luas segi tiga dengan tapak 8 cm dan tinggi 6 cm",
    "correctAnswer": "24 cm²",
    "explanation": "Ini cara dapat jawapan: Luas = 1/2 × tapak × tinggi = 1/2 × 8 × 6 = 24 cm²",
    "marks": 3
  }
]

Generate ${EXAM_CONFIG.TOTAL_QUESTIONS} questions following this format exactly.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Extract JSON from response
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.slice(7);
    }
    if (jsonText.endsWith('```')) {
      jsonText = jsonText.slice(0, -3);
    }

    const questions = JSON.parse(jsonText);
    
    // Validate questions
    if (!Array.isArray(questions) || questions.length !== EXAM_CONFIG.TOTAL_QUESTIONS) {
      throw new Error('Invalid number of questions generated');
    }

    // Validate each question structure
    questions.forEach((q, index) => {
      if (!q.id || !q.type || !q.topic || !q.difficulty || !q.question || !q.correctAnswer || !q.explanation || !q.marks) {
        throw new Error(`Invalid question structure at index ${index}`);
      }
      
      if (q.type === 'mcq' && (!q.options || q.options.length !== 4)) {
        throw new Error(`MCQ question at index ${index} must have exactly 4 options`);
      }
    });

    return questions;
  } catch (error) {
    console.error('Error generating questions with Gemini:', error);
    // Return fallback questions if API fails
    return getFallbackQuestions();
  }
}

// Fallback questions when API is unavailable
function getFallbackQuestions(): Question[] {
  return [
    {
      id: "q1",
      type: "mcq",
      topic: "Algebra",
      difficulty: "easy",
      question: "Selesaikan persamaan 2x + 5 = 11",
      options: ["A. x = 2", "B. x = 3", "C. x = 4", "D. x = 5"],
      correctAnswer: "B",
      explanation: "Ini cara dapat jawapan: 2x + 5 = 11, 2x = 11 - 5, 2x = 6, x = 3",
      marks: 2
    },
    {
      id: "q2",
      type: "subjective",
      topic: "Geometry",
      difficulty: "medium",
      question: "Kirakan luas segi tiga dengan tapak 8 cm dan tinggi 6 cm",
      correctAnswer: "24",
      explanation: "Ini cara dapat jawapan: Luas = 1/2 × tapak × tinggi = 1/2 × 8 × 6 = 24 cm²",
      marks: 3
    },
    {
      id: "q3",
      type: "mcq",
      topic: "Statistics",
      difficulty: "easy",
      question: "Min bagi set data {2, 4, 6, 8, 10} ialah:",
      options: ["A. 5", "B. 6", "C. 7", "D. 8"],
      correctAnswer: "B",
      explanation: "Ini cara dapat jawapan: Min = (2 + 4 + 6 + 8 + 10) ÷ 5 = 30 ÷ 5 = 6",
      marks: 2
    },
    {
      id: "q4",
      type: "mcq",
      topic: "Trigonometry",
      difficulty: "medium",
      question: "Nilai sin 30° ialah:",
      options: ["A. 1/2", "B. √3/2", "C. 1", "D. √2/2"],
      correctAnswer: "A",
      explanation: "Ini cara dapat jawapan: sin 30° = 1/2 (nilai asas trigonometri)",
      marks: 2
    },
    {
      id: "q5",
      type: "subjective",
      topic: "Algebra",
      difficulty: "hard",
      question: "Selesaikan persamaan kuadratik x² - 5x + 6 = 0",
      correctAnswer: "x = 2 atau x = 3",
      explanation: "Ini cara dapat jawapan: x² - 5x + 6 = 0, (x - 2)(x - 3) = 0, jadi x = 2 atau x = 3",
      marks: 4
    },
    {
      id: "q6",
      type: "mcq",
      topic: "Functions",
      difficulty: "medium",
      question: "Jika f(x) = 2x + 3, maka f(5) ialah:",
      options: ["A. 10", "B. 11", "C. 12", "D. 13"],
      correctAnswer: "D",
      explanation: "Ini cara dapat jawapan: f(5) = 2(5) + 3 = 10 + 3 = 13",
      marks: 2
    },
    {
      id: "q7",
      type: "mcq",
      topic: "Probability",
      difficulty: "easy",
      question: "Kebarangkalian mendapat nombor genap apabila melontar dadu ialah:",
      options: ["A. 1/6", "B. 1/3", "C. 1/2", "D. 2/3"],
      correctAnswer: "C",
      explanation: "Ini cara dapat jawapan: Nombor genap pada dadu: 2, 4, 6. Jadi 3/6 = 1/2",
      marks: 2
    },
    {
      id: "q8",
      type: "subjective",
      topic: "Coordinate Geometry",
      difficulty: "hard",
      question: "Cari jarak antara titik A(2, 3) dan B(6, 6)",
      correctAnswer: "5",
      explanation: "Ini cara dapat jawapan: Jarak = √[(6-2)² + (6-3)²] = √[16 + 9] = √25 = 5",
      marks: 4
    },
    {
      id: "q9",
      type: "mcq",
      topic: "Sequences and Series",
      difficulty: "medium",
      question: "Sebutan ke-5 dalam jujukan aritmetik 3, 7, 11, 15, ... ialah:",
      options: ["A. 17", "B. 19", "C. 21", "D. 23"],
      correctAnswer: "B",
      explanation: "Ini cara dapat jawapan: a = 3, d = 4, T₅ = 3 + (5-1)×4 = 3 + 16 = 19",
      marks: 3
    },
    {
      id: "q10",
      type: "subjective",
      topic: "Calculus",
      difficulty: "hard",
      question: "Cari terbitan bagi y = x² + 3x - 2",
      correctAnswer: "dy/dx = 2x + 3",
      explanation: "Ini cara dapat jawapan: dy/dx = d/dx(x²) + d/dx(3x) - d/dx(2) = 2x + 3 - 0 = 2x + 3",
      marks: 4
    }
  ];
}