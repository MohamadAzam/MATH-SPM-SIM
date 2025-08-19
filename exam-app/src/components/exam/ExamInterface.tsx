'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Button, Progress } from '@material-tailwind/react';
import { ChevronLeft, ChevronRight, Flag, CheckCircle } from 'lucide-react';
import { Question, ExamState, ExamResult } from '@/types/exam';
import { EXAM_CONFIG } from '@/utils/constants';
import { 
  calculateExamResults, 
  saveExamState, 
  clearExamState,
  saveExamResult
} from '@/utils/examHelpers';
import TimerComponent from './TimerComponent';
import QuestionDisplay from './QuestionDisplay';

interface ExamInterfaceProps {
  questions: Question[];
  onExamComplete: (result: ExamResult) => void;
  onExitExam: () => void;
}

export default function ExamInterface({ 
  questions, 
  onExamComplete, 
  onExitExam 
}: ExamInterfaceProps) {
  const [examState, setExamState] = useState<ExamState>({
    questions,
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: EXAM_CONFIG.EXAM_DURATION,
    isStarted: true,
    isCompleted: false,
    startTime: new Date(),
    endTime: null
  });

  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfirmExit, setShowConfirmExit] = useState(false);

  // Save exam state to localStorage whenever it changes
  useEffect(() => {
    saveExamState(examState);
  }, [examState]);

  const handleAnswerChange = (answer: string) => {
    const currentQuestion = examState.questions[examState.currentQuestionIndex];
    setExamState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: answer
      }
    }));
  };

  const handleNextQuestion = () => {
    if (examState.currentQuestionIndex < examState.questions.length - 1) {
      setExamState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (examState.currentQuestionIndex > 0) {
      setExamState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  const handleQuestionJump = (index: number) => {
    setExamState(prev => ({
      ...prev,
      currentQuestionIndex: index
    }));
  };

  const handleTimeUpdate = (timeRemaining: number) => {
    setExamState(prev => ({
      ...prev,
      timeRemaining
    }));
  };

  const handleTimeUp = () => {
    handleSubmitExam();
  };

  const handleSubmitExam = () => {
    const endTime = new Date();
    const timeSpent = EXAM_CONFIG.EXAM_DURATION - examState.timeRemaining;
    
    const result = calculateExamResults(
      examState.questions,
      examState.answers,
      timeSpent
    );

    // Save result to history
    saveExamResult(result);
    
    // Clear exam state
    clearExamState();
    
    // Mark exam as completed
    setExamState(prev => ({
      ...prev,
      isCompleted: true,
      endTime
    }));

    onExamComplete(result);
  };

  const currentQuestion = examState.questions[examState.currentQuestionIndex];
  const currentAnswer = examState.answers[currentQuestion?.id] || '';
  const answeredQuestions = Object.keys(examState.answers).length;
  const progressPercentage = (answeredQuestions / examState.questions.length) * 100;

  // Check if current question is answered
  const isCurrentQuestionAnswered = !!currentAnswer.trim();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Timer */}
      <div className="sticky top-0 z-20 bg-white shadow-md">
        <div className="container mx-auto px-4 py-2">
          <TimerComponent
            timeRemaining={examState.timeRemaining}
            onTimeUp={handleTimeUp}
            onTimeUpdate={handleTimeUpdate}
            isActive={examState.isStarted && !examState.isCompleted}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Question Navigation Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-4 sticky top-32">
                <Typography variant="h6" className="text-gray-800 mb-4">
                  Navigasi Soalan
                </Typography>
                
                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Dijawab</span>
                    <span>{answeredQuestions}/{examState.questions.length}</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                {/* Question Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {examState.questions.map((question, index) => {
                    const isAnswered = !!examState.answers[question.id];
                    const isCurrent = index === examState.currentQuestionIndex;
                    
                    return (
                      <button
                        key={question.id}
                        onClick={() => handleQuestionJump(index)}
                        className={`w-8 h-8 rounded text-sm font-medium transition-all duration-200 ${
                          isCurrent
                            ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                            : isAnswered
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span className="text-gray-600">Semasa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-gray-600">Dijawab</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <span className="text-gray-600">Belum dijawab</span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  size="sm"
                  className="w-full mt-6 bg-red-600 hover:bg-red-700"
                  onClick={() => setShowConfirmSubmit(true)}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Hantar Peperiksaan
                </Button>
              </Card>
            </div>

            {/* Main Question Area */}
            <div className="lg:col-span-3">
              <QuestionDisplay
                question={currentQuestion}
                questionNumber={examState.currentQuestionIndex + 1}
                totalQuestions={examState.questions.length}
                userAnswer={currentAnswer}
                onAnswerChange={handleAnswerChange}
              />

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePreviousQuestion}
                  disabled={examState.currentQuestionIndex === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Sebelumnya
                </Button>

                <div className="flex items-center gap-2">
                  {isCurrentQuestionAnswered && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  <Typography variant="small" className="text-gray-600">
                    {examState.currentQuestionIndex + 1} daripada {examState.questions.length}
                  </Typography>
                </div>

                <Button
                  size="lg"
                  onClick={handleNextQuestion}
                  disabled={examState.currentQuestionIndex === examState.questions.length - 1}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  Seterusnya
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md mx-4">
            <Typography variant="h5" className="text-gray-800 mb-4">
              Hantar Peperiksaan?
            </Typography>
            <Typography className="text-gray-600 mb-6">
              Anda telah menjawab {answeredQuestions} daripada {examState.questions.length} soalan.
              Adakah anda pasti ingin menghantar peperiksaan sekarang?
            </Typography>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmSubmit(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitExam}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Ya, Hantar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Confirm Exit Modal */}
      {showConfirmExit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md mx-4">
            <Typography variant="h5" className="text-gray-800 mb-4">
              Keluar Peperiksaan?
            </Typography>
            <Typography className="text-gray-600 mb-6">
              Semua jawapan anda akan hilang. Adakah anda pasti ingin keluar?
            </Typography>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmExit(false)}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  clearExamState();
                  onExitExam();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Ya, Keluar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}