import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Typewriter = ({ words, delay = 3000 }) => {
    const [index, setIndex] = React.useState(0);
    const [displayText, setDisplayText] = React.useState(words[0]);
    const [isDeleting, setIsDeleting] = React.useState(false);

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            const currentWord = words[index];

            if (isDeleting) {
                setDisplayText(prev => prev.slice(0, -1));
                if (displayText === '') {
                    setIsDeleting(false);
                    setIndex((prev) => (prev + 1) % words.length);
                }
            } else {
                setDisplayText(currentWord.slice(0, displayText.length + 1));
                if (displayText === currentWord) {
                    // Wait before deleting
                    setTimeout(() => setIsDeleting(true), delay);
                    return;
                }
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, index, words, delay]);

    return (
        <span className="relative inline-block px-1">
            {displayText}
            <span className="animate-pulse">|</span>
            {/* Grid background for Typewriter */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
                    backgroundSize: '10px 10px'
                }}
            />
        </span>
    );
};

const Footer = ({ currentTheme }) => {
    // Theme logic - default to the image style (White/Black) if theme is active
    const isSamba = currentTheme === 'SAMBA';
    // However, the user said "exactly same as image", which is white bg, black text.
    // I will make it adhere to the theme but mapped correctly.
    // If NOIR (dark), it should probably invert for consistency, OR stay white if they want EXACT replica always.
    // Usually "exact replica" implies visual identity. But a dark footer on a dark page is better.
    // I will implement theme support: White/Black for Samba/Default, Black/White for Noir.

    const bgColor = currentTheme === 'NOIR' ? 'bg-[#0a0a0a]' : 'bg-white';
    const textColor = currentTheme === 'NOIR' ? 'text-white' : 'text-black';
    const subTextColor = currentTheme === 'NOIR' ? 'text-gray-400' : 'text-gray-500';
    const borderColor = currentTheme === 'NOIR' ? 'border-white/10' : 'border-black/10';
    const inputBg = currentTheme === 'NOIR' ? 'bg-white/10' : 'bg-[#EDECE8]';

    return (
        <section className={`relative ${bgColor} ${textColor} pt-20 pb-0 overflow-hidden font-sans transition-colors duration-500`}>
            <div className="container mx-auto px-6 md:px-12 relative z-10">

                {/* Top Headline */}
                <div className="mb-24">
                    <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1] font-neueHaas max-w-4xl">
                        Made for
                        <span className="ml-4">
                            <Typewriter words={["Art directors.", "Storytellers.", "Agencies.", "Designers."]} />
                        </span>
                        <br />
                        Built for Storytellers.
                    </h2>
                </div>

                {/* Columns Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-32">

                    {/* Newsletter (Left - spans 4 cols) */}
                    <div className="md:col-span-5">
                        <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 ${subTextColor} font-iki`}>Newsletter</h4>
                        <div className={`flex items-center p-1 rounded-full ${inputBg} max-w-md`}>
                            <input
                                type="email"
                                placeholder="ENTER YOUR EMAIL ADDRESS"
                                className={`flex-1 bg-transparent px-6 py-3 text-xs md:text-sm outline-none placeholder-gray-400 ${textColor} uppercase tracking-wider font-iki`}
                            />
                            <button className="bg-white text-black px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors shadow-sm">
                                Subscribe
                            </button>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="md:col-span-3"></div>

                    {/* Company (Middle - spans 2 cols) */}
                    <div className="md:col-span-2">
                        <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 ${subTextColor} font-iki`}>Company</h4>
                        <ul className="space-y-2">
                            {['App.trace', 'Pricing', 'Blog', 'Privacy Policy', 'Terms & Conditions'].map((item) => (
                                <li key={item}>
                                    <a href="#" className={`text-lg md:text-xl font-medium hover:opacity-70 transition-opacity font-neueHaas`}>{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social (Right - spans 2 cols) */}
                    <div className="md:col-span-2">
                        <h4 className={`text-xs font-bold uppercase tracking-widest mb-6 ${subTextColor} font-iki`}>Social</h4>
                        <ul className="space-y-2">
                            {['Instagram', 'X', 'LinkedIn', 'TikTok'].map((item) => (
                                <li key={item}>
                                    <a href="#" className={`text-lg md:text-xl font-medium hover:opacity-70 transition-opacity font-neueHaas`}>{item}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer Info */}
                <div className="flex justify-between items-end mb-4">
                    <p className={`text-xs uppercase tracking-widest ${subTextColor} font-iki`}>
                        © TRACE, ALL RIGHTS RESERVED, 2025
                    </p>
                </div>
            </div>

            {/* Massive Logo at Bottom */}
            <div className="w-full overflow-hidden leading-none flex justify-center pointer-events-none select-none">
                <h1 className="text-[42vw] font-bold tracking-tighter leading-[0.8] font-neueHaas translate-y-[5%]">
                    Trace
                </h1>
            </div>

            {/* Awwwards Ribbon (Fixed/Absolute) */}
            <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden md:block">
            </div>
        </section>
    );
};

export default Footer;
