'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Button, Spinner } from '@material-tailwind/react';
import { Play, RefreshCw, BookOpen } from 'lucide-react';
import { Question } from '@/types/exam';
import { generateQuestions } from '@/utils/geminiApi';
import { shuffleArray } from '@/utils/examHelpers';
import { EXAM_CONFIG } from '@/utils/constants';

interface ExamGeneratorProps {
  onExamStart: (questions: Question[]) => void;
}

export default function ExamGenerator({ onExamStart }: ExamGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string>('');

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    setError('');

    try {
      const generatedQuestions = await generateQuestions();
      // Shuffle the questions order
      const shuffledQuestions = shuffleArray(generatedQuestions);
      setQuestions(shuffledQuestions);
    } catch (err) {
      setError('Gagal menjana soalan. Sila cuba lagi.');
      console.error('Error generating questions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartExam = () => {
    if (questions.length === EXAM_CONFIG.TOTAL_QUESTIONS) {
      onExamStart(questions);
    }
  };

  useEffect(() => {
    // Auto-generate questions on component mount
    handleGenerateQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Typography variant="h1" className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
              Simulator Peperiksaan SPM
            </Typography>
            <Typography variant="h3" className="text-2xl text-blue-700 mb-2">
              Matematik / Matematik Tambahan
            </Typography>
            <Typography variant="lead" className="text-blue-600 max-w-2xl mx-auto">
              Sistem simulasi peperiksaan yang lengkap dengan 10 soalan rawak, masa terhad 90 minit, 
              dan analisis terperinci hasil prestasi anda.
            </Typography>
          </div>

          {/* Main Card */}
          <Card className="p-8 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-6">
                <div className="bg-blue-100 p-4 rounded-full">
                  <BookOpen className="w-12 h-12 text-blue-600" />
                </div>
              </div>

              <Typography variant="h4" className="text-gray-800 font-semibold">
                Maklumat Peperiksaan
              </Typography>

              {/* Exam Info */}
              <div className="grid md:grid-cols-3 gap-6 my-8">
                <Card className="p-4 bg-blue-50 border border-blue-200">
                  <Typography variant="h6" className="text-blue-800 font-bold">
                    {EXAM_CONFIG.TOTAL_QUESTIONS}
                  </Typography>
                  <Typography variant="small" className="text-blue-600">
                    Jumlah Soalan
                  </Typography>
                </Card>

                <Card className="p-4 bg-green-50 border border-green-200">
                  <Typography variant="h6" className="text-green-800 font-bold">
                    90 Minit
                  </Typography>
                  <Typography variant="small" className="text-green-600">
                    Masa Dibenarkan
                  </Typography>
                </Card>

                <Card className="p-4 bg-purple-50 border border-purple-200">
                  <Typography variant="h6" className="text-purple-800 font-bold">
                    Auto-Gred
                  </Typography>
                  <Typography variant="small" className="text-purple-600">
                    Penilaian Automatik
                  </Typography>
                </Card>
              </div>

              {/* Topics Covered */}
              <div className="mb-8">
                <Typography variant="h6" className="text-gray-700 mb-4">
                  Topik Yang Diliputi:
                </Typography>
                <div className="flex flex-wrap gap-2 justify-center">
                  {EXAM_CONFIG.TOPICS.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Generation Status */}
              {isGenerating && (
                <Card className="p-6 bg-blue-50 border border-blue-200">
                  <div className="flex items-center justify-center gap-3">
                    <Spinner className="w-6 h-6 text-blue-600" />
                    <Typography className="text-blue-800">
                      Menjana soalan peperiksaan...
                    </Typography>
                  </div>
                  <Typography variant="small" className="text-blue-600 mt-2">
                    Ini mungkin mengambil masa beberapa saat
                  </Typography>
                </Card>
              )}

              {error && (
                <Card className="p-4 bg-red-50 border border-red-200">
                  <Typography className="text-red-800 font-medium">
                    {error}
                  </Typography>
                </Card>
              )}

              {questions.length > 0 && !isGenerating && (
                <Card className="p-6 bg-green-50 border border-green-200">
                  <Typography className="text-green-800 font-medium mb-2">
                    ✅ Soalan berjaya dijana!
                  </Typography>
                  <Typography variant="small" className="text-green-600">
                    {questions.length} soalan telah disediakan dan sedia untuk peperiksaan
                  </Typography>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button
                  size="lg"
                  className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700"
                  onClick={handleStartExam}
                  disabled={isGenerating || questions.length === 0}
                >
                  <Play className="w-5 h-5" />
                  Mula Peperiksaan
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="flex items-center gap-3"
                  onClick={handleGenerateQuestions}
                  disabled={isGenerating}
                >
                  <RefreshCw className="w-5 h-5" />
                  Jana Soalan Baru
                </Button>
              </div>

              {/* Instructions */}
              <Card className="p-6 bg-yellow-50 border border-yellow-200 text-left">
                <Typography variant="h6" className="text-yellow-800 mb-3">
                  📋 Arahan Peperiksaan:
                </Typography>
                <ul className="space-y-2 text-yellow-700">
                  <li>• Anda mempunyai 90 minit untuk menyelesaikan peperiksaan</li>
                  <li>• Peperiksaan akan tamat secara automatik apabila masa habis</li>
                  <li>• Gunakan mod skrin penuh untuk pengalaman yang lebih realistik</li>
                  <li>• Soalan campuran objektif (MCQ) dan subjektif</li>
                  <li>• Semua jawapan akan dinilai secara automatik</li>
                  <li>• Anda akan menerima analisis terperinci selepas peperiksaan</li>
                </ul>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}