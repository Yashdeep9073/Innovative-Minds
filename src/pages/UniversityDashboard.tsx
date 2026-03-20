import React, { useState, useEffect } from 'react';
import { User, Course } from '../types';
import { Card, Button, Input, Modal, FileUpload } from '../components/UI';
import { createCourse, createAssignment, uploadSecureFile, subscribeToCollection } from '../services/firebase';
import { where } from 'firebase/firestore';
import { BookOpen, Plus, FileText, Users, Clock } from 'lucide-react';

interface Props {
  user: User;
}

export const UniversityDashboard: React.FC<Props> = ({ user }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  
  // Form States
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');
  
  // Upload States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    // Real-time listener for courses owned by this university
    const unsubscribe = subscribeToCollection<Course>(
      'courses',
      [where('ownerId', '==', user.id)],
      (data) => setCourses(data)
    );
    return () => unsubscribe();
  }, [user.id]);

  const handleCreateCourse = async () => {
    if(!courseTitle) return;
    setIsUploading(true);
    
    try {
      let thumbnailUrl = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000'; // Default
      
      if (thumbnailFile) {
        const result = await uploadSecureFile(
          thumbnailFile, 
          'university_file', 
          { userId: user.id, role: user.role, formName: 'course_thumbnails' },
          setUploadProgress
        );
        thumbnailUrl = result.url;
      }

      await createCourse({
        title: courseTitle,
        description: courseDesc,
        ownerId: user.id,
        category: 'University',
        level: 'Degree',
        thumbnail: thumbnailUrl,
        modules: [],
        outcomes: []
      });

      setShowCourseModal(false);
      setCourseTitle('');
      setCourseDesc('');
      setThumbnailFile(null);
      setUploadProgress(0);
    } catch (e) {
      console.error("Course creation failed", e);
      alert("Failed to create course. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateAssignment = async () => {
    if(!selectedCourseId || !assignTitle) return;
    await createAssignment({
      courseId: selectedCourseId,
      title: assignTitle,
      description: 'Please upload your submission via the student portal.',
      dueDate: assignDueDate,
      ownerId: user.id
    });
    setShowAssignModal(false);
    setAssignTitle('');
    alert('Assignment Created & Broadcasted to Students!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="flex justify-between items-center bg-purple-900 text-white p-8 rounded-2xl shadow-lg">
        <div>
          <h1 className="text-3xl font-bold mb-2">University Portal</h1>
          <p className="text-purple-200">Manage your curriculum and students in real-time.</p>
        </div>
        <div className="text-right">
          <p className="font-bold">{user.name}</p>
          <p className="text-sm opacity-70">Authenticated Institution</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-purple-500">
           <div className="flex items-center gap-3 mb-2">
             <BookOpen className="text-purple-600" />
             <h3 className="font-bold">Active Courses</h3>
           </div>
           <p className="text-2xl font-bold">{courses.length}</p>
        </Card>
        <Card className="p-6 border-l-4 border-blue-500">
           <div className="flex items-center gap-3 mb-2">
             <Users className="text-blue-600" />
             <h3 className="font-bold">Enrolled Students</h3>
           </div>
           <p className="text-2xl font-bold">1,240</p>
        </Card>
        <Card className="p-6 border-l-4 border-green-500">
           <div className="flex items-center gap-3 mb-2">
             <FileText className="text-green-600" />
             <h3 className="font-bold">Submissions</h3>
           </div>
           <p className="text-2xl font-bold">856</p>
        </Card>
      </div>

      <div className="flex justify-between items-center mt-8">
        <h2 className="text-xl font-bold flex items-center gap-2"><Clock className="animate-pulse text-green-600" size={20}/> Live Course Feed</h2>
        <Button onClick={() => setShowCourseModal(true)} icon={Plus}>Create New Course</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <Card key={course.id} className="p-4 flex flex-col justify-between h-full">
            <div>
              <div className="h-32 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-lg mb-2">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.description}</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">Edit</Button>
              <Button size="sm" onClick={() => { setSelectedCourseId(course.id); setShowAssignModal(true); }} className="flex-1">Add Assignment</Button>
            </div>
          </Card>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full text-center py-10 bg-gray-100 rounded-xl">
            <p className="text-gray-500">No active courses. Create your first course to get started.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal isOpen={showCourseModal} onClose={() => setShowCourseModal(false)} title="Create New Course">
        <div className="space-y-4">
          <Input label="Course Title" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} />
          <Input label="Description" value={courseDesc} onChange={e => setCourseDesc(e.target.value)} />
          <FileUpload 
            label="Course Thumbnail" 
            accept="image/*"
            onFileSelect={setThumbnailFile}
            uploading={isUploading}
            progress={uploadProgress}
          />
          <Button onClick={handleCreateCourse} className="w-full" isLoading={isUploading}>Publish Course</Button>
        </div>
      </Modal>

      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Create Assignment">
        <div className="space-y-4">
          <Input label="Assignment Title" value={assignTitle} onChange={e => setAssignTitle(e.target.value)} />
          <Input label="Due Date" type="date" value={assignDueDate} onChange={e => setAssignDueDate(e.target.value)} />
          <Button onClick={handleCreateAssignment} className="w-full">Assign & Notify Students</Button>
        </div>
      </Modal>
    </div>
  );
};