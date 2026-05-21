import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Box, Zap, Video, Type, Image as ImageIcon, ArrowUpRight, MousePointer2, DownloadCloud } from 'lucide-react';

// --- Animated Component 1: Model Agnostic (Icon Swap) ---
const AnimModelAgnostic = ({ isNoir }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Central Hub */}
            <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center z-10 ${isNoir ? 'bg-white/10 border border-white/20' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-2xl border border-dashed border-gray-400/30"
                />
                <Sparkles className={isNoir ? 'text-blue-400' : 'text-blue-600'} size={24} />
            </div>

            {/* Orbiting Models */}
            {[
                { Icon: MessageSquare, color: 'text-orange-500', delay: 0 },
                { Icon: Zap, color: 'text-yellow-500', delay: 2 },
                { Icon: Box, color: 'text-green-500', delay: 4 },
            ].map((item, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-10 h-10 rounded-xl flex items-center justify-center ${isNoir ? 'bg-[#1e1e1e] border border-white/10' : 'bg-white border border-gray-100 shadow-sm'}`}
                    animate={{
                        x: [60, 0, -60, 0, 60],
                        y: [0, 60, 0, -60, 0],
                        scale: [0.8, 1, 0.8, 0.6, 0.8],
                        opacity: [0.5, 1, 0.5, 0.3, 0.5],
                        zIndex: [0, 20, 0, -10, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: item.delay
                    }}
                >
                    <item.Icon className={item.color} size={18} />
                </motion.div>
            ))}
        </div>
    );
};

// --- Animated Component 2: Infinite Canvas (Cursor Drag) ---
const AnimInfiniteCanvas = ({ isNoir }) => {
    return (
        <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
            {/* Grid Background (Mini) */}
            <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: `radial-gradient(${isNoir ? '#fff' : '#000'} 1px, transparent 1px)`, backgroundSize: '20px 20px' }}
            />

            {/* Draggable Node Simulation */}
            <motion.div
                className={`w-32 h-20 rounded-lg flex flex-col p-2 gap-2 relative z-10 ${isNoir ? 'bg-[#1e1e1e] border border-white/10' : 'bg-white border border-gray-200 shadow-md'}`}
                animate={{ x: [-40, 40, -40], y: [-20, 20, -20] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <div className="w-full h-2 bg-gray-200/20 rounded-full" />
                <div className="w-2/3 h-2 bg-gray-200/20 rounded-full" />

                {/* Cursor Attached */}
                <motion.div
                    className="absolute -bottom-4 -right-4"
                    animate={{ x: [0, 5, 0], y: [0, 5, 0] }} // Subtle micro-movement
                >
                    <MousePointer2 className="text-purple-500 fill-purple-500" size={20} />
                    <div className="absolute left-4 top-4 bg-purple-500 text-white text-[9px] px-1.5 rounded-sm font-bold whitespace-nowrap">
                        User 1
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

// --- Animated Component 3: Multi-Modal Native (4 Icons row) ---
const AnimMultiModal = ({ isNoir }) => {
    const icons = [Type, ImageIcon, Video, Box];
    const colors = ['text-gray-400', 'text-pink-500', 'text-blue-500', 'text-green-500'];

    return (
        <div className="relative w-full h-full flex items-center justify-center gap-3 px-4 pt-4">
            {icons.map((Icon, i) => (
                <motion.div
                    key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border ${isNoir ? 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border-white/10' : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'}`}
                >
                    <Icon className={colors[i]} size={24} />
                </motion.div>
            ))}
        </div>
    );
};

