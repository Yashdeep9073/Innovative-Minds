
import React, { useState } from 'react';
import { QuizQuestion, TopicQuiz } from '../types';
import { Button, Card } from './UI';
import { CheckCircle, XCircle, HelpCircle, AlertTriangle } from 'lucide-react';

interface QuizViewProps {
  quiz: TopicQuiz;
  title: string;
  onComplete: (score: number, passed: boolean) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ quiz, title, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = quiz.questions[currentIndex];

  const handleNext = () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    setShowExplanation(false);
    setSelectedOption(null);

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = (finalAnswers: number[]) => {
    let correctCount = 0;
    finalAnswers.forEach((ans, idx) => {
      if (ans === quiz.questions[idx].correctAnswer) correctCount++;
    });

    const score = (correctCount / quiz.questions.length) * 100;
    const passed = score >= quiz.pass_mark;
    
    // UI state will be handled by parent usually, but we keep local state for feedback
    onComplete(score, passed);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="font-bold text-xl text-gray-800">{title}</h3>
        <span className="text-sm text-gray-500">Question {currentIndex + 1} of {quiz.questions.length}</span>
      </div>

      <div className="mb-2 w-full bg-gray-200 h-2 rounded-full">
        <div 
            className="bg-[#D62828] h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
        ></div>
      </div>

      <Card className="p-6 mb-6">
        <h4 className="text-lg font-medium mb-6">{currentQuestion.question}</h4>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !showExplanation && setSelectedOption(idx)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedOption === idx 
                  ? 'border-[#D62828] bg-red-50 text-[#D62828] font-medium' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              disabled={showExplanation}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${selectedOption === idx ? 'border-[#D62828] text-[#D62828]' : 'border-gray-400 text-gray-500'}`}>
                    {String.fromCharCode(65 + idx)}
                </div>
                {option}
              </div>
            </button>
          ))}
        </div>

        {showExplanation && (
             <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-in fade-in">
                 <p className="font-bold text-blue-800 text-sm mb-1 flex items-center gap-2">
                    <HelpCircle size={16}/> Explanation
                 </p>
                 <p className="text-sm text-blue-700">{currentQuestion.explanation}</p>
             </div>
        )}
      </Card>

      <div className="flex justify-between items-center">
        {!showExplanation ? (
             <button 
                onClick={() => setShowExplanation(true)} 
                className="text-gray-500 text-sm hover:text-[#D62828] underline"
             >
                Show Hint
             </button>
        ) : (
            <div className="text-sm text-gray-500 italic">Hint: {currentQuestion.hint}</div>
        )}

        <Button onClick={handleNext} disabled={selectedOption === null}>
            {currentIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};
