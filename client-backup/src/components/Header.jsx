import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import useThemeStore from '../store/themeStore';

const Header = () => {
    const { currentTheme, setCurrentTheme } = useThemeStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

    const themes = ["SAMBA", "NOIR", "PSYCHOLOGICAL", "GIALLO", "SCI-FI"];
    const isNoir = currentTheme === "NOIR";

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    // Dynamic Classes based on Theme
    const textColor = isNoir ? "text-white" : "text-black";
    const borderColor = isNoir ? "border-white" : "border-black";
    const dropdownBg = isNoir ? "bg-[#1a1a1a]/90 border-white/20" : "bg-[#F5F5F3]/80 border-white/20";
    const dropdownText = isNoir ? "text-white" : "text-black";
    const separatorColor = isNoir ? "border-white/20" : "border-black";
    const checkBg = isNoir ? "bg-white text-black" : "bg-black text-white";

    return (
        <header className={`fixed top-0 left-0 w-full z-50 py-5 px-8 md:px-12 transition-all duration-300 ${isScrolled ? `backdrop-blur-lg ${isNoir ? 'bg-black/10' : 'bg-white/10'} shadow-sm` : 'bg-transparent'}`}>
            <div className="w-full max-w-[1800px] mx-auto flex items-center justify-between">

                {/* Left Side: HOME / PRICING */}
                <div className={`flex items-center gap-12 text-sm md:text-base font-iki tracking-wide font-regular ${textColor}`}>
                    <a href="/" className="flex items-center hover:opacity-100 transition-opacity">
                        {isActive('/') && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mr-2 ${isNoir ? 'text-white' : 'text-[#467A53]'}`}>
                                <path d="M3 21V3L21 12L3 21Z" fill="currentColor" />
                            </svg>
                        )}
                        <span className={isActive('/') ? "opacity-100" : "opacity-60 hover:opacity-100"}>HOME</span>
                    </a>
                    <a href="#" className="flex items-center hover:opacity-100 transition-opacity uppercase">
                        {isActive('/pricing') && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mr-2 ${isNoir ? 'text-white' : 'text-[#467A53]'}`}>
                                <path d="M3 21V3L21 12L3 21Z" fill="currentColor" />
                            </svg>
                        )}
                        <span className={isActive('/pricing') ? "opacity-100" : "opacity-60 hover:opacity-100"}>Pricing</span>
                    </a>
                </div>

                {/* Right Side: LOG-IN / SIGN-UP / Status */}
                <div className={`flex items-center gap-8 text-sm md:text-base font-iki font-regular tracking-wide ${textColor}`}>
                    <button
                        onClick={() => navigate('/login')}
                        className="hover:opacity-60 transition-opacity uppercase"
                    >
                        Log-in
                    </button>

                    <button
                        onClick={() => navigate('/login')}
                        className={`${isNoir ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'} px-3 py-0 rounded-[4px] transition-colors uppercase`}
                    >
                        Sign-up
                    </button>

                    {/* Theme Toggle Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-10 h-10 rounded-md flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors`}
                        >
                            <div className="w-3.5 h-3.5 rounded-full bg-[#1A4D2E] shadow-sm ring-1 ring-inset ring-black/10"></div>
                        </button>

                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className={`absolute right-0 top-full mt-4 w-64 backdrop-blur-xl border shadow-2xl rounded-sm overflow-hidden z-[60] ${dropdownBg}`}
                                >
                                    <div className="p-4">
                                        <h3 className={`text-xs font-bold tracking-widest mb-3 uppercase p-1 ${isNoir ? 'text-gray-400' : 'text-black'}`}>Theme</h3>
                                        <ul className="space-y-0">
                                            {themes.map((theme, index) => (
                                                <li key={theme}>
                                                    <button
                                                        onClick={() => {
                                                            setCurrentTheme(theme);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`w-full flex items-center justify-between text-left py-2.5 border-b group hover:pl-2 transition-all duration-200 ${separatorColor}`}
                                                    >
                                                        <span className={`font-mono text-sm tracking-wider font-medium uppercase ${dropdownText}`}>{theme}</span>
                                                        {currentTheme === theme && (
                                                            <div className={`${checkBg} rounded-full p-0.5 scale-75`}>
                                                                <Check size={12} strokeWidth={4} />
                                                            </div>
                                                        )}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
