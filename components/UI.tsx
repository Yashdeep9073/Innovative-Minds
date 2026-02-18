
import React, { useState, useRef } from 'react';
import { LucideIcon, Upload, X, File as FileIcon, Check, AlertCircle } from 'lucide-react';

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', isLoading, icon: Icon, className = '', ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none touch-manipulation active:scale-95 transition-transform duration-100";
  
  const variants = {
    primary: "bg-[#D62828] text-white hover:bg-[#b01e1e] focus:ring-[#D62828]",
    secondary: "bg-black text-white hover:bg-gray-800 focus:ring-gray-800",
    outline: "border-2 border-[#D62828] text-[#D62828] hover:bg-[#D62828] hover:text-white",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm min-w-[80px]", // Increased min-height for touch
    md: "h-11 px-5 py-2.5 text-base", // Standard mobile friendly size
    lg: "h-14 px-8 text-lg",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} 
      disabled={isLoading}
      {...props}
    >
      {isLoading && <span className="mr-2 animate-spin">⚪</span>}
      {Icon && !isLoading && <Icon size={size === 'sm' ? 16 : 20} className="mr-2 flex-shrink-0" />}
      {children}
    </button>
  );
};

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <input 
        className={`w-full px-4 py-3 text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D62828] focus:border-transparent transition-shadow ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        style={{ fontSize: '16px' }} // Explicit 16px to prevent iOS zoom
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {error}</p>}
    </div>
  );
};

// --- FILE UPLOAD ---
interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  onFileSelect: (file: File) => void;
  uploading?: boolean;
  progress?: number;
  error?: string;
  fileUrl?: string; // If already uploaded
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  label = "Upload File", 
  accept = "*", 
  maxSizeMB = 10,
  onFileSelect,
  uploading = false,
  progress = 0,
  error: externalError,
  fileUrl
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [internalError, setInternalError] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setInternalError('');
    if (file.size > maxSizeMB * 1024 * 1024) {
      setInternalError(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const error = externalError || internalError;

  return (
    <div className="w-full mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      
      {!selectedFile && !fileUrl ? (
        <div 
          className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors cursor-pointer touch-manipulation
            ${dragActive ? 'border-[#D62828] bg-red-50' : 'border-gray-300 hover:bg-gray-50 active:bg-gray-100'}
            ${error ? 'border-red-500 bg-red-50' : ''}`}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input 
            ref={inputRef}
            type="file" 
            className="hidden" 
            accept={accept} 
            onChange={handleChange}
          />
          <Upload className={`w-10 h-10 mb-3 ${dragActive ? 'text-[#D62828]' : 'text-gray-400'}`} />
          <p className="text-sm text-gray-600 font-medium">Tap to upload</p>
          <p className="text-xs text-gray-500 mt-1">Max size: {maxSizeMB}MB</p>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
               <FileIcon size={20} />
             </div>
             <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {selectedFile ? selectedFile.name : 'Uploaded File'}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'Ready'}
                </p>
             </div>
             {!uploading && !fileUrl && (
               <button onClick={() => { setSelectedFile(null); if (inputRef.current) inputRef.current.value = ''; }} className="p-2 hover:bg-gray-200 rounded-full">
                 <X size={20} className="text-gray-500" />
               </button>
             )}
             {fileUrl && (
                <div className="text-green-600 flex items-center gap-1 text-sm font-bold">
                  <Check size={16} />
                </div>
             )}
          </div>
          
          {uploading && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Uploading...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-[#D62828] h-1.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-xs bg-red-50 p-2 rounded-lg">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

// --- CARD ---
export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
    {children}
  </div>
);

// --- MODAL ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-5 border-b sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:text-[#D62828] hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- LOGO ---
export const Logo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center gap-2 font-poppins font-bold text-2xl tracking-tight text-[#D62828] ${className}`}>
    <div className="w-10 h-10 bg-[#D62828] text-white flex items-center justify-center rounded-xl shadow-lg transform rotate-3">
      <span className="text-xl font-black">IM</span>
    </div>
    <span className="hidden sm:inline">Innovative Minds</span>
  </div>
);
