import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ToolCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    isNew?: boolean;
}

const ToolCard = ({ icon, title, description, isNew }: ToolCardProps) => {
    return (
        <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl p-5 flex items-start gap-4 hover:bg-white/80 hover:shadow-sm hover:border-black/5 transition-all duration-200 cursor-pointer group">
            <div className="p-2.5 bg-white rounded-lg text-black shadow-sm group-hover:scale-105 transition-transform duration-200">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <h4 className="font-medium text-black truncate">{title}</h4>
                    {isNew && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-black text-white rounded uppercase tracking-wider">
                            New
                        </span>
                    )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{description}</p>
            </div>
            <ArrowRight size={16} className="text-black opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
        </div>
    );
};

export default ToolCard;
