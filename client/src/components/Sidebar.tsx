import React from 'react';
import { Home, Folder, Video, RefreshCw, Users, BarChart2, Settings, Trash2, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Sidebar = () => {
    return (
        <div className="w-64 h-full backdrop-blur-xl bg-white/50 border-r border-white/20 flex flex-col font-neueHaas shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]">
            {/* Header */}
            <div className="p-8 flex items-center gap-3">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                </div>
                <h1 className="text-2xl font-bold text-black tracking-tight">Trace</h1>
            </div>

            {/* Primary Action */}
            <div className="px-6 mb-8">
                <button className="w-full py-3.5 px-4 bg-[#0A0A0A] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-black/5 group">
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>New Project</span>
                </button>
            </div>

            {/* Main Nav */}
            <nav className="flex-1 px-4 space-y-1">
                <div className="px-4 mb-2">
                    <p className="text-[10px] font-iki uppercase tracking-[0.2em] text-gray-400">Menu</p>
                </div>
                <NavItem icon={<Home size={18} />} label="Home" active />
                <NavItem icon={<Folder size={18} />} label="All Projects" />
                <NavItem icon={<Video size={18} />} label="Templates" />

                <div className="px-4 mt-8 mb-2">
                    <p className="text-[10px] font-iki uppercase tracking-[0.2em] text-gray-400">Tools</p>
                </div>
                <NavItem icon={<RefreshCw size={18} />} label="Auto-update" />
                <NavItem icon={<BarChart2 size={18} />} label="Analytics" />
                <NavItem icon={<Users size={18} />} label="Team" />
            </nav>

            {/* Footer Nav */}
            <div className="px-4 py-6 mt-auto space-y-1">
                <NavItem icon={<Settings size={18} />} label="Settings" />
                <NavItem icon={<Trash2 size={18} />} label="Trash" />

                {/* User Profile */}
                <div className="mt-6 pt-6 border-t border-black/5 flex items-center gap-3 px-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 border border-white shadow-sm"></div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-black truncate">User Name</p>
                        <p className="text-xs text-gray-500 truncate">user@example.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NavItem = ({ icon, label, active }) => {
    return (
        <div className={cn(
            "flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
            active
                ? "bg-white/80 text-black shadow-sm border border-white/50 font-medium"
                : "text-gray-500 hover:bg-white/40 hover:text-black"
        )}>
            {icon}
            <span className="text-[15px]">{label}</span>
        </div>
    );
};

export default Sidebar;
