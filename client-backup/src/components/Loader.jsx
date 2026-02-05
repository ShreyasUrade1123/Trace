import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useThemeStore from '../store/themeStore';

const Loader = () => {
    const { currentTheme } = useThemeStore();
    const isSamba = currentTheme === 'SAMBA';
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Random increment for realistic effect
                return prev + Math.random() * 10;
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    // Theme Configuration
    const themeConfig = {
        NOIR: {
            bg: 'bg-black',
            barColor: 'bg-[#4ade80]', // Green-400 equivalent matching reference
            barBg: 'bg-white/10',
            textColor: 'text-white',
            logoText: 'text-white'
        },
        SAMBA: {
            bg: 'bg-[#FDFBF7]',
            barColor: 'bg-black',
            barBg: 'bg-black/10',
            textColor: 'text-black',
            logoText: 'text-black'
        },
        // Fallback for other themes
        DEFAULT: {
            bg: 'bg-black',
            barColor: 'bg-[#4ade80]',
            barBg: 'bg-white/10',
            textColor: 'text-white',
            logoText: 'text-white'
        }
    };

    const activeConfig = themeConfig[currentTheme] || themeConfig.DEFAULT;

    return (
        <div className={`fixed inset-0 z-[60] flex flex-col justify-between ${activeConfig.bg} transition-colors duration-500`}>

            {/* Top Progress Bar Section */}
            <div className="w-full flex items-start gap-1 p-2">
                {/* Segmented Bar */}
                <div className="flex-1 flex gap-[1px] h-6 md:h-8">
                    {Array.from({ length: 100 }).map((_, i) => {
                        // Calculate if this segment should be lit
                        const threshold = (i / 100) * 100;
                        const isLit = progress >= threshold;

                        return (
                            <div
                                key={i}
                                className={`flex-1 h-full transition-colors duration-100 ${isLit ? activeConfig.barColor : activeConfig.barBg} opacity-80`}
                            />
                        );
                    })}
                </div>

                {/* Percentage Text */}
                <div className={`font-mono text-xs md:text-sm pt-1 pl-2 ${activeConfig.textColor}`}>
                    {Math.min(100, Math.floor(progress))}%
                </div>
            </div>


        </div>
    );
};

export default Loader;
