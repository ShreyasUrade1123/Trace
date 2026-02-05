'use client';

import { useState } from 'react';
import {
    Play,
    Share2,
    Sparkles,
    ChevronDown,
    MoreHorizontal
} from 'lucide-react';
import { UserButton } from '@clerk/nextjs';
import { useWorkflowStore } from '@/stores/workflow-store';

interface WorkflowHeaderProps {
    workflowId?: string;
    onRun: (scope: 'full' | 'selected' | 'single') => Promise<void>;
    onSave: () => Promise<void>;
}

export function WorkflowHeader({ workflowId, onRun, onSave }: WorkflowHeaderProps) {
    const [isRunning, setIsRunning] = useState(false);

    // Using store state
    const workflowName = useWorkflowStore((state) => state.workflowName);
    const setWorkflowName = useWorkflowStore((state) => state.setWorkflowName);

    return (
        <header className="h-14 bg-[#0E0E10] border-b border-[#1C1C1E] flex items-center justify-between px-4 z-20">
            {/* Left: Workflow Name */}
            <div className="flex items-center">
                <input
                    type="text"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="bg-transparent text-gray-200 font-medium text-sm focus:outline-none focus:text-white px-2 py-1 rounded hover:bg-[#1C1C1E] transition-colors w-[200px]"
                    placeholder="Untitled workflow"
                />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
                {/* Credits Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1C1C1E] rounded-full border border-[#2C2C2E]">
                    <Sparkles className="w-3 h-3 text-gray-400" />
                    <span className="text-xs font-medium text-gray-300">150 credits</span>
                </div>

                {/* Share Button */}
                <button className="flex items-center gap-2 px-3 py-1.5 bg-[#E1E476] hover:bg-[#d4d765] text-black rounded-lg transition-colors">
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">Share</span>
                </button>

                {/* Tasks Dropdown */}
                <button className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white hover:bg-[#1C1C1E] rounded-lg transition-colors">
                    <span className="text-xs font-medium">Tasks</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* User Profile */}
                <div className="ml-2">
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "w-7 h-7",
                            },
                        }}
                    />
                </div>
            </div>
        </header>
    );
}
