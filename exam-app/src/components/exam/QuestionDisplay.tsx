'use client';

import { useState } from 'react';
import { Card, Typography, Textarea } from '@material-tailwind/react';
import { Question } from '@/types/exam';
import { shuffleArray } from '@/utils/examHelpers';

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  isReviewMode?: boolean;
}

export default function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  userAnswer,
  onAnswerChange,
  isReviewMode = false
}: QuestionDisplayProps) {
  // Shuffle options for MCQ questions
  const [shuffledOptions] = useState(() => {
    if (question.type === 'mcq' && question.options) {
      return shuffleArray(question.options);
    }
    return question.options || [];
  });

  const handleMCQChange = (value: string) => {
    if (!isReviewMode) {
      onAnswerChange(value);
    }
  };

  const handleSubjectiveChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isReviewMode) {
      onAnswerChange(e.target.value);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-orange-600 bg-orange-50';
      case 'hard':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Mudah';
      case 'medium':
        return 'Sederhana';
      case 'hard':
        return 'Sukar';
      default:
        return difficulty;
    }
  };

  return (
    <Card className="p-6 w-full">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Typography variant="h5" className="font-bold text-blue-gray-800">
            Soalan {questionNumber} daripada {totalQuestions}
          </Typography>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.difficulty)}`}>
            {getDifficultyText(question.difficulty)}
          </span>
        </div>
        <div className="text-right">
          <Typography variant="small" className="text-gray-600">
            Topik: {question.topic}
          </Typography>
          <Typography variant="small" className="text-blue-600 font-medium">
            {question.marks} markah
          </Typography>
        </div>
      </div>

      {/* Question Text */}
      <Card className="p-4 bg-gray-50 mb-6">
        <Typography variant="lead" className="text-gray-800 leading-relaxed">
          {question.question}
        </Typography>
      </Card>

      {/* Answer Section */}
      <div className="space-y-4">
        <Typography variant="h6" className="text-gray-700 font-semibold">
          Jawapan Anda:
        </Typography>

        {question.type === 'mcq' ? (
          // Multiple Choice Questions
          <div className="space-y-3">
            {shuffledOptions.map((option, index) => (
              <Card
                key={index}
                className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                  userAnswer === option.split('.')[0] 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${isReviewMode ? 'cursor-not-allowed opacity-75' : ''}`}
                onClick={() => handleMCQChange(option.split('.')[0])}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id={`${question.id}-${index}`}
                    name={`question-${question.id}`}
                    value={option.split('.')[0]}
                    checked={userAnswer === option.split('.')[0]}
                    onChange={(e) => handleMCQChange(e.target.value)}
                    disabled={isReviewMode}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                  <label 
                    htmlFor={`${question.id}-${index}`}
                    className={`flex-1 text-gray-700 cursor-pointer ${isReviewMode ? 'cursor-not-allowed' : ''}`}
                  >
                    {option}
                  </label>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // Subjective Questions
          <div>
            <Textarea
              value={userAnswer}
              onChange={handleSubjectiveChange}
              placeholder="Tulis jawapan anda di sini..."
              className="min-h-32"
              disabled={isReviewMode}
              rows={6}
            />
            <Typography variant="small" className="text-gray-500 mt-2">
              Tip: Tunjukkan langkah-langkah pengiraan untuk mendapat markah penuh
            </Typography>
          </div>
        )}
      </div>

      {/* Review Mode - Show Correct Answer */}
      {isReviewMode && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Typography variant="h6" className="text-green-600 font-semibold">
                Jawapan Betul:
              </Typography>
              <Typography className="text-green-700 font-medium">
                {question.correctAnswer}
              </Typography>
            </div>
            
            <Card className="p-4 bg-green-50 border border-green-200">
              <Typography variant="h6" className="text-green-800 mb-2">
                Penjelasan:
              </Typography>
              <Typography className="text-green-700 leading-relaxed">
                {question.explanation}
              </Typography>
            </Card>
          </div>
        </div>
      )}
    </Card>
  );
}