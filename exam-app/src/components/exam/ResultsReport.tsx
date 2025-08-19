'use client';

import { useState } from 'react';
import { Card, Typography, Button, Progress, Chip } from '@material-tailwind/react';
import { 
  Trophy, 
  Clock, 
  Target, 
  BookOpen, 
  TrendingDown,
  RotateCcw,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { ExamResult } from '@/types/exam';
import { formatTime } from '@/utils/examHelpers';
import QuestionDisplay from './QuestionDisplay';

interface ResultsReportProps {
  result: ExamResult;
  onRetakeExam: () => void;
}

export default function ResultsReport({ result, onRetakeExam }: ResultsReportProps) {
  const [showDetailedAnswers, setShowDetailedAnswers] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number | null>(null);

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-600 bg-green-50';
      case 'A-':
      case 'B+':
      case 'B':
        return 'text-blue-600 bg-blue-50';
      case 'C+':
      case 'C':
        return 'text-yellow-600 bg-yellow-50';
      case 'D':
      case 'E':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-red-600 bg-red-50';
    }
  };

  const getPerformanceMessage = (score: number) => {
    if (score >= 90) return 'Cemerlang! Prestasi yang sangat baik!';
    if (score >= 80) return 'Bagus! Prestasi yang baik!';
    if (score >= 70) return 'Memuaskan! Teruskan usaha!';
    if (score >= 60) return 'Sederhana. Masih ada ruang untuk penambahbaikan.';
    if (score >= 50) return 'Mencukupi. Perlukan lebih banyak latihan.';
    return 'Perlu usaha lebih. Jangan putus asa!';
  };

  const exportResults = () => {
    const data = {
      examDate: new Date().toLocaleDateString('ms-MY'),
      score: result.score,
      grade: result.grade,
      timeSpent: formatTime(result.timeSpent),
      totalQuestions: result.totalQuestions,
      correctAnswers: result.correctAnswers,
      weakAreas: result.weakAreas,
      detailedResults: result.detailedResults.map(r => ({
        question: r.question.question,
        topic: r.question.topic,
        difficulty: r.question.difficulty,
        userAnswer: r.userAnswer,
        correctAnswer: r.question.correctAnswer,
        isCorrect: r.isCorrect,
        explanation: r.question.explanation
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SPM_Exam_Results_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Typography variant="h1" className="text-4xl font-bold text-blue-900 mb-2">
              Keputusan Peperiksaan
            </Typography>
            <Typography variant="lead" className="text-blue-700">
              SPM Matematik / Matematik Tambahan
            </Typography>
          </div>

          {/* Overall Results */}
          <Card className="p-8 mb-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Trophy className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              
              <Typography variant="h2" className="text-6xl font-bold text-blue-900 mb-2">
                {result.score}%
              </Typography>
              
              <div className={`inline-flex px-6 py-2 rounded-full text-2xl font-bold ${getGradeColor(result.grade)}`}>
                Gred {result.grade}
              </div>
              
              <Typography variant="lead" className="text-blue-700 mt-4">
                {getPerformanceMessage(result.score)}
              </Typography>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="p-4 bg-blue-50 border border-blue-200">
                <div className="flex items-center gap-3">
                  <Target className="w-8 h-8 text-blue-600" />
                  <div>
                    <Typography variant="h6" className="text-blue-800 font-bold">
                      {result.correctAnswers}/{result.totalQuestions}
                    </Typography>
                    <Typography variant="small" className="text-blue-600">
                      Jawapan Betul
                    </Typography>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-green-50 border border-green-200">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-green-600" />
                  <div>
                    <Typography variant="h6" className="text-green-800 font-bold">
                      {formatTime(result.timeSpent)}
                    </Typography>
                    <Typography variant="small" className="text-green-600">
                      Masa Digunakan
                    </Typography>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-purple-50 border border-purple-200">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                  <div>
                    <Typography variant="h6" className="text-purple-800 font-bold">
                      {((result.correctAnswers / result.totalQuestions) * 100).toFixed(0)}%
                    </Typography>
                    <Typography variant="small" className="text-purple-600">
                      Kadar Kejayaan
                    </Typography>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-orange-50 border border-orange-200">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-8 h-8 text-orange-600" />
                  <div>
                    <Typography variant="h6" className="text-orange-800 font-bold">
                      {result.weakAreas.length}
                    </Typography>
                    <Typography variant="small" className="text-orange-600">
                      Topik Lemah
                    </Typography>
                  </div>
                </div>
              </Card>
            </div>

            {/* Progress Bars */}
            <div className="space-y-4 mb-8">
              <div>
                <div className="flex justify-between mb-2">
                  <Typography variant="small" className="text-gray-600">
                    Prestasi Keseluruhan
                  </Typography>
                  <Typography variant="small" className="font-medium">
                    {result.score}%
                  </Typography>
                </div>
                <Progress value={result.score} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Typography variant="small" className="text-gray-600">
                    Efisiensi Masa
                  </Typography>
                  <Typography variant="small" className="font-medium">
                    {Math.round((result.timeSpent / (90 * 60)) * 100)}%
                  </Typography>
                </div>
                <Progress 
                  value={(result.timeSpent / (90 * 60)) * 100} 
                  className="h-3"
                  color="success"
                />
              </div>
            </div>
          </Card>

          {/* Weak Areas Analysis */}
          {result.weakAreas.length > 0 && (
            <Card className="p-6 mb-8">
              <Typography variant="h5" className="text-red-800 mb-4 flex items-center gap-2">
                <TrendingDown className="w-6 h-6" />
                Analisis Kawasan Lemah
              </Typography>
              <Typography className="text-gray-600 mb-4">
                Ini cara dapat jawapan: Topik-topik yang perlu diberi perhatian untuk penambahbaikan prestasi.
              </Typography>
              <div className="flex flex-wrap gap-2">
                {result.weakAreas.map((area, index) => (
                  <Chip
                    key={index}
                    className="bg-red-100 text-red-800"
                  >
                    {area}
                  </Chip>
                ))}
              </div>
            </Card>
          )}

          {/* Detailed Answers Section */}
          <Card className="p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <Typography variant="h5" className="text-gray-800">
                Jawapan Terperinci
              </Typography>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDetailedAnswers(!showDetailedAnswers)}
                className="flex items-center gap-2"
              >
                {showDetailedAnswers ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Sembunyikan
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Tunjukkan
                  </>
                )}
              </Button>
            </div>

            {showDetailedAnswers && (
              <div className="space-y-6">
                {/* Question Summary Grid */}
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
                  {result.detailedResults.map((questionResult, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedQuestionIndex(
                        selectedQuestionIndex === index ? null : index
                      )}
                      className={`w-10 h-10 rounded text-sm font-medium transition-all duration-200 ${
                        questionResult.isCorrect
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      } ${selectedQuestionIndex === index ? 'ring-4 ring-blue-300' : ''}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {/* Selected Question Detail */}
                {selectedQuestionIndex !== null && (
                  <div className="border-t pt-6">
                    <QuestionDisplay
                      question={result.detailedResults[selectedQuestionIndex].question}
                      questionNumber={selectedQuestionIndex + 1}
                      totalQuestions={result.totalQuestions}
                      userAnswer={result.detailedResults[selectedQuestionIndex].userAnswer}
                      onAnswerChange={() => {}} // Read-only in review mode
                      isReviewMode={true}
                    />
                    
                    <Card className={`p-4 mt-4 ${
                      result.detailedResults[selectedQuestionIndex].isCorrect
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <Typography variant="h6" className={`font-semibold ${
                        result.detailedResults[selectedQuestionIndex].isCorrect
                          ? 'text-green-800'
                          : 'text-red-800'
                      }`}>
                        {result.detailedResults[selectedQuestionIndex].isCorrect 
                          ? '✅ Jawapan Betul!' 
                          : '❌ Jawapan Salah'
                        }
                      </Typography>
                      <Typography variant="small" className="text-gray-600 mt-1">
                        Jawapan anda: {result.detailedResults[selectedQuestionIndex].userAnswer || 'Tidak dijawab'}
                      </Typography>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={onRetakeExam}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700"
            >
              <RotateCcw className="w-5 h-5" />
              Cuba Lagi
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={exportResults}
              className="flex items-center gap-3"
            >
              <Download className="w-5 h-5" />
              Muat Turun Keputusan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}