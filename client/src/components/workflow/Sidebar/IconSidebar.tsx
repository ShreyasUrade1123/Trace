'use client';

import React from 'react';
import {
    Search,
    History,
    Briefcase,
    Box,
    Package,
    Sparkles,
    HelpCircle,
    MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';

interface IconSidebarProps {
    activeSection: string | null;
    onSectionClick: (section: string) => void;
}

export default function IconSidebar({ activeSection, onSectionClick }: IconSidebarProps) {
    const icons = [
        { id: 'search', icon: Search, label: 'Search' },
        { id: 'history', icon: History, label: 'History' },
        { id: 'projects', icon: Briefcase, label: 'Projects' },
        { id: 'assets', icon: Box, label: 'Assets' },
        { id: 'models', icon: Package, label: 'Models' },
        { id: 'toolkit', icon: Box, label: 'Toolkit' },
        { id: 'ai', icon: Sparkles, label: 'AI' },
    ];

    return (
        <div className="w-[57px] bg-[#212126] flex flex-col items-center py-[18px] z-30">
            {/* Logo / Home */}
            <Link
                href="/dashboard"
                className="w-8 h-8 flex items-center justify-center hover:opacity-90 transition-opacity mb-[33px]"
            >
                <Image src="/logo.svg" alt="Galaxy.ai" width={32} height={32} className="w-6 h-6" />
            </Link>

            {/* Navigation Icons */}
            <div className="flex flex-col gap-[9px]">
                {icons.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSectionClick(item.id)}
                            className={`
                                w-10 h-10 flex items-center justify-center rounded-lg transition-all
                                ${isActive
                                    ? 'bg-[#FAFFC7] text-black'
                                    : 'text-gray-300 hover:text-white hover:bg-[#1C1C1E]'
                                }
                            `}
                            title={item.label}
                        >
                            <Icon className="w-4.5 h-4.5" strokeWidth={1.5} />
                        </button>
                    );
                })}
            </div>

            <div className="flex-1" />

            {/* Bottom Icons */}
            <div className="flex flex-col gap-2 items-center">
                <button
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1C1C1E] rounded-lg transition-colors"
                    title="Help"
                >
                    <HelpCircle className="w-5 h-5" />
                </button>

                {/* Discord */}
                <a
                    href="https://discord.gg/weavy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-[#5865F2] hover:bg-[#1C1C1E] rounded-lg transition-colors"
                    title="Discord"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.419-2.1569 2.419zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.419-2.1568 2.419z" />
                    </svg>
                </a>

                {/* User Profile */}
                <div className="mt-1">
                    <UserButton
                        appearance={{
                            elements: {
                                avatarBox: "w-8 h-8",
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
