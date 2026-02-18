
import React, { useState } from 'react';
import { 
  Workshop, TopicModule, Section, QuizQuestion, WorkshopStructure, Instructor,
  CourseType, CourseCategory, CourseLevel, CourseStatus
} from '../types';
import { Button, Input, Card, FileUpload, Modal } from '../components/UI';
import { RichTextEditor } from '../components/RichTextEditor';
import { db, serverTimestamp, doc, setDoc, populateCourseContent, verifyCourseIntegrity, publishCourse, getWorkshopById, auth, collection, addDoc } from '../services/firebase';
import { generateFullCourseContent } from '../services/geminiService';
import { 
  Save, Layout, BookOpen, FileText, Video, Plus, Trash2, 
  CheckCircle, ChevronDown, ChevronRight, HelpCircle, Eye, Sparkles, AlertTriangle, Zap
} from 'lucide-react';

// --- STRICT ENUM CONSTANTS ---
const COURSE_TYPES: CourseType[] = ['Workshop', 'Seminar', 'Webinar', 'Certificate', 'Degree', 'Masters'];
const CATEGORIES: CourseCategory[] = ['Technology', 'Business', 'Agriculture', 'Health', 'Education', 'Innovation', 'Cybersecurity', 'Data Science', 'Engineering', 'Social Sciences'];
const LEVELS: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Mixed'];
const STATUSES: CourseStatus[] = ['draft', 'pending_review', 'published', 'archived'];

// --- INITIAL STATE FACTORIES ---

const createEmptySection = (): Section => ({
  video: { title: '', url: '', duration: '', source_credit: 'IMI', provider: 'youtube' },
  key_points: [],
  quiz: { pass_mark: 75, questions: [] }
});

const createEmptyTopic = (index: number): TopicModule => ({
  id: `topic_${Date.now()}_${index}`,
  title: `New Topic ${index + 1}`,
  introductory_notes: '',
  section_1: createEmptySection(),
  section_2: createEmptySection(),
  section_3: createEmptySection(),
  revision_notes: '',
  // Backend compliance
  type: 'mandatory',
  order: index + 1,
  cycles: { cycle_1: {completed:false}, cycle_2: {completed:false}, cycle_3: {completed:false} },
  content_ready: false
});

const initialWorkshop: Workshop = {
  id: '', 
  workshop_id: '',
  course_id: '',
  title: '',
  slug: '',
  description: '',
  category: 'Technology', // Default from Enum
  course_type: 'Workshop', // Default from Enum
  level: 'Beginner', // Default from Enum
  image_url: '',
  status: 'draft', // Default strict
  visible: false, // Default hidden
  content_ready: false,
  price: 0,
  durationMinutes: 120,
  search_tags: [],
  date_created: new Date().toISOString(),
  marketing_cta: '',
  instructor: { name: '', bio: '', image_url: '' },
  
  // New Mandatory Backend Fields
  pricing: {
    application_fee: 350,
    workshop_fee: 2790,
    examination_fee: 275,
    scholarship_percentage: 100,
    payment_options: ["pay_now", "pay_later", "partial", "pay_own_amount"]
  },
  certification: {
    attendance_certificate: true,
    exam_required: true,
    certificate_cost: 0,
    type: "attendance + exam",
    issued: true
  },
  progression_rules: {
    mandatory_topics: 5,
    elective_topics: 0,
    pass_mark_percentage: 75,
    cycle_repetitions_required: 1
  },
  ai_features: {
    personalized_learning: true,
    auto_content_population: true,
    performance_analysis: true
  },
  visibility: {
    landing_page: false,
    catalogue: false,
    search_results: false,
    student_dashboard: false
  },
  topics_required: {
    mandatory: 5,
    electives: 0
  },

  workshop_structure: {
    orientation: { 
      welcome_message: '', 
      how_it_works: 'Complete all topics and assessments to earn your certificate.', 
      learning_outcomes: [] 
    },
    key_benefits: [], // Additive
    certificate_advantages: [], // Additive
    next_recommendations: [], // Additive
    topics: [],
    final_exam: { question_count: 20, pass_mark: 75, max_attempts: 3, questions: [] },
    certificate_data: { enabled: true, generation_trigger: 'final_exam_pass', verification_id: '', qr_code: '', delivery: ['email', 'download'] }
  }
};

