import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const ActionCard = ({ icon, title, description, onClick, featured }) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "group relative overflow-hidden rounded-2xl p-7 cursor-pointer transition-all duration-300 h-full",
                featured
                    ? "bg-[#0A0A0A] text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1"
                    : "bg-white border border-white/60 shadow-sm hover:shadow-md hover:border-black/10 hover:-translate-y-1"
            )}
        >
            {/* Featured Gradient Mesh */}
            {featured && (
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500 via-blue-500 to-transparent pointer-events-none mix-blend-screen" />
            )}

            <div className="relative z-10 flex flex-col h-full">
                <div className={cn(
                    "mb-5 p-3.5 rounded-xl w-fit transition-transform group-hover:scale-105",
                    featured
                        ? "bg-white/10 text-white backdrop-blur-sm"
                        : "bg-gray-50 text-black border border-gray-100"
                )}>
                    {icon}
                </div>
                <h3 className={cn(
                    "text-xl font-medium mb-2.5",
                    featured ? "text-white" : "text-black"
                )}>
                    {title}
                </h3>
                <p className={cn(
                    "text-sm leading-relaxed",
                    featured ? "text-gray-400" : "text-gray-500"
                )}>
                    {description}
                </p>

                {/* Arrow hint on hover */}
                <div className={cn(
                    "mt-auto pt-4 flex items-center gap-2 text-sm font-medium opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300",
                    featured ? "text-white" : "text-black"
                )}>
                    <span>Start Creating</span>
                    <span>→</span>
                </div>
            </div>
        </div>
    );
};

export default ActionCard;
