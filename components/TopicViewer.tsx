
import React, { useState, useEffect } from 'react';
import { TopicModule, Section } from '../types';
import { QuizView } from './QuizView';
import { Button, Card } from './UI';
import { PlayCircle, CheckCircle, FileText, ChevronRight, Lock, AlertTriangle } from 'lucide-react';

interface TopicViewerProps {
  topic: TopicModule;
  onTopicComplete: () => void;
  // New props for state management
  progressData?: { section1Score: number; section2Score: number; section3Score: number; completed: boolean };
  onSectionComplete: (sectionKey: 'section1Score' | 'section2Score' | 'section3Score', score: number) => void;
}

export const TopicViewer: React.FC<TopicViewerProps> = ({ 
  topic, 
  onTopicComplete, 
  progressData = { section1Score: 0, section2Score: 0, section3Score: 0, completed: false },
  onSectionComplete
}) => {
  const [activeTab, setActiveTab] = useState<'intro' | 'sec1' | 'sec2' | 'sec3' | 'revision'>('intro');

  // Check locks
  const sec1Unlocked = true; // Intro always unlocks sec1
  const sec2Unlocked = progressData.section1Score >= 75;
  const sec3Unlocked = progressData.section2Score >= 75;
  const revisionUnlocked = progressData.section3Score >= 75;

  // Auto-advance logic could go here, but manual navigation is safer for UX
  
  if (!topic) return <div className="p-8">Loading topic data...</div>;

  const SectionView = ({ section, id }: { section: Section | undefined, id: 'sec1' | 'sec2' | 'sec3' }) => {
     const [showQuiz, setShowQuiz] = useState(false);
     const scoreKey = id === 'sec1' ? 'section1Score' : id === 'sec2' ? 'section2Score' : 'section3Score';
     const currentScore = progressData[scoreKey];
     const passed = currentScore >= 75;

     if (!section || !section.video) {
        return (
            <div className="p-8 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
                <AlertTriangle />
                <div>
                    <h3 className="font-bold">Content Unavailable</h3>
                    <p className="text-sm">This section data is missing or incomplete.</p>
                </div>
            </div>
        );
     }

     if (showQuiz) {
         return (
             <QuizView 
                quiz={section.quiz} 
                title={`${section.video.title} - Assessment`} 
                onComplete={(score, isPass) => {
                    // Update parent with score
                    onSectionComplete(scoreKey, score);
                    
                    if(score >= 75) {
                        alert(`Passed with ${score.toFixed(1)}%! Advancing...`);
                        setShowQuiz(false);
                        // Auto-move to next tab? Maybe let user choose.
                    } else {
                        alert(`Score: ${score.toFixed(1)}%. Pass mark is 75%. You must retake the quiz.`);
                        setShowQuiz(false); 
                    }
                }} 
             />
         );
     }

     return (
         <div className="space-y-6 animate-in fade-in">
             <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative">
                 <iframe 
                    src={section.video.url} 
                    className="w-full h-full" 
                    title={section.video.title}
                    allowFullScreen
                    frameBorder="0"
                 />
             </div>
             
             <div className="flex justify-between items-start">
                 <div>
                     <h3 className="text-2xl font-bold text-gray-900">{section.video.title}</h3>
                     <p className="text-sm text-gray-500">Duration: {section.video.duration} • Source: {section.video.source_credit}</p>
                 </div>
                 <div className="text-right">
                    {passed ? (
                        <div className="flex items-center gap-2 text-green-600 font-bold">
                            <CheckCircle /> Passed ({Math.round(currentScore)}%)
                        </div>
                    ) : (
                        <Button onClick={() => setShowQuiz(true)}>
                            {currentScore > 0 ? `Retake Quiz (Best: ${Math.round(currentScore)}%)` : 'Take Section Quiz'}
                        </Button>
                    )}
                 </div>
             </div>

             <Card className="p-6 bg-gray-50 border-gray-200">
                 <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><FileText size={18}/> Key Points</h4>
                 <ul className="space-y-2">
                     {section.key_points && section.key_points.map((kp, i) => (
                         <li key={i} className="flex gap-3 text-sm text-gray-700">
                             <div className="min-w-[20px] text-[#D62828] font-bold">{i + 1}.</div>
                             {kp}
                         </li>
                     ))}
                 </ul>
             </Card>
         </div>
     );
  };

  return (
    <div className="flex flex-col h-full">
        {/* Navigation Tabs */}
        <div className="flex border-b overflow-x-auto">
            <button 
                onClick={() => setActiveTab('intro')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'intro' ? 'border-b-2 border-[#D62828] text-[#D62828]' : 'text-gray-500 hover:text-gray-700'}`}
            >
                Introduction
            </button>
            <button 
                onClick={() => setActiveTab('sec1')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'sec1' ? 'border-b-2 border-[#D62828] text-[#D62828]' : 'text-gray-500'}`}
            >
                {progressData.section1Score >= 75 ? <CheckCircle size={14} className="text-green-500"/> : <PlayCircle size={14}/>} Section 1
            </button>
            <button 
                onClick={() => sec2Unlocked && setActiveTab('sec2')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'sec2' ? 'border-b-2 border-[#D62828] text-[#D62828]' : sec2Unlocked ? 'text-gray-500' : 'text-gray-300 cursor-not-allowed'}`}
                disabled={!sec2Unlocked}
            >
                 {progressData.section2Score >= 75 ? <CheckCircle size={14} className="text-green-500"/> : !sec2Unlocked ? <Lock size={14}/> : <PlayCircle size={14}/>} Section 2
            </button>
            <button 
                onClick={() => sec3Unlocked && setActiveTab('sec3')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'sec3' ? 'border-b-2 border-[#D62828] text-[#D62828]' : sec3Unlocked ? 'text-gray-500' : 'text-gray-300 cursor-not-allowed'}`}
                disabled={!sec3Unlocked}
            >
                 {progressData.section3Score >= 75 ? <CheckCircle size={14} className="text-green-500"/> : !sec3Unlocked ? <Lock size={14}/> : <PlayCircle size={14}/>} Section 3
            </button>
             <button 
                onClick={() => revisionUnlocked && setActiveTab('revision')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${activeTab === 'revision' ? 'border-b-2 border-[#D62828] text-[#D62828]' : revisionUnlocked ? 'text-gray-500' : 'text-gray-300 cursor-not-allowed'}`}
                disabled={!revisionUnlocked}
            >
                 {progressData.completed && activeTab === 'revision' ? <CheckCircle size={14} className="text-green-500"/> : <FileText size={14}/>} Review
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'intro' && (
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">{topic.title}</h2>
                    <div className="prose prose-lg text-gray-700 whitespace-pre-line">
                        {topic.introductory_notes}
                    </div>
                    <div className="mt-8">
                        <Button onClick={() => setActiveTab('sec1')}>Start Section 1</Button>
                    </div>
                </div>
            )}

            {activeTab === 'sec1' && <SectionView section={topic.section_1} id="sec1" />}
            {activeTab === 'sec2' && <SectionView section={topic.section_2} id="sec2" />}
            {activeTab === 'sec3' && <SectionView section={topic.section_3} id="sec3" />}

            {activeTab === 'revision' && (
                 <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">Topic Revision</h2>
                    <div className="prose prose-lg text-gray-700 whitespace-pre-line bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                        {topic.revision_notes}
                    </div>
                    <div className="mt-8 text-center">
                        <Button size="lg" onClick={onTopicComplete} className="w-full md:w-auto">
                            {progressData.completed ? "Topic Completed" : "Mark as Complete & Continue"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};
