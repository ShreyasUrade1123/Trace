import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ActionCard from '../components/ActionCard';
import ToolCard from '../components/ToolCard';
import UploadModal from '../components/UploadModal';
import { Video, Upload, FileText, Scissors, Globe, Wand2, Folder } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Dashboard = () => {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const { user } = useAuthStore();

    return (
        <DashboardLayout>
            <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

            <div className="p-10 max-w-7xl mx-auto space-y-12 font-neueHaas">

                {/* Header */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-4xl font-medium text-black mb-3 tracking-tight">
                            Welcome back, {user?.name || 'Creator'}.
                        </h1>
                        <p className="text-gray-500 text-lg">Create engaging documentation in minutes.</p>
                    </div>
                </div>

                {/* Action Grid */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[11px] font-iki font-bold text-gray-400 uppercase tracking-[0.2em]">Create New</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ActionCard
                            icon={<Video size={24} />}
                            title="Record Screen"
                            description="Capture your screen and voice to generate a guide automatically."
                            featured
                        />
                        <ActionCard
                            icon={<Upload size={24} />}
                            title="Upload Video"
                            description="Import an existing video file to process with AI."
                            onClick={() => setIsUploadOpen(true)}
                        />
                        <ActionCard
                            icon={<FileText size={24} />}
                            title="Paste Script"
                            description="Start with a script and let AI generate the visuals (Coming Soon)."
                        />
                    </div>
                </section>

                {/* AI Tools Grid */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[11px] font-iki font-bold text-gray-400 uppercase tracking-[0.2em]">AI Tools</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <ToolCard
                            icon={<Scissors size={20} />}
                            title="Smart Cuts"
                            description="Remove silences and filler words automatically."
                            isNew
                        />
                        <ToolCard
                            icon={<Wand2 size={20} />}
                            title="Auto-Update"
                            description="Detect UI changes and refresh your docs."
                        />
                        <ToolCard
                            icon={<Globe size={20} />}
                            title="Translator"
                            description="Translate video and text into 30+ languages."
                        />
                    </div>
                </section>

                {/* Recent Projects (Empty State) */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[11px] font-iki font-bold text-gray-400 uppercase tracking-[0.2em]">Recent Projects</h2>
                    </div>
                    <div className="backdrop-blur-md bg-white/40 border border-white/60 rounded-2xl h-72 flex flex-col items-center justify-center relative overflow-hidden group shadow-sm">

                        {/* Subtle ambient light inside card */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        <div className="relative z-10 text-center">
                            <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 flex items-center justify-center mx-auto mb-5 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.05)] transform group-hover:scale-110 transition-transform duration-300">
                                <Folder size={32} className="text-gray-300 group-hover:text-black transition-colors duration-300" />
                            </div>
                            <h3 className="text-xl font-medium text-black mb-2">No projects yet</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">Choose an option above to start your first documentation project</p>

                            <button onClick={() => setIsUploadOpen(true)} className="mt-6 px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-black/20 hover:shadow-md transition-all">
                                Import a video
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
