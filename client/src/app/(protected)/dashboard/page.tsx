'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';
import {
    Plus,
    Folder,
    Users,
    LayoutGrid,
    ChevronDown,
    FileText,
    Search,
    List,
    Grid3X3
} from 'lucide-react';

// Template workflows for the library
const WORKFLOW_TEMPLATES = [
    { id: 'welcome', name: 'Weavy Welcome', image: 'https://images.unsplash.com/photo-1633355444132-695d5876cd00?q=80&w=800&auto=format&fit=crop', color: 'from-gray-800 to-gray-700' },
    { id: 'iterators', name: 'Weavy Iterators', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop', color: 'from-amber-200 to-yellow-400' },
    { id: 'multi-image', name: 'Multiple Image Models', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop', color: 'from-blue-400 to-blue-600' },
    { id: 'editing', name: 'Editing Images', image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop', color: 'from-stone-700 to-stone-900' },
    { id: 'compositor', name: 'Compositor Node', image: 'https://images.unsplash.com/photo-1614728853913-1e2203d9d73e?q=80&w=800&auto=format&fit=crop', color: 'from-yellow-200 to-yellow-500' },
    { id: 'image-video', name: 'Image to Video', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=800&auto=format&fit=crop', color: 'from-gray-300 to-gray-500' },
    { id: 'camera-angle', name: 'Camera Angle Ideation', image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?q=80&w=800&auto=format&fit=crop', color: 'from-pink-300 to-pink-500' },
];

interface Workflow {
    id: string;
    name: string;
    updatedAt: string;
}

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `Last edited ${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `Last edited ${Math.floor(diffInSeconds / 60)} minute${Math.floor(diffInSeconds / 60) > 1 ? 's' : ''} ago`;
    if (diffInSeconds < 86400) return `Last edited ${Math.floor(diffInSeconds / 3600)} hour${Math.floor(diffInSeconds / 3600) > 1 ? 's' : ''} ago`;
    return `Last edited ${Math.floor(diffInSeconds / 86400)} day${Math.floor(diffInSeconds / 86400) > 1 ? 's' : ''} ago`;
}

export default function DashboardPage() {
    const router = useRouter();
    const { user } = useUser();
    const [workflows, setWorkflows] = useState<Workflow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState<'library' | 'tutorials'>('library');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Fetch user's workflows
    useEffect(() => {
        fetchWorkflows();
    }, []);

    const fetchWorkflows = async () => {
        try {
            const response = await fetch('/api/workflows');
            if (response.ok) {
                const data = await response.json();
                setWorkflows(data.workflows || []);
            }
        } catch (error) {
            console.error('Failed to fetch workflows:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateNew = async () => {
        if (isCreating) return;
        setIsCreating(true);

        try {
            // Create a new workflow via API
            const response = await fetch('/api/workflows', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'untitled',
                    description: '',
                    nodes: [],
                    edges: [],
                }),
            });

            if (response.ok) {
                const workflow = await response.json();
                // Navigate to the new workflow editor
                router.push(`/workflows/${workflow.id}`);
            } else {
                console.error('Failed to create workflow');
                setIsCreating(false);
            }
        } catch (error) {
            console.error('Failed to create workflow:', error);
            setIsCreating(false);
        }
    };

    // Filter workflows by search query
    const filteredWorkflows = workflows.filter(workflow =>
        workflow.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#0E0E13] flex font-[family-name:var(--font-dm-sans)] text-xs text-gray-200">
            {/* Left Sidebar */}
            <aside className="w-[240px] bg-[#0E0E13] border-r border-gray-800 flex flex-col justify-between py-4">
                <div>
                    {/* User Profile Dropdown */}
                    <div className="px-4 mb-8">
                        <button className="flex items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors select-none">
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: "w-6 h-6 !w-6 !h-6",
                                        avatarBox: "w-6 h-6 !w-6 !h-6",
                                    },
                                }}
                            />
                            <span className="truncate max-w-[120px]">
                                {user?.firstName || user?.username || 'User'}
                            </span>
                            <ChevronDown className="w-3 h-3 opacity-60" />
                        </button>
                    </div>

                    {/* Create Button */}
                    <div className="px-2 mb-6">
                        <button
                            onClick={handleCreateNew}
                            disabled={isCreating}
                            className="w-[223px] flex items-center justify-center gap-1 px-0 py-[7px] bg-[#F7FFA8] hover:bg-[#FAFFC7] disabled:opacity-50 text-black text-[14px] font-medium rounded-sm transition-colors select-none"
                        >
                            <Plus className="w-4.5 h-4.5 stroke-[1px]" />
                            {isCreating ? 'Creating...' : 'Create New File'}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="px-2 space-y-1">
                        {/* My Files - Active State */}
                        <div className="flex items-center justify-between group px-4.5 py-[10px] bg-[#212126] rounded-sm text-white cursor-pointer select-none">
                            <div className="flex items-center gap-3">
                                <Folder className="w-4 h-4" fill="currentColor" />
                                <span className="text-sm font-medium">My Files</span>
                            </div>
                            <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity" onClick={(e) => { e.stopPropagation(); handleCreateNew(); }} />
                        </div>

                        {/* Shared with me */}
                        <button className="w-full flex items-center gap-3 px-4.5 py-[10px] text-[#666] hover:text-white hover:bg-[#1C1C1E]/50 rounded-sm transition-colors select-none">
                            <Users className="w-4 h-4" />
                            <span className="text-sm font-medium">Shared with me</span>
                        </button>

                        {/* Apps */}
                        <button className="w-full flex items-center gap-3 px-4.5 py-[10px] text-[#666] hover:text-white hover:bg-[#1C1C1E]/50 rounded-md transition-colors select-none">
                            <LayoutGrid className="w-4 h-4" />
                            <span className="text-sm font-medium">Apps</span>
                        </button>
                    </nav>
                </div>

                {/* Bottom Actions */}
                <div className="px-4">
                    {/* Discord */}
                    <a
                        href="https://discord.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-2 py-2 text-gray-400 hover:text-white transition-colors select-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 8 36 36" fill="currentColor">
                            <path d="M28.0177 15.116C26.545 14.4367 24.9748 13.9398 23.3268 13.6393C23.3268 13.6393 23.0645 14.1205 22.8465 14.6542C21.0968 14.394 19.3497 14.394 17.625 14.6542C17.4042 14.1205 17.1392 13.6393 17.1392 13.6393C15.4883 13.9398 13.9182 14.4367 12.4455 15.116C9.522 19.4627 8.70817 23.6827 9.10233 27.8688C10.8753 29.1772 12.5835 29.9723 14.2678 30.4998C14.6853 29.9298 15.0608 29.3248 15.3908 28.6948C14.7608 28.4573 14.1558 28.1823 13.5858 27.8698C13.7383 27.7573 13.8883 27.6398 14.0333 27.5223C17.4858 29.1123 21.2408 29.1123 24.6608 27.5223C24.8083 27.6423 24.9583 27.7573 25.1083 27.8698C24.5383 28.1848 23.9333 28.4598 23.3033 28.6948C23.6358 29.3248 24.0135 29.9298 24.4335 30.4998C26.1178 29.9723 27.826 29.1772 29.599 27.8688C30.0157 23.3452 28.9402 19.0627 28.0177 15.116ZM16.3292 24.7773C15.2667 24.7773 14.3992 23.8048 14.3992 22.6223C14.3992 21.4398 15.2517 20.4673 16.3292 20.4673C17.4192 20.4673 18.2867 21.4398 18.2717 22.6223C18.2717 23.8048 17.4192 24.7773 16.3292 24.7773ZM24.1642 24.7773C23.1017 24.7773 22.2342 23.8048 22.2342 22.6223C22.2342 21.4398 23.0867 20.4673 24.1642 20.4673C25.2542 20.4673 26.1217 21.4398 26.1067 22.6223C26.1067 23.8048 25.2542 24.7773 24.1642 24.7773Z" />
                        </svg>
                        <span className="text-sm font-medium">Discord</span>
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto px-17 py-9">
                {/* Header */}
                <div className="flex items-center justify-between mb-9">
                    <h1 className="text-[14px] font-regular text-white select-none">
                        {user?.firstName || user?.username || 'User'}&apos;s Workspace
                    </h1>
                    <button
                        onClick={handleCreateNew}
                        disabled={isCreating}
                        className="flex items-center justify-center gap-1 px-3.5 py-1.75 bg-[#F7FFA8] hover:bg-[#FAFFC7] disabled:opacity-50 text-black text-[14px] font-regular rounded transition-colors select-none"
                    >
                        <Plus className="w-4.5 h-4.5" />
                        {isCreating ? 'Creating...' : 'Create New File'}
                    </button>
                </div>

                {/* Workflow Library Section */}
                <section className="mb-9">
                    <div className="bg-[#212126] rounded-lg px-4.5 py-3 border border-[#1C1C1E] select-none">
                        {/* Tabs */}
                        <div className="flex items-center gap-0 mb-3">
                            <button
                                onClick={() => setActiveTab('library')}
                                className={`text-[12px] font-regular justify-center px-2 py-0.5 rounded-sm transition-all select-none ${activeTab === 'library'
                                    ? 'bg-[#353539] text-white shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Workflow library
                            </button>
                            <button
                                onClick={() => setActiveTab('tutorials')}
                                className={`text-[12px] font-regular px-3 py-1.5 rounded-md transition-all select-none ${activeTab === 'tutorials'
                                    ? 'bg-[#2C2C2E] text-white shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                Tutorials
                            </button>
                        </div>

                        {/* Template Cards Horizontal Scroll */}
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x select-none">
                            {WORKFLOW_TEMPLATES.map((template) => (
                                <Link
                                    key={template.id}
                                    href={`/workflows/new?template=${template.id}`}
                                    className="flex-shrink-0 group relative snap-start"
                                >
                                    <div className="w-[170px] h-[115px]  rounded-lg overflow-hidden relative">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${template.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                                            <img
                                                src={template.image}
                                                alt={template.name}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity mix-blend-overlay"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                        <p className="absolute bottom-3 left-3 text-[12px] font-regular text-white z-10 leading-tight select-none">
                                            {template.name}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* My Files Section */}
                <section className="flex-1">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-9">
                        <h2 className="text-[14px] font-regular px-1.5 text-white select-none">My files</h2>

                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-48 pl-9 pr-3 py-1.5 bg-transparent border border-[#333] rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#555] transition-colors"
                                />
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center border border-[#333] rounded-md overflow-hidden">
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-[#2C2C2E] text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-[#2C2C2E] text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-6 h-6 border-2 border-[#E1E476] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredWorkflows.length === 0 && workflows.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-start pt-32">
                            <div className="w-16 h-16 mb-6 opacity-60">
                                <svg viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="4" className="w-full h-full">
                                    <circle cx="50" cy="50" r="45" strokeOpacity="0.1" />
                                    <path d="M20 50 Q 50 20 80 50" strokeLinecap="round" />
                                    <path d="M20 50 Q 50 80 80 50" strokeLinecap="round" />
                                    <path d="M50 20 Q 20 50 50 80" strokeLinecap="round" transform="rotate(90 50 50)" />
                                    <path d="M50 20 Q 80 50 50 80" strokeLinecap="round" transform="rotate(90 50 50)" />
                                </svg>
                            </div>
                            <h3 className="text-sm font-medium text-white mb-2 select-none">Nothing here yet!</h3>
                            <p className="text-xs text-[#6B6B6B] mb-8 select-none">
                                Start weaving to bring your ideas to life.
                            </p>
                            <button
                                onClick={handleCreateNew}
                                disabled={isCreating}
                                className="px-6 py-2 border border-[#333] hover:border-[#555] bg-transparent hover:bg-[#1C1C1E] text-white text-xs font-medium rounded-lg transition-all select-none disabled:opacity-50"
                            >
                                {isCreating ? 'Creating...' : 'Create New File'}
                            </button>
                        </div>
                    ) : filteredWorkflows.length === 0 ? (
                        /* No search results */
                        <div className="flex flex-col items-center justify-center py-20">
                            <p className="text-sm text-gray-500 select-none">No workflows matching "{searchQuery}"</p>
                        </div>
                    ) : (
                        /* Workflow Grid */
                        <div className={viewMode === 'grid'
                            ? "flex flex-wrap gap-[16px]"
                            : "flex flex-col gap-2"
                        }>
                            {filteredWorkflows.map((workflow) => (
                                <Link
                                    key={workflow.id}
                                    href={`/workflows/${workflow.id}`}
                                    className="group block"
                                >
                                    {viewMode === 'grid' ? (
                                        <>
                                            <div className="h-[240px] w-[210px] rounded-lg bg-[#212126] border border-[#323237] group-hover:bg-[#424247] group-hover:border-[#E1E476]/50 transition-colors overflow-hidden relative">
                                                <div className="w-full h-full flex items-center justify-center">
                                                    {/* Workflow node icon */}
                                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-gray-600 group-hover:text-gray-400 transition-colors">
                                                        <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                                                        <rect x="28" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                                                        <rect x="18" y="28" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" />
                                                        <path d="M14 20V24H24V28" stroke="currentColor" strokeWidth="2" />
                                                        <path d="M34 20V24H24" stroke="currentColor" strokeWidth="2" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="mt-1.5 px-2 select-none">
                                                <p className="text-sm text-gray-200 truncate group-hover:text-[#E1E476] transition-colors">{workflow.name}</p>
                                                <p className="text-[12px] text-[#A8A8AA] mt-0">
                                                    {formatRelativeTime(workflow.updatedAt)}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#1C1C1E] transition-colors select-none">
                                            <FileText className="w-5 h-5 text-gray-500" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-200 truncate group-hover:text-[#E1E476] transition-colors">{workflow.name}</p>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                {formatRelativeTime(workflow.updatedAt)}
                                            </p>
                                        </div>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