// --- Animated Component 4: Intelligent Flow (Chat UI) ---
const AnimChatUI = ({ isNoir }) => {
    return (
        <div className="relative w-full h-full flex items-end justify-center px-6 pt-4 pb-0">
            <div className={`w-full h-full max-h-[160px] rounded-t-2xl border-t border-l border-r p-4 flex flex-col gap-3 relative overflow-hidden shadow-2xl ${isNoir ? 'bg-[#1a1a1a] border-white/10' : 'bg-white border-gray-200'}`}>
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${isNoir ? 'bg-white/10 text-white' : 'bg-gray-100 text-black'}`}>TR</div>
                    <span className={`text-xs font-semibold ${isNoir ? 'text-white' : 'text-gray-900'}`}>Trace Assistant</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isNoir ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>BOT</span>
                </div>
                {/* Chat Bubble */}
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', repeatDelay: 3 }}
                    className={`p-3 rounded-xl rounded-tl-none border w-[85%] ${isNoir ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-50 border-gray-100 text-gray-600'} text-xs`}
                >
                    Pipeline generated. Waiting for your confirmation to execute. ✨
                </motion.div>
                {/* Input box */}
                <div className={`absolute bottom-0 left-0 w-full p-3 border-t backdrop-blur-md flex items-center ${isNoir ? 'border-white/10 bg-[#1a1a1a]/80' : 'border-gray-100 bg-white/80'}`}>
                    <div className={`w-full h-8 rounded-lg flex items-center px-3 text-[10px] ${isNoir ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                        Message Trace...
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- Animated Component 5: Asset Library (Tall Document) ---
const AnimAssetLibrary = ({ isNoir }) => {
    return (
        <div className="relative w-full h-full flex items-end justify-center p-6 pt-0">
             {/* Large File Representation */}
             <div className={`w-full max-w-[180px] h-full max-h-[260px] rounded-t-2xl relative flex flex-col p-5 shadow-xl overflow-hidden ${isNoir ? 'bg-white/5 border-t border-l border-r border-white/10' : 'bg-white border-t border-l border-r border-gray-200'}`}>
                 <div className="flex gap-1.5 mb-6">
                     <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                     <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                     <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                 </div>
                 <div className="flex flex-col gap-4 opacity-50">
                     <div className="w-3/4 h-2.5 bg-current rounded-full" />
                     <div className="w-1/2 h-2.5 bg-current rounded-full" />
                     <div className="w-full h-2.5 bg-current rounded-full" />
                     <div className="w-5/6 h-2.5 bg-current rounded-full" />
                     <div className="w-2/3 h-2.5 bg-current rounded-full" />
                 </div>
                 
                 {/* Floating Button */}
                 <motion.div 
                     animate={{ y: [-5, 5, -5] }}
                     transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                     className={`absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-xl flex items-center gap-2 backdrop-blur-md shadow-lg border whitespace-nowrap ${isNoir ? 'bg-white/10 border-white/20 text-white' : 'bg-white/80 border-gray-200 text-black'}`}
                 >
                     <span className="text-xs font-semibold">Save Asset</span>
                     <DownloadCloud size={14} />
                 </motion.div>
             </div>
        </div>
    );
};


// --- Main Section Component ---

interface FeatureCardProps {
    title: string;
    desc?: string;
    isNoir: boolean;
    className?: string;
    children?: React.ReactNode;
}

const FeatureCard = ({ title, desc, isNoir, className, children }: FeatureCardProps) => (
    <div className={`group relative flex flex-col w-full h-full ${className}`}>
        
        {/* Soft Hover Glow Behind Card */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0">
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-purple-500/30 blur-[50px] rounded-full" />
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-pink-500/30 blur-[50px] rounded-full" />
        </div>

        <div className={`relative z-10 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col w-full h-full ${isNoir ? 'bg-[#171717] border border-white/5 group-hover:border-white/10' : 'bg-white border border-gray-100 shadow-[0_2px_20px_rgb(0,0,0,0.02)] group-hover:shadow-lg'}`}>
            {/* Header */}
            <div className="px-6 pt-6 pb-2 relative z-10">
                <h3 className={`text-2xl font-helveticaNow font-semibold mb-2 ${isNoir ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                {desc && <p className={`text-sm leading-relaxed ${isNoir ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>}
            </div>

            {/* Animation Container */}
            {children && (
                <div className="mt-auto flex-1 w-full relative overflow-hidden flex flex-col min-h-[120px]">
                    <div className={`absolute inset-0 ${isNoir ? 'bg-[#171717]' : 'bg-gradient-to-t from-gray-50/80 to-transparent'} z-0`} />
                    <div className="relative z-10 flex-1 flex flex-col w-full h-full">
                        {children}
                    </div>
                </div>
            )}
        </div>
    </div>
);

const Features = ({ currentTheme }) => {
    const isNoir = currentTheme === 'NOIR';

    return (
        <section className={`py-24 px-4 sm:px-6 lg:px-8 font-sans ${isNoir ? 'bg-[#0A0A0A]' : 'bg-[#FAFAFA]'}`}>
            <div className="max-w-[1400px] mx-auto">

                {/* Section Header */}
                <div className="mb-16 flex flex-col items-center text-center">
                    <div className="inline-block mb-2">
                        <span className="text-[13px] font-tgfrekuent tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 uppercase">
                            [ Trace v1.0 ]
                        </span>
                    </div>
                    <div className="flex flex-col items-center gap-6">
                        <h2 className={`text-4xl md:text-5xl font-helveticaNow font-medium tracking-tight ${isNoir ? 'text-white' : 'text-gray-900'}`}>
                            The canvas for <br /> your imagination.
                        </h2>
                        <button className={`px-6 py-3 rounded-full font-iki font-medium text-sm flex items-center gap-2 transition-all ${isNoir ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                            START CREATING <ArrowUpRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Grid Container
                    12 columns. 4 rows. Base row height ~150px.
                    Total height on desktop = 150 * 4 + (3 * 20) gap = 660px
                */}
                <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-4 gap-5 md:h-[760px] auto-rows-[400px] md:auto-rows-auto">

                    {/* Top Left: Model Agnostic (Span 2 rows) */}
                    <FeatureCard
                        title="Model Agnostic"
                        desc="Bring your own brains. Orchestrate Gemini, Claude, and open models in one unified view."
                        isNoir={isNoir}
                        className="md:col-span-4 md:col-start-1 md:row-start-1 md:row-span-2"
                    >
                        <AnimModelAgnostic isNoir={isNoir} />
                    </FeatureCard>

                    {/* Top Middle: Intelligent Flow (Chat UI) (Span 2 rows) */}
                    <FeatureCard
                        title="Intelligent Flow"
                        desc="Context aware connections. Pass outputs from one node as inputs automatically."
                        isNoir={isNoir}
                        className="md:col-span-5 md:col-start-5 md:row-start-1 md:row-span-2"
                    >
                        <AnimChatUI isNoir={isNoir} />
                    </FeatureCard>

                    {/* Top Right: Team Collaboration (Short, Span 1 row) */}
                    <FeatureCard
                        title="Team Sync"
                        desc="Work together in real-time. Share workspaces natively."
                        isNoir={isNoir}
                        className="md:col-span-3 md:col-start-10 md:row-start-1 md:row-span-1 !justify-center"
                    />
                    

                    {/* Bottom Right: Asset Library (Tall, Span 3 rows) */}
                    <FeatureCard
                        title="Asset Library"
                        desc="Instantly save, organize, and retrieve your generated assets."
                        isNoir={isNoir}
                        className="md:col-span-3 md:col-start-10 md:row-start-2 md:row-span-3"
                    >
                        <AnimAssetLibrary isNoir={isNoir} />
                    </FeatureCard>

                    {/* Bottom Left: Infinite Canvas (Span 2 rows) */}
                    <FeatureCard
                        title="Infinite Canvas"
                        desc="Think outside the box. A limitless workspace to organize references."
                        isNoir={isNoir}
                        className="md:col-span-5 md:col-start-1 md:row-start-3 md:row-span-2"
                    >
                        <AnimInfiniteCanvas isNoir={isNoir} />
                    </FeatureCard>

                    {/* Bottom Middle: Multi-Modal Native (4 Icons) (Span 2 rows) */}
                    <FeatureCard
                        title="Multi-Modal Native"
                        desc="Fluent in every format. Transition from text to images, videos, and 3D assets."
                        isNoir={isNoir}
                        className="md:col-span-4 md:col-start-6 md:row-start-3 md:row-span-2"
                    >
                        <AnimMultiModal isNoir={isNoir} />
                    </FeatureCard>

                </div>
            </div>
        </section>
    );
};

export default Features;
