import React, { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  doc, 
  updateDoc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../../services/firebase';
import { 
  AcademicProgram, 
  AcademicCourse, 
  AcademicLevel, 
  ProgramStatus 
} from '../../types';
import { 
  createProgram, 
  updateProgram, 
  publishProgram, 
  getAcademicLevels, 
  initializeAcademicLevels,
  getAllPrograms,
  createAcademicCourse,
  getCoursesByProgram,
  archiveAIContent,
  publishAllPrograms
} from '../../services/academicService';
import { enrichAcademicProgram } from '../../services/geminiService';
import { 
  BookOpen, 
  PlusCircle, 
  Edit, 
  CheckCircle, 
  AlertTriangle, 
  ArrowLeft, 
  Save, 
  Globe, 
  Lock, 
  Brain, 
  Layers, 
  FileText,
  Search,
  RefreshCw,
  Archive,
  Copy
} from 'lucide-react';
import { Button, Card, Input, Modal } from '../../components/UI';

export const ProgramManager: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'programs' | 'courses' | 'levels'>('programs');
  const [programs, setPrograms] = useState<AcademicProgram[]>([]);
  const [levels, setLevels] = useState<AcademicLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<AcademicProgram | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [enriching, setEnriching] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<AcademicProgram>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, l] = await Promise.all([getAllPrograms(), getAcademicLevels()]);
      setPrograms(p);
      setLevels(l);
      if (l.length === 0) {
        await initializeAcademicLevels();
        const newLevels = await getAcademicLevels();
        setLevels(newLevels);
      }
    } catch (e) {
      console.error("Error fetching data", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateProgram = () => {
    setFormData({
      status: 'draft',
      version: 1,
      delivery_mode: 'hybrid',
      duration_months: 12,
      credits: 120
    });
    setSelectedProgram(null);
    setIsEditing(true);
  };

  const handleEditProgram = (program: AcademicProgram) => {
    setFormData(program);
    setSelectedProgram(program);
    setIsEditing(true);
  };

  const handleSaveProgram = async () => {
    if (!formData.title || !formData.level_id) {
      alert("Title and Level are required");
      return;
    }

    setLoading(true);
    try {
      const userId = auth.currentUser?.uid || 'admin';
      
      if (selectedProgram) {
        await updateProgram(selectedProgram.id, formData, userId);
      } else {
        await createProgram(formData, userId);
      }
      
      await fetchData();
      setIsEditing(false);
      setSelectedProgram(null);
    } catch (e) {
      console.error("Error saving program", e);
      alert("Failed to save program");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (program: AcademicProgram) => {
    if (!window.confirm(`Are you sure you want to publish "${program.title}"? This will archive any AI drafts and create a new version.`)) return;
    
    setLoading(true);
    try {
      const userId = auth.currentUser?.uid || 'admin';
      
      // 1. Archive AI Content
      await archiveAIContent(program.id, userId);
      
      // 2. Publish
      await publishProgram(program.id, userId);
      
      await fetchData();
      alert("Program Published Successfully");
    } catch (e) {
      console.error("Error publishing", e);
      alert("Failed to publish");
    } finally {
      setLoading(false);
    }
  };

  const handleEnrichment = async () => {
    if (!formData.title || !formData.official_outline) {
      alert("Title and Official Outline are required for AI enrichment");
      return;
    }

    setEnriching(true);
    try {
      const enrichment = await enrichAcademicProgram(
        formData.title,
        formData.level_id || 'degree',
        formData.official_outline
      );

      if (enrichment) {
        setFormData(prev => ({
          ...prev,
          ai_suggested_description: enrichment.ai_suggested_description,
          ai_suggested_keywords: enrichment.ai_suggested_keywords,
          ai_suggested_career_paths: enrichment.ai_suggested_career_paths
        }));
      } else {
        alert("AI Enrichment failed to generate content.");
      }
    } catch (e) {
      console.error("Enrichment error", e);
      alert("Enrichment failed");
    } finally {
      setEnriching(false);
    }
  };

  const approveAIContent = () => {
    if (!window.confirm("Overwrite official fields with AI suggestions?")) return;
    setFormData(prev => ({
      ...prev,
      marketing_description: prev.ai_suggested_description || prev.marketing_description,
      keywords: prev.ai_suggested_keywords || prev.keywords,
      career_pathways: prev.ai_suggested_career_paths || prev.career_pathways
    }));
  };

  if (isEditing) {
    return (
      <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} /> Back to List
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedProgram ? 'Edit Program' : 'Create New Program'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FileText size={20} className="text-blue-600"/> Core Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program Title</label>
                  <Input 
                    value={formData.title || ''} 
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Bachelor of Science in Computer Science"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Level</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={formData.level_id || ''}
                      onChange={e => setFormData({...formData, level_id: e.target.value})}
                    >
                      <option value="">Select Level</option>
                      {levels.map(l => (
                        <option key={l.id} value={l.id}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Mode</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={formData.delivery_mode || 'hybrid'}
                      onChange={e => setFormData({...formData, delivery_mode: e.target.value as any})}
                    >
                      <option value="hybrid">Hybrid</option>
                      <option value="online">Online</option>
                      <option value="campus">Campus</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Months)</label>
                    <Input 
                      type="number"
                      value={formData.duration_months || 0} 
                      onChange={e => setFormData({...formData, duration_months: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Credits</label>
                    <Input 
                      type="number"
                      value={formData.credits || 0} 
                      onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Official Outline (Required for AI)</label>
                  <textarea 
                    className="w-full p-3 border rounded-md h-40 font-mono text-sm"
                    value={formData.official_outline || ''}
                    onChange={e => setFormData({...formData, official_outline: e.target.value})}
                    placeholder="Paste the official curriculum outline here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marketing Description (Public)</label>
                  <textarea 
                    className="w-full p-3 border rounded-md h-32"
                    value={formData.marketing_description || ''}
                    onChange={e => setFormData({...formData, marketing_description: e.target.value})}
                    placeholder="Official description for the website..."
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 border-l-4 border-purple-500">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Brain size={20} className="text-purple-600"/> Content Review (Internal)
                </h3>
                <div className="flex gap-2">
                   <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={approveAIContent} 
                    icon={Copy}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    Approve & Copy
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleEnrichment} 
                    isLoading={enriching}
                    icon={RefreshCw}
                  >
                    Generate Draft
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <label className="block text-xs font-bold text-purple-800 mb-1 uppercase">AI Suggested Description</label>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{formData.ai_suggested_description || 'No draft generated yet.'}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <label className="block text-xs font-bold text-purple-800 mb-1 uppercase">Suggested Keywords</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.ai_suggested_keywords?.map((k, i) => (
                      <span key={i} className="bg-white text-purple-800 px-2 py-1 rounded border border-purple-200 text-xs">{k}</span>
                    ))}
                    {!formData.ai_suggested_keywords?.length && <span className="text-sm text-gray-500">None</span>}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <Card className="p-6 sticky top-6">
              <h3 className="font-bold text-gray-900 mb-4">Publishing Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-center" onClick={handleSaveProgram} isLoading={loading} icon={Save}>
                  Save Draft
                </Button>
                {selectedProgram && (
                   <Button 
                     className="w-full justify-center bg-green-600 hover:bg-green-700 text-white" 
                     onClick={() => handlePublish(selectedProgram)} 
                     isLoading={loading}
                     icon={Globe}
                   >
                     Publish Version {selectedProgram.version + 1}
                   </Button>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Status: <span className="font-bold uppercase">{formData.status}</span></p>
                <p className="text-xs text-gray-500 mb-2">Version: <span className="font-bold">{formData.version}</span></p>
                <p className="text-xs text-gray-500">Last Updated: {new Date().toLocaleDateString()}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <button onClick={() => onNavigate('admin')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-2">
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Layers className="text-[#D62828]" /> Program Manager
          </h1>
          <p className="text-gray-500">Manage institutional academic programs, accreditation, and curriculum.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={async () => {
            if(window.confirm("Publish all draft programs? This will archive AI content and make them public.")) {
              setLoading(true);
              try {
                const count = await publishAllPrograms(auth.currentUser?.uid || 'admin');
                alert(`Successfully published ${count} programs.`);
                await fetchData();
              } catch(e) {
                alert("Bulk publish failed.");
              } finally {
                setLoading(false);
              }
            }
          }} variant="outline" icon={Globe} className="text-green-600 border-green-200 hover:bg-green-50">Publish All</Button>
          <Button onClick={handleCreateProgram} icon={PlusCircle}>Create New Program</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button 
          className={`pb-3 px-1 font-medium ${activeTab === 'programs' ? 'text-[#D62828] border-b-2 border-[#D62828]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('programs')}
        >
          Academic Programs
        </button>
        <button 
          className={`pb-3 px-1 font-medium ${activeTab === 'courses' ? 'text-[#D62828] border-b-2 border-[#D62828]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('courses')}
        >
          Course Modules
        </button>
        <button 
          className={`pb-3 px-1 font-medium ${activeTab === 'levels' ? 'text-[#D62828] border-b-2 border-[#D62828]' : 'text-gray-500'}`}
          onClick={() => setActiveTab('levels')}
        >
          Configuration
        </button>
      </div>

      {activeTab === 'programs' && (
        <Card className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="p-4">Program Title</th>
                <th className="p-4">Level</th>
                <th className="p-4">Status</th>
                <th className="p-4">Version</th>
                <th className="p-4">Governance</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {programs.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{p.title}</td>
                  <td className="p-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs uppercase font-bold">
                      {levels.find(l => l.id === p.level_id)?.name || p.level_id}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1 w-fit ${
                      p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {p.status === 'published' ? <Globe size={10}/> : <Lock size={10}/>} {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500">v{p.version}</td>
                  <td className="p-4">
                    {p.data_governance?.source_verified ? (
                      <span className="text-green-600 flex items-center gap-1 text-xs font-bold"><CheckCircle size={12}/> Verified</span>
                    ) : (
                      <span className="text-gray-400 flex items-center gap-1 text-xs"><AlertTriangle size={12}/> Pending</span>
                    )}
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditProgram(p)} icon={Edit}>Edit</Button>
                  </td>
                </tr>
              ))}
              {programs.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No programs found. Create one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}

      {activeTab === 'levels' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {levels.map(l => (
            <Card key={l.id} className="p-4 border-l-4 border-blue-500">
              <h3 className="font-bold text-lg">{l.name}</h3>
              <p className="text-xs text-gray-500 uppercase mt-1">Slug: {l.slug}</p>
              <p className="text-xs text-gray-500 mt-1">Schema: {l.schemaType}</p>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'courses' && (
        <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">Course Module Management</h3>
          <p className="max-w-md mx-auto mt-2">Manage individual academic courses linked to programs. Select a program to view its courses.</p>
        </div>
      )}
    </div>
  );
};
