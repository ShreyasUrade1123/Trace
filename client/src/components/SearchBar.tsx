import React, { forwardRef } from 'react';
import { Command } from 'lucide-react';

interface SearchBarProps {
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
    containerClass?: string;
    currentTheme?: string;
}

const SearchBar = forwardRef<HTMLDivElement, SearchBarProps>(({ placeholder = "Search for components, templates...", className = "", style, containerClass = "", currentTheme = "SAMBA" }, ref) => {

    const isNoir = currentTheme === "NOIR";

    return (
        <div ref={ref} className={`flex justify-center pointer-events-auto z-50 ${className}`} style={style}>
            <div className={`w-full max-w-[850px] mx-4 rounded-full p-1.5 pl-6 flex items-center shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-lg ${isNoir ? 'bg-black/20 border-white/10' : 'bg-white/10 border-white/20'} ${containerClass}`}>
                <input
                    type="text"
                    placeholder={placeholder}
                    className={`flex-1 bg-transparent border-none outline-none font-ikiCondensedThin font-regular text-base md:text-[16px] tracking-wider h-14 px-2 uppercase ${isNoir ? 'text-white placeholder-white/50' : 'text-black placeholder-black'}`}
                />
                <button className={`h-14 px-6 rounded-full text-sm font-ppneue font-regular tracking-widest flex items-center gap-2 transition-colors shadow-sm cursor-pointer ${isNoir ? 'bg-white/10 text-white hover:bg-white/20 border-white/10' : 'bg-white text-black hover:bg-gray-50 border-gray-200'}`}>
                    SEARCH
                    <div className={`flex items-center text-lg gap-0.5 ${isNoir ? 'text-white/50' : 'text-gray-400'}`}>
                        <Command size={17} />
                        <span>/</span>
                    </div>
                </button>
            </div>
        </div>
    );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
