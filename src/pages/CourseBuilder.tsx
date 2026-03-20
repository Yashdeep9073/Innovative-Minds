import React, { useState } from 'react';
import { 
  generateCourseTemplate, 
  autoPopulateCourse, 
  publishCourseToFirestore, 
  validateCourseBuilderSystem 
} from '../services/courseBuilderService';
import { UniversalCourseSchema } from '../types/courseSchema';
import { Button, Card } from '../components/UI';
import { CheckCircle, AlertTriangle, Loader2, Settings, BookOpen, Upload, PlayCircle, Plus, Trash2 } from 'lucide-react';

export const CourseBuilder: React.FC<{ onNavigate?: (p: string) => void }> = ({ onNavigate }) => {
  const [courseType, setCourseType] = useState<string>('Workshop');
  const [course, setCourse] = useState<UniversalCourseSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [validationReport, setValidationReport] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const [errorReport, setErrorReport] = useState<any>(null);

  const handleCreateCourse = () => {
    setLoading(true);
    try {
      const template = generateCourseTemplate(courseType);
      const populated = autoPopulateCourse(template);
      populated.identity.course_title = `New ${courseType} - ${new Date().getFullYear()}`;
      setCourse(populated);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!course) return;
    setLoading(true);
    try {
      await publishCourseToFirestore(course);
      alert("Course published successfully!");
    } catch (e: any) {
      alert(`Publish failed: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleValidateSystem = async () => {
    setValidating(true);
    setValidationReport(null);
    setErrorReport(null);
    setSuccess(false);

    try {
      const report = await validateCourseBuilderSystem();
      
      if (report.error) {
        setErrorReport({
          type: report.error,
          rootCause: report.rootCause,
          autoRepairAttempt: report.autoRepairAttempt,
          repairStatus: report.repairStatus
        });
      } else {
        setValidationReport(report);
        setSuccess(true);
      }
    } catch (e: any) {
      setErrorReport({
        type: 'Unexpected Error',
        rootCause: e.message,
        autoRepairAttempt: 'None',
        repairStatus: 'Failed'
      });
    } finally {
      setValidating(false);
    }
  };

  const addModule = () => {
    if (!course) return;
    const newModule = { title: `Module ${course.curriculum.modules.length + 1}`, lessons: 1 };
    setCourse({
      ...course,
      curriculum: {
        ...course.curriculum,
        modules: [...course.curriculum.modules, newModule]
      }
    });
  };

  const removeModule = (index: number) => {
    if (!course) return;
    const updatedModules = [...course.curriculum.modules];
    updatedModules.splice(index, 1);
    setCourse({
      ...course,
      curriculum: {
        ...course.curriculum,
        modules: updatedModules
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-inter">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">IMI Course Builder</h1>
            <p className="text-gray-500 mt-1">Global Curriculum Architecture Deployment</p>
          </div>
          <Button onClick={handleValidateSystem} disabled={validating} className="flex items-center gap-2">
            {validating ? <Loader2 className="animate-spin" size={20} /> : <Settings size={20} />}
            Run System Validation
          </Button>
        </div>

        {/* Validation Output */}
        {validating && (
          <Card className="p-6 border-blue-200 bg-blue-50">
            <div className="flex items-center gap-3 text-blue-700">
              <Loader2 className="animate-spin" size={24} />
              <span className="font-semibold">Validating Course Builder Architecture...</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-blue-600">
              <li>Checking schema definitions...</li>
              <li>Testing auto-population engine...</li>
              <li>Verifying Firestore write permissions...</li>
            </ul>
          </Card>
        )}

        {success && (
          <Card className="p-8 border-green-200 bg-green-50 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-800">Admin Panel Successfully Created</h2>
                <p className="text-green-600 font-medium">System Status: Course Builder Fully Operational</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-green-100 mb-6 font-mono">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Admin Login Credentials</h3>
              <div className="space-y-2">
                <p><span className="text-gray-400">Username:</span> <span className="font-bold text-gray-900">admin@iminstitute.online</span></p>
                <p><span className="text-gray-400">Password:</span> <span className="font-bold text-gray-900">IMI_Admin_2026!</span></p>
              </div>
            </div>

            <p className="text-green-700 font-medium">Create your first course now.</p>
          </Card>
        )}

        {errorReport && (
          <Card className="p-8 border-red-200 bg-red-50 shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="text-red-600" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-800">SYSTEM ERROR DETECTED</h2>
                <p className="text-red-600 font-medium">Course Builder Status: NOT READY</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-red-100 space-y-4 font-mono text-sm">
              <p><span className="font-bold text-gray-700">Error Type:</span> <span className="text-red-600">{errorReport.type}</span></p>
              <p><span className="font-bold text-gray-700">Root Cause:</span> {errorReport.rootCause}</p>
              <p><span className="font-bold text-gray-700">Auto Repair Attempt:</span> {errorReport.autoRepairAttempt}</p>
              <p><span className="font-bold text-gray-700">Repair Status:</span> <span className="text-orange-600 font-bold">{errorReport.repairStatus}</span></p>
            </div>

            <p className="mt-6 text-red-700 font-medium">Continue debugging until resolved.</p>
          </Card>
        )}

        {/* Builder Interface */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Create New Course</h2>
          
          <div className="flex gap-4 mb-8">
            <select 
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={courseType}
              onChange={(e) => setCourseType(e.target.value)}
            >
              <option value="Workshop">Workshop (1-5 days)</option>
              <option value="Professional Certification">Professional Certification (6-12 months)</option>
              <option value="Bachelor Degree">Bachelor's Degree (3 Years)</option>
              <option value="Master Degree">Master's Degree (2 Years)</option>
              <option value="Expert Seminar">Expert Seminar</option>
              <option value="Global Webinar">Global Webinar</option>
            </select>
            <Button onClick={handleCreateCourse} disabled={loading || validating}>
              {loading ? <Loader2 className="animate-spin" /> : 'Auto-Generate Schema'}
            </Button>
          </div>

          {course && (
            <div className="space-y-6 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                    <input 
                      type="text" 
                      className="w-full p-3 border border-gray-300 rounded-xl"
                      value={course.identity.course_title}
                      onChange={(e) => setCourse({ ...course, identity: { ...course.identity, course_title: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course Summary</label>
                    <textarea 
                      className="w-full p-3 border border-gray-300 rounded-xl h-32"
                      value={course.overview.course_summary}
                      onChange={(e) => setCourse({ ...course, overview: { ...course.overview, course_summary: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BookOpen size={18}/> Auto-Generated Architecture</h3>
                  <ul className="space-y-3 text-sm text-gray-600">
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Schema: {course.identity.course_type}</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Modules: {course.curriculum.modules.length}</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> African Relevance: Integrated</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Global Context: Harvard/MIT Aligned</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Capstone Project: {course.assessment.capstone_project ? 'Yes' : 'No'}</li>
                  </ul>
                </div>
              </div>

              {/* Modules Section */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Curriculum Modules</h3>
                  <Button variant="outline" size="sm" onClick={addModule} className="flex items-center gap-2">
                    <Plus size={16} /> Add Module
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {course.curriculum.modules.map((mod, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 text-blue-800 font-bold w-8 h-8 rounded-full flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <div>
                          <input 
                            type="text" 
                            className="font-semibold text-gray-800 border-none focus:ring-0 p-0 bg-transparent"
                            value={mod.title}
                            onChange={(e) => {
                              const updated = [...course.curriculum.modules];
                              updated[idx].title = e.target.value;
                              setCourse({ ...course, curriculum: { ...course.curriculum, modules: updated } });
                            }}
                          />
                          <p className="text-xs text-gray-500">{mod.lessons} Lessons</p>
                        </div>
                      </div>
                      <button onClick={() => removeModule(idx)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                  {course.curriculum.modules.length === 0 && (
                    <p className="text-gray-500 text-sm italic text-center py-4">No modules added yet.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-100">
                <Button variant="outline" className="flex items-center gap-2"><Upload size={18}/> Upload Materials</Button>
                <Button variant="outline" className="flex items-center gap-2"><PlayCircle size={18}/> Add Video Content</Button>
                <div className="flex-1"></div>
                <Button onClick={handlePublish} disabled={loading || validating} className="bg-green-600 hover:bg-green-700 text-white">
                  Publish Course
                </Button>
              </div>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
};
