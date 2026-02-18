import React, { useState } from 'react';
import { User } from '../types';
import { Card, Button, FileUpload } from '../components/UI';
import { uploadSecureFile, db } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { UploadCloud, BarChart2, CheckCircle } from 'lucide-react';

interface Props {
  user: User;
}

export const PartnerDashboard: React.FC<Props> = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setCompleted(false);

    try {
      // 1. Upload to Storage
      const result = await uploadSecureFile(
        selectedFile,
        'partner_resource',
        { userId: user.id, role: user.role },
        setProgress
      );

      // 2. Save Metadata to Firestore
      await addDoc(collection(db, "resources"), {
        title: selectedFile.name,
        url: result.url,
        storagePath: result.path,
        ownerId: user.id,
        type: selectedFile.type,
        createdAt: serverTimestamp(),
        downloads: 0,
        views: 0
      });

      setCompleted(true);
      setSelectedFile(null);
      setTimeout(() => setCompleted(false), 3000);
    } catch (error) {
      console.error("Resource upload failed", error);
      alert("Failed to upload resource. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 min-h-screen">
      <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Partner Resource Hub</h1>
        <p className="text-blue-200">Upload content and track impact.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
             <UploadCloud className="text-blue-600" /> Upload Resource
           </h3>
           
           {completed ? (
             <div className="text-center py-8 text-green-600 animate-in fade-in">
               <CheckCircle size={48} className="mx-auto mb-4" />
               <p className="font-bold">Resource Published Successfully!</p>
               <Button variant="outline" className="mt-4" onClick={() => setCompleted(false)}>Upload Another</Button>
             </div>
           ) : (
             <div className="space-y-4">
               <p className="text-sm text-gray-500 mb-4">Share PDFs, Videos, or Datasets with the IMI network.</p>
               
               <FileUpload 
                 onFileSelect={setSelectedFile}
                 uploading={uploading}
                 progress={progress}
                 label="Select Resource File"
               />
               
               <Button 
                 onClick={handleUpload} 
                 disabled={!selectedFile || uploading} 
                 className="w-full"
                 isLoading={uploading}
               >
                 {uploading ? 'Uploading...' : 'Publish to Network'}
               </Button>
             </div>
           )}
        </Card>

        <Card className="p-8">
           <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
             <BarChart2 className="text-green-600" /> Impact Analytics
           </h3>
           <div className="space-y-4">
             <div className="flex justify-between items-center border-b pb-2">
               <span className="text-gray-600">Resource Views</span>
               <span className="font-bold">1,240</span>
             </div>
             <div className="flex justify-between items-center border-b pb-2">
               <span className="text-gray-600">Downloads</span>
               <span className="font-bold">450</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="text-gray-600">Student Rating</span>
               <span className="font-bold text-yellow-500">4.8 ★</span>
             </div>
           </div>
        </Card>
      </div>
    </div>
  );
};