export const CourseBuilder: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'metadata' | 'curriculum' | 'settings' | 'preview'>('metadata');
  const [workshop, setWorkshop] = useState<Workshop>(initialWorkshop);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  
  // Quiz Modal State
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuizLocation, setCurrentQuizLocation] = useState<{topicIndex: number, sectionKey: 'section_1' | 'section_2' | 'section_3'} | null>(null);

  // --- HELPERS ---

  const updateField = (field: keyof Workshop, value: any) => {
    setWorkshop(prev => ({ ...prev, [field]: value }));
  };

  const updateStructure = (field: keyof WorkshopStructure, value: any) => {
    setWorkshop(prev => ({
      ...prev,
      workshop_structure: { ...prev.workshop_structure!, [field]: value }
    }));
  };

  const handleTopicAdd = () => {
    const newTopic = createEmptyTopic(workshop.workshop_structure!.topics.length);
    updateStructure('topics', [...workshop.workshop_structure!.topics, newTopic]);
    setExpandedTopics(prev => new Set(prev).add(newTopic.id));
  };

  const updateTopic = (index: number, field: keyof TopicModule, value: any) => {
    const newTopics = [...workshop.workshop_structure!.topics];
    newTopics[index] = { ...newTopics[index], [field]: value };
    updateStructure('topics', newTopics);
  };

  const updateSection = (topicIndex: number, sectionKey: 'section_1' | 'section_2' | 'section_3', field: keyof Section, value: any) => {
    const newTopics = [...workshop.workshop_structure!.topics];
    const section = newTopics[topicIndex][sectionKey];
    newTopics[topicIndex][sectionKey] = { ...section, [field]: value };
    updateStructure('topics', newTopics);
  };

  const handleSave = async (targetStatus: CourseStatus) => {
    if (!workshop.title) return alert("Title is required");
    
    // Auto-save logic
    setSaving(true);
    try {
      const id = workshop.id || `ws_${Date.now()}`;
      const finalSlug = workshop.slug || workshop.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const now = new Date().toISOString();
      
      const payload: Workshop = {
        ...workshop,
        id,
        workshop_id: id,
        course_id: id,
        slug: finalSlug,
        status: targetStatus,
        visible: targetStatus === 'published',
        date_created: workshop.date_created || serverTimestamp(),
        created_at: workshop.date_created || serverTimestamp(),
        updated_at: serverTimestamp(),
        created_by: auth.currentUser?.uid || 'admin'
      };

      await setDoc(doc(db, 'workshops', id), payload);
      
      // Update local state with string timestamp to prevent circular ref errors
      setWorkshop({
          ...payload,
          date_created: workshop.date_created || now,
          updated_at: now
      } as Workshop);
      
      if (targetStatus === 'published') {
         // Run strict verification first
         const passed = await publishCourse(id);
         if (passed) {
            alert("Course Verified & Published Successfully!");
            onNavigate('admin');
         }
      } else {
         alert("Draft Saved.");
      }
    } catch (e) {
      console.error(e);
      alert("Save failed. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const handleAiPopulate = async () => {
     if (!workshop.id) {
        alert("Please save as Draft first.");
        return;
     }
     if (!confirm("This will use AI to fill in MISSING content. Existing content will be preserved. Continue?")) return;
     
     setAiLoading(true);
     try {
        await populateCourseContent(workshop.id);
        // Refresh local data
        const fresh = await getWorkshopById(workshop.id);
        if (fresh) setWorkshop(fresh);
        alert("AI Population Complete! Check the Curriculum tab.");
     } catch (e) {
        alert("AI Population failed. Check console.");
     } finally {
        setAiLoading(false);
     }
  };

  // --- AUTO-POPULATE & PUBLISH (THE NUCLEAR OPTION) ---
  const handleAutoPopulateAndPublish = async () => {
    if (!workshop.title) {
        alert("Please enter a Course Title first.");
        return;
    }

    if (!confirm(`Are you sure you want to completely AUTO-GENERATE and PUBLISH "${workshop.title}"? \n\nThis will overwrite any existing content and make the course live immediately.`)) {
        return;
    }

    setAiLoading(true);
    try {
        // 1. Generate full content via Gemini
        const generatedData = await generateFullCourseContent(workshop.title, workshop.category, workshop.level);
        
        if (!generatedData) throw new Error("AI generation failed to return data.");

        // 2. Prepare Payload
        const id = workshop.id || `ws_${Date.now()}`;
        const finalSlug = workshop.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const now = new Date().toISOString();
        
        // Map generated topics to ensure IDs
        const mappedTopics = generatedData.workshop_structure.topics.map((t: any, i: number) => ({
            ...t,
            id: `${id}_t${i+1}`,
            type: 'mandatory',
            order: i+1,
            cycles: { cycle_1: {completed:false}, cycle_2: {completed:false}, cycle_3: {completed:false} },
            content_ready: true
        }));

        const finalPayload: Workshop = {
            ...workshop,
            ...generatedData,
            id,
            workshop_id: id,
            course_id: id,
            slug: finalSlug,
            status: 'published', // Force Publish
            visible: true,
            content_ready: true,
            image_url: workshop.image_url || `https://source.unsplash.com/800x600/?${workshop.category.toLowerCase()},${workshop.title.split(' ')[0].toLowerCase()}`,
            date_created: serverTimestamp(),
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            workshop_structure: {
                ...generatedData.workshop_structure,
                topics: mappedTopics
            }
        };

        // 3. Write to Firestore
        await setDoc(doc(db, 'workshops', id), finalPayload);

        // 4. Audit Log
        await addDoc(collection(db, 'admin_actions'), {
            action: 'auto_populate_publish',
            courseId: id,
            courseTitle: workshop.title,
            adminId: auth.currentUser?.uid || 'unknown',
            timestamp: serverTimestamp()
        });

        // 5. Update State & Notify
        setWorkshop({
            ...finalPayload,
            date_created: now,
            updated_at: now
        } as Workshop); // Local update
        
        alert(`SUCCESS! "${workshop.title}" is now LIVE with full AI-generated content.`);
        onNavigate('admin');

    } catch (e) {
        console.error("Auto-Populate Error", e);
        alert("Auto-population failed. Please check your API limits or try again.");
    } finally {
        setAiLoading(false);
    }
  };

  // --- SUB-COMPONENTS ---

  const QuizEditor = () => {
    if (!currentQuizLocation) return null;
    const { topicIndex, sectionKey } = currentQuizLocation;
    const currentQuestions = workshop.workshop_structure!.topics[topicIndex][sectionKey].quiz.questions;

    const addQuestion = () => {
      const newQ: QuizQuestion = {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        hint: '',
        explanation: ''
      };
      updateSection(topicIndex, sectionKey, 'quiz', {
        ...workshop.workshop_structure!.topics[topicIndex][sectionKey].quiz,
        questions: [...currentQuestions, newQ]
      });
    };

    const updateQuestion = (qIndex: number, field: keyof QuizQuestion, val: any) => {
      const newQs = [...currentQuestions];
      newQs[qIndex] = { ...newQs[qIndex], [field]: val };
      updateSection(topicIndex, sectionKey, 'quiz', {
        ...workshop.workshop_structure!.topics[topicIndex][sectionKey].quiz,
        questions: newQs
      });
    };

    const updateOption = (qIndex: number, optIndex: number, val: string) => {
      const newQs = [...currentQuestions];
      newQs[qIndex].options[optIndex] = val;
      updateSection(topicIndex, sectionKey, 'quiz', {
        ...workshop.workshop_structure!.topics[topicIndex][sectionKey].quiz,
        questions: newQs
      });
    };

    return (
      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {currentQuestions.map((q, idx) => (
          <div key={idx} className="p-4 border rounded-xl bg-gray-50 relative">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-sm">Question {idx + 1}</span>
              <button 
                onClick={() => {
                  const newQs = currentQuestions.filter((_, i) => i !== idx);
                  updateSection(topicIndex, sectionKey, 'quiz', {
                    ...workshop.workshop_structure!.topics[topicIndex][sectionKey].quiz,
                    questions: newQs
                  });
                }}
                className="text-red-500 hover:bg-red-50 p-1 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <Input 
              placeholder="Enter question text..." 
              value={q.question} 
              onChange={e => updateQuestion(idx, 'question', e.target.value)} 
              className="mb-3"
            />
            <div className="space-y-2 mb-3">
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="flex gap-2 items-center">
                  <input 
                    type="radio" 
                    name={`correct_${idx}`} 
                    checked={q.correctAnswer === oIdx} 
                    onChange={() => updateQuestion(idx, 'correctAnswer', oIdx)}
                  />
                  <Input 
                    placeholder={`Option ${String.fromCharCode(65 + oIdx)}`} 
                    value={opt} 
                    onChange={e => updateOption(idx, oIdx, e.target.value)} 
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
            <Input 
              placeholder="Explanation (Optional)" 
              value={q.explanation} 
              onChange={e => updateQuestion(idx, 'explanation', e.target.value)} 
            />
          </div>
        ))}
        <Button variant="outline" onClick={addQuestion} icon={Plus} className="w-full">Add Question</Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">Course Builder</h1>
          <div className="h-6 w-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">{workshop.title || 'Untitled Course'}</span>
          <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${workshop.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
             {workshop.status}
          </span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => onNavigate('admin')}>Cancel</Button>
          <Button variant="outline" onClick={() => handleSave('draft')} isLoading={saving}>Save Draft</Button>
          
          {/* THE NUCLEAR BUTTON */}
          <Button 
             variant="primary" 
             onClick={handleAutoPopulateAndPublish} 
             isLoading={aiLoading} 
             icon={Zap} 
             className="bg-purple-600 hover:bg-purple-700 border-none text-white shadow-md"
          >
             {aiLoading ? 'Generating Full Course...' : 'Auto-Populate & Publish'}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR TABS */}
        <nav className="w-64 bg-white border-r flex flex-col pt-6">
          {[
            { id: 'metadata', label: 'Metadata', icon: Layout },
            { id: 'curriculum', label: 'Curriculum', icon: BookOpen },
            { id: 'settings', label: 'Settings', icon: HelpCircle },
            { id: 'preview', label: 'Preview', icon: Eye },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id ? 'bg-red-50 text-[#D62828] border-r-4 border-[#D62828]' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </nav>

        {/* MAIN CANVAS */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* METADATA TAB */}
            {activeTab === 'metadata' && (
              <div className="space-y-6 animate-in fade-in">
                <Card className="p-6">
                  <h2 className="text-lg font-bold mb-4">Course Basics</h2>
                  <div className="space-y-4">
                    <Input label="Course Title" value={workshop.title} onChange={e => updateField('title', e.target.value)} required />
                    
                    <div className="grid grid-cols-2 gap-4">
                      {/* STRICT ENUM DROPDOWN: Course Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course Type</label>
                        <select 
                          className="w-full border rounded p-2"
                          value={workshop.course_type}
                          onChange={e => updateField('course_type', e.target.value)}
                        >
                          {COURSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      {/* STRICT ENUM DROPDOWN: Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select 
                          className="w-full border rounded p-2"
                          value={workshop.category}
                          onChange={e => updateField('category', e.target.value)}
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       {/* STRICT ENUM DROPDOWN: Level */}
                       <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                        <select 
                          className="w-full border rounded p-2"
                          value={workshop.level}
                          onChange={e => updateField('level', e.target.value)}
                        >
                          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      
                      <Input label="Marketing CTA" placeholder="e.g. Join the Revolution" value={workshop.marketing_cta || ''} onChange={e => updateField('marketing_cta', e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea 
                        className="w-full border rounded p-2 h-32"
                        value={workshop.description}
                        onChange={e => updateField('description', e.target.value)}
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-lg font-bold mb-4">Media & Pricing</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
                      <FileUpload 
                        onFileSelect={() => {}} // Placeholder logic handled by wrapper in prod
                        uploading={false}
                        label={workshop.image_url ? "Change Thumbnail" : "Upload Thumbnail"}
                      />
                      {workshop.image_url && <img src={workshop.image_url} className="mt-2 h-32 rounded object-cover" alt="Thumb"/>}
                      <Input 
                        placeholder="Or paste image URL..." 
                        value={workshop.image_url} 
                        onChange={e => updateField('image_url', e.target.value)} 
                        className="mt-2"
                      />
                    </div>
                    <div className="space-y-4">
                      <Input label="Workshop Fee (ZMW)" type="number" value={workshop.pricing.workshop_fee} onChange={e => setWorkshop({...workshop, pricing: {...workshop.pricing, workshop_fee: Number(e.target.value)}})} />
                      <Input label="Exam Fee (ZMW)" type="number" value={workshop.pricing.examination_fee} onChange={e => setWorkshop({...workshop, pricing: {...workshop.pricing, examination_fee: Number(e.target.value)}})} />
                      <Input 
                        label="Instructor Name" 
                        value={workshop.instructor?.name || ''} 
                        onChange={e => updateField('instructor', { ...workshop.instructor, name: e.target.value })} 
                      />
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* CURRICULUM TAB */}
            {activeTab === 'curriculum' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Curriculum Structure</h2>
                  <Button onClick={handleTopicAdd} icon={Plus}>Add Topic Module</Button>
                </div>

                {workshop.workshop_structure!.topics.map((topic, tIdx) => {
                  const isExpanded = expandedTopics.has(topic.id);
                  return (
                    <Card key={topic.id} className="overflow-hidden border border-gray-200">
                      <div 
                        className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => setExpandedTopics(prev => {
                          const next = new Set(prev);
                          if (next.has(topic.id)) next.delete(topic.id); else next.add(topic.id);
                          return next;
                        })}
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                          <span className="font-bold text-gray-700">Module {tIdx + 1}:</span>
                          <input 
                            value={topic.title} 
                            onClick={e => e.stopPropagation()}
                            onChange={e => updateTopic(tIdx, 'title', e.target.value)}
                            className="bg-transparent border-b border-transparent hover:border-gray-400 focus:border-[#D62828] outline-none font-medium px-1"
                          />
                        </div>
                        <span className="text-xs text-gray-400">3 Sections</span>
                      </div>

                      {isExpanded && (
                        <div className="p-6 space-y-8 bg-white">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Introductory Notes</label>
                            <RichTextEditor 
                              value={topic.introductory_notes} 
                              onChange={val => updateTopic(tIdx, 'introductory_notes', val)} 
                              className="h-48 mb-12"
                            />
                          </div>

                          <div className="space-y-4">
                            {['section_1', 'section_2', 'section_3'].map((secKey, sIdx) => {
                              const section = topic[secKey as keyof TopicModule] as Section;
                              return (
                                <div key={secKey} className="border rounded-xl p-4 bg-gray-50/50">
                                  <div className="flex items-center gap-2 mb-4 text-[#D62828] font-bold text-sm">
                                    <Video size={16} /> Section {sIdx + 1}
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <Input 
                                      label="Video Title" 
                                      value={section.video.title} 
                                      onChange={e => updateSection(tIdx, secKey as any, 'video', { ...section.video, title: e.target.value })} 
                                    />
                                    <Input 
                                      label="Video URL (YouTube/Vimeo)" 
                                      value={section.video.url} 
                                      onChange={e => updateSection(tIdx, secKey as any, 'video', { ...section.video, url: e.target.value })} 
                                    />
                                  </div>
                                  <div className="flex gap-4">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="flex-1"
                                      onClick={() => {
                                        setCurrentQuizLocation({ topicIndex: tIdx, sectionKey: secKey as any });
                                        setShowQuizModal(true);
                                      }}
                                    >
                                      Edit Quiz ({section.quiz.questions.length} Qs)
                                    </Button>
                                    <Button size="sm" variant="outline" className="flex-1">Edit Key Points</Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}

            {/* PREVIEW TAB */}
            {activeTab === 'preview' && (
              <div className="animate-in fade-in space-y-8 text-center">
                <div className="inline-block p-4 bg-yellow-50 rounded-lg text-yellow-800 mb-8 border border-yellow-200">
                  <Eye className="inline mr-2" />
                  Preview Mode shows how the course card will appear in the catalog.
                </div>
                <div className="max-w-sm mx-auto">
                  {/* Mock Preview Card using existing styles */}
                  <Card className="hover:shadow-xl transition-all duration-300 h-full flex flex-col group border border-gray-100 overflow-hidden text-left">
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      {workshop.image_url ? <img src={workshop.image_url} className="w-full h-full object-cover" alt="Preview"/> : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>}
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-bold text-[#D62828] uppercase shadow-sm">{workshop.category}</div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2">{workshop.title || "Course Title"}</h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{workshop.description || "Course description will appear here..."}</p>
                      <Button className="w-full">Enroll Now</Button>
                    </div>
                  </Card>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* QUIZ MODAL */}
      <Modal 
        isOpen={showQuizModal} 
        onClose={() => setShowQuizModal(false)} 
        title="Quiz Builder"
      >
        <QuizEditor />
      </Modal>
    </div>
  );
};
