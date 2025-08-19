'use client';

import { useState, useEffect } from 'react';
import { Question, ExamResult } from '@/types/exam';
import { loadExamState, clearExamState } from '@/utils/examHelpers';
import ExamGenerator from '@/components/exam/ExamGenerator';
import ExamInterface from '@/components/exam/ExamInterface';
import ResultsReport from '@/components/exam/ResultsReport';

type ExamPhase = 'generator' | 'exam' | 'results';

export default function Home() {
  const [currentPhase, setCurrentPhase] = useState<ExamPhase>('generator');
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [examResult, setExamResult] = useState<ExamResult | null>(null);

  // Check for existing exam state on mount
  useEffect(() => {
    const savedState = loadExamState();
    if (savedState && savedState.isStarted && !savedState.isCompleted) {
      setExamQuestions(savedState.questions);
      setCurrentPhase('exam');
    }
  }, []);

  const handleExamStart = (questions: Question[]) => {
    setExamQuestions(questions);
    setCurrentPhase('exam');
  };

  const handleExamComplete = (result: ExamResult) => {
    setExamResult(result);
    setCurrentPhase('results');
  };

  const handleRetakeExam = () => {
    clearExamState();
    setExamQuestions([]);
    setExamResult(null);
    setCurrentPhase('generator');
  };

  const handleExitExam = () => {
    clearExamState();
    setCurrentPhase('generator');
  };

  return (
    <main>
      {currentPhase === 'generator' && (
        <ExamGenerator onExamStart={handleExamStart} />
      )}
      
      {currentPhase === 'exam' && examQuestions.length > 0 && (
        <ExamInterface
          questions={examQuestions}
          onExamComplete={handleExamComplete}
          onExitExam={handleExitExam}
        />
      )}
      
      {currentPhase === 'results' && examResult && (
        <ResultsReport
          result={examResult}
          onRetakeExam={handleRetakeExam}
        />
      )}
    </main>
  );
}
