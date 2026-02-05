import React, { useState, useRef } from 'react';
import { X, Upload, FileVideo, CheckCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const UploadModal = ({ isOpen, onClose }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file) => {
        if (file.type.startsWith('video/')) {
            setFile(file);
        } else {
            alert('Please upload a video file.');
        }
    };

    const handleUpload = () => {
        if (!file) return;
        setStatus('uploading');

        // Simulate upload
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setFile(null);
                    setUploadProgress(0);
                }, 1500);
            }
        }, 200);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-lg bg-card border border-border rounded-xl p-6 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-secondary hover:text-white"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-white mb-1">Upload Video</h2>
                <p className="text-sm text-text-secondary mb-6">Drag and drop your video file here.</p>

                {status === 'success' ? (
                    <div className="flex flex-col items-center justify-center py-10 text-green-500">
                        <CheckCircle size={48} className="mb-4" />
                        <p className="text-lg font-medium">Upload Complete!</p>
                    </div>
                ) : (
                    <>
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-xl py-12 flex flex-col items-center justify-center transition-colors cursor-pointer",
                                isDragging ? "border-brand-start bg-brand-start/10" : "border-border hover:border-text-secondary bg-background/50"
                            )}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="video/*"
                                onChange={handleFileSelect}
                            />

                            {file ? (
                                <div className="flex flex-col items-center">
                                    <FileVideo size={48} className="text-brand-end mb-4" />
                                    <p className="text-white font-medium mb-1">{file.name}</p>
                                    <p className="text-xs text-text-secondary">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-text-secondary">
                                    <Upload size={40} className="mb-4" />
                                    <p className="text-sm font-medium mb-1">Click to browse or drag file</p>
                                    <p className="text-xs">MP4, MOV, AVI up to 1GB</p>
                                </div>
                            )}
                        </div>

                        {status === 'uploading' && (
                            <div className="mt-6">
                                <div className="flex justify-between text-xs text-text-secondary mb-2">
                                    <span>Uploading...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-brand-start h-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={!file || status === 'uploading'}
                                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-brand-start to-brand-end text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {status === 'uploading' && <Loader2 size={16} className="animate-spin" />}
                                {status === 'uploading' ? 'Uploading...' : 'Upload Video'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UploadModal;
