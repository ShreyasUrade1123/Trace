import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Box, Zap, Video, Type, Image as ImageIcon, ArrowUpRight, MousePointer2 } from 'lucide-react';

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

// --- Animated Component 3: Multi-Modal (Morph) ---
const AnimMultiModal = ({ isNoir }) => {
    const icons = [Type, ImageIcon, Video, Box];
    const colors = ['text-gray-400', 'text-pink-500', 'text-blue-500', 'text-green-500'];

    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % icons.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const CurrentIcon = icons[index];
    const currentColor = colors[index];

    return (
        <div className="relative w-full h-full flex items-center justify-center gap-4">
            {/* Timeline / Progress */}
            <div className="flex gap-2">
                {icons.map((Icon, i) => (
                    <div
                        key={i}
                        className={`transition-all duration-500 ${i === index ? 'scale-110 opacity-100' : 'opacity-30 scale-90'}`}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isNoir ? 'bg-white/5' : 'bg-gray-50 border border-gray-100'}`}>
                            <Icon className={i === index ? currentColor : (isNoir ? 'text-gray-600' : 'text-gray-400')} size={20} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Animated Component 4: Intelligent Flow (Particles) ---
const AnimIntelligentFlow = ({ isNoir }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center gap-12">
            {/* Source Node */}
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center z-10 ${isNoir ? 'bg-[#1e1e1e] border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <Type size={20} className="text-gray-400" />
            </div>

            {/* Target Node */}
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center z-10 ${isNoir ? 'bg-[#1e1e1e] border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <ImageIcon size={20} className="text-blue-500" />
            </div>

            {/* Connection Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                    d="M 100 80 L 220 80" // Simple straight line geometry based on container assumption
                    stroke={isNoir ? '#444' : '#e2e8f0'}
                    strokeWidth="2"
                    fill="none"
                />
                {/* Moving Particle */}
                <circle r="3" fill={isNoir ? '#fff' : '#3b82f6'}>
                    <animateMotion
                        dur="1.5s"
                        repeatCount="indefinite"
                        path="M 120 80 L 200 80"
                        keyPoints="0;1"
                        keyTimes="0;1"
                        calcMode="linear"
                    />
                </circle>
            </svg>
            {/* Note: SVG path coordinates are tricky in relative localized components without viewBox. 
                 Using simpler absolutely positioned particle simulation for robustness below.
             */}
        </div>
    );
};

// Re-writing simple particle flow without fragile SVG coordinates
const AnimIntelligentFlowSimple = ({ isNoir }) => {
    return (
        <div className="relative w-full h-full flex items-center justify-center gap-16">
            <div className={`w-16 h-20 rounded-lg z-10 flex flex-col gap-2 p-2 ${isNoir ? 'bg-[#1e1e1e] border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <div className="w-full h-2 bg-gray-500/20 rounded" />
                <div className="w-8 h-8 self-center bg-gray-500/10 rounded flex items-center justify-center">
                    <Type size={14} className="text-gray-400" />
                </div>
            </div>

            {/* Particle Stream */}
            <div className="absolute left-[38%] right-[38%] h-[2px] bg-gray-500/20 overflow-hidden">
                <motion.div
                    className={`w-8 h-full rounded-full ${isNoir ? 'bg-white' : 'bg-blue-500'}`}
                    animate={{ x: ['-100%', '400%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
            </div>

            <div className={`w-16 h-20 rounded-lg z-10 flex flex-col gap-2 p-2 ${isNoir ? 'bg-[#1e1e1e] border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
                <div className="w-full h-2 bg-blue-500/20 rounded" />
                <div className="w-full flex-1 bg-blue-500/10 rounded flex items-center justify-center">
                    <Video size={14} className="text-blue-500" />
                </div>
            </div>
        </div>
    );
}


// --- Main Section Component ---

const FeatureCard = ({ title, desc, tag, color, isNoir, children }) => (
    <div className={`group relative rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-[320px] ${isNoir ? 'bg-[#121212]/50 border border-white/5 hover:border-white/10' : 'bg-white border border-gray-100 shadow-[0_2px_20px_rgb(0,0,0,0.02)] hover:shadow-lg'}`}>

        {/* Header */}
        <div className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-3">
                <span className={`text-[10px] font-iki font-bold tracking-[0.2em] uppercase ${color}`}>
                    [{tag}]
                </span>
                <ArrowUpRight size={16} className={`transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 ${isNoir ? 'text-gray-600 group-hover:text-white' : 'text-gray-300 group-hover:text-black'}`} />
            </div>
            <h3 className={`text-xl font-neueHaas font-semibold mb-2 ${isNoir ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
            <p className={`text-sm leading-relaxed ${isNoir ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
        </div>

        {/* Animation Container */}
        <div className="mt-auto h-[160px] w-full relative overflow-hidden">
            <div className={`absolute inset-0 ${isNoir ? 'bg-gradient-to-t from-black/20' : 'bg-gradient-to-t from-gray-50/50'}`} />
            {children}
        </div>
    </div>
);

const Features = ({ currentTheme }) => {
    const isNoir = currentTheme === 'NOIR';

    return (
        <section className={`py-24 px-4 sm:px-6 lg:px-8 font-sans ${isNoir ? 'bg-[#0F0F12]' : 'bg-white'}`}>
            <div className="max-w-6xl mx-auto">

                {/* Section Header */}
                <div className="mb-16">
                    <div className="inline-block mb-4">
                        <span className="text-[13px] font-iki tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 uppercase">
                            [ Trace v1.0 ]
                        </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <h2 className={`text-4xl md:text-5xl font-neueHaas font-medium tracking-tight ${isNoir ? 'text-white' : 'text-gray-900'}`}>
                            The canvas for <br /> your imagination.
                        </h2>
                        <button className={`px-6 py-3 rounded-full font-iki font-medium text-sm flex items-center gap-2 transition-all ${isNoir ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                            START CREATING <ArrowUpRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <FeatureCard
                        title="Model Agnostic"
                        desc="Bring your own brains. Orchestrate Gemini, Claude, and open-source models in one unified view."
                        tag="AGNOSTIC"
                        color="text-orange-500"
                        isNoir={isNoir}
                    >
                        <AnimModelAgnostic isNoir={isNoir} />
                    </FeatureCard>

                    <FeatureCard
                        title="Infinite Canvas"
                        desc="Think outside the box. A limitless workspace to organize references, prompts, and generations."
                        tag="CANVAS"
                        color="text-purple-500"
                        isNoir={isNoir}
                    >
                        <AnimInfiniteCanvas isNoir={isNoir} />
                    </FeatureCard>

                    <FeatureCard
                        title="Multi-Modal Native"
                        desc="Fluent in every format. Seamlessly transition from text prompts to images, videos, and 3D assets."
                        tag="MULTI-MODAL"
                        color="text-pink-500"
                        isNoir={isNoir}
                    >
                        <AnimMultiModal isNoir={isNoir} />
                    </FeatureCard>

                    <FeatureCard
                        title="Intelligent Flow"
                        desc="Context aware connections. Pass outputs from one node as inputs to the next automatically."
                        tag="SMART FLOW"
                        color="text-blue-500"
                        isNoir={isNoir}
                    >
                        <AnimIntelligentFlowSimple isNoir={isNoir} />
                    </FeatureCard>

                </div>
            </div>
        </section>
    );
};

export default Features;
