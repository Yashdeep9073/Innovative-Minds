
import React, { useState, useEffect } from 'react';
import { 
  Download, Pause, Play, Trash2, CheckCircle, 
  AlertCircle, HardDrive, ChevronRight, X, Zap
} from 'lucide-react';
import { offlineStorage, DownloadTask } from '../utils/offlineStorage';
import { downloadService } from '../utils/downloadService';
import { Button, Card } from './UI';

export const DownloadManager: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [tasks, setTasks] = useState<DownloadTask[]>([]);
  const [storageUsage, setStorageUsage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lowDataMode, setLowDataMode] = useState(localStorage.getItem('low_data_mode') === 'true');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [allTasks, usage] = await Promise.all([
        offlineStorage.getDownloadTasks(),
        offlineStorage.getStorageUsage()
      ]);
      setTasks(allTasks);
      setStorageUsage(usage);
      setLoading(false);
    };

    loadData();
    const interval = setInterval(loadData, 2000); // Poll for progress updates
    return () => clearInterval(interval);
  }, []);

  const toggleLowData = () => {
    const newVal = !lowDataMode;
    setLowDataMode(newVal);
    localStorage.setItem('low_data_mode', String(newVal));
    window.dispatchEvent(new Event('storage')); // Notify other components
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = async (courseId: string) => {
    await downloadService.removeDownload(courseId);
    setConfirmDelete(null);
    loadData();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b flex justify-between items-center bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#D62828] text-white rounded-lg">
            <Download size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Download Manager</h2>
            <p className="text-xs text-gray-500">Manage your offline learning content</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-700">
          <HardDrive size={16} />
          <span className="text-sm font-medium">Storage Used: {formatSize(storageUsage)}</span>
        </div>
        <button 
          onClick={() => offlineStorage.clearAll().then(loadData)}
          className="text-xs text-blue-600 hover:underline font-bold"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Download size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-500">No active or completed downloads.</p>
            <p className="text-xs text-gray-400 mt-1">Courses you download for offline study will appear here.</p>
          </div>
        ) : (
          tasks.map(task => (
            <Card key={task.id} className="p-4 border-l-4 border-l-[#D62828]">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 line-clamp-1">{task.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      task.status === 'completed' ? 'bg-green-100 text-green-700' :
                      task.status === 'downloading' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status}
                    </span>
                    <span className="text-xs text-gray-400">• {formatSize(task.downloadedSize || 0)}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {task.status === 'downloading' ? (
                    <button onClick={() => downloadService.pauseDownload(task.id)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                      <Pause size={18} />
                    </button>
                  ) : task.status === 'paused' ? (
                    <button onClick={() => downloadService.resumeDownload(task.id)} className="p-2 hover:bg-gray-100 rounded-lg text-blue-600">
                      <Play size={18} />
                    </button>
                  ) : null}
                  <button onClick={() => setConfirmDelete(task.courseId)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {confirmDelete === task.courseId && (
                <div className="mb-3 p-3 bg-red-50 rounded-lg border border-red-100 flex items-center justify-between animate-in slide-in-from-top-2">
                  <p className="text-xs text-red-700 font-medium">Remove this download?</p>
                  <div className="flex gap-2">
                    <button onClick={() => setConfirmDelete(null)} className="text-xs font-bold text-gray-500 hover:underline">Cancel</button>
                    <button onClick={() => handleDelete(task.courseId)} className="text-xs font-bold text-red-600 hover:underline">Confirm</button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      task.status === 'completed' ? 'bg-green-500' : 
                      task.status === 'error' ? 'bg-red-500' : 'bg-[#D62828]'
                    }`}
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-gray-500">
                  <span>{task.progress}% COMPLETE</span>
                  {task.status === 'downloading' && <span className="animate-pulse">DOWNLOADING...</span>}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="p-6 border-t bg-gray-50 space-y-4">
        <button 
          onClick={toggleLowData}
          className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
            lowDataMode ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-white border-gray-100'
          }`}
        >
          <div className={`p-3 rounded-full ${lowDataMode ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400'}`}>
            <Zap size={20} className={lowDataMode ? 'fill-amber-600' : ''} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-gray-900">Low Data Mode</p>
            <p className="text-xs text-gray-500">
              {lowDataMode ? 'Active: Prioritizing text & lower quality.' : 'Inactive: High quality streaming enabled.'}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
