import React, { useRef, useMemo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// --- VISUALIZATIONS ---

// 1. Capture: Background Recording (Renamed from Discovery)
const CaptureVisual = ({ isSamba }) => {
    return (
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-black/5 dark:bg-black/50">
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(${isSamba ? '#000' : '#fff'} 1px, transparent 1px), linear-gradient(90deg, ${isSamba ? '#000' : '#fff'} 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}
            />
            {/* Scanning Line */}
            <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className={`absolute left-0 right-0 h-px box-shadow-lg z-10 ${isSamba ? 'bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)]' : 'bg-[#FF3B30] shadow-[0_0_15px_#FF3B30]'}`}
            />

            {/* Data Points */}
            <div className="grid grid-cols-2 gap-8 relative z-0">
                {['Video', 'Audio', 'Clicks', 'Scrolls'].map((label, i) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0.3, scale: 0.8 }}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                        transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border ${isSamba ? 'border-black/10 bg-white/50' : 'border-white/10 bg-white/5'}`}
                    >
                        <div className={`w-2 h-2 rounded-full mb-2 ${isSamba ? 'bg-black' : 'bg-[#FF3B30]'}`} />
                        <span className={`text-xs font-mono uppercase tracking-widest ${isSamba ? 'text-black' : 'text-white'}`}>{label}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// 2. Transcribe: AI Processing (Renamed from Engineering)
const TranscribeVisual = ({ isSamba }) => {
    const [code, setCode] = useState('');
    const fullCode = `Analyzing video...
Extracting audio...
Generating steps...
[1] Click 'Login'
[2] Type credentials
[3] Navigate to Dashboard
Done.`;

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setCode(fullCode.slice(0, i));
            i = (i + 1) % (fullCode.length + 20); // Loop with pause
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`w-full h-full p-8 font-mono text-xs md:text-sm overflow-hidden flex items-center
            ${isSamba ? 'bg-gray-50 text-gray-800' : 'bg-[#111] text-green-400'}`}>
            <pre className="relative z-10 whitespace-pre-wrap">
                <code>{code}</code>
                <span className="animate-pulse">_</span>
            </pre>
        </div>
    );
};

// 3. Refine: UI Editing (Renamed from Design)
const RefineVisual = ({ isSamba }) => {
    return (
        <div className="w-full h-full flex items-center justify-center relative bg-gradient-to-br from-transparent to-black/5">
            {/* Background Circle */}
            <div className={`absolute w-48 h-48 rounded-full blur-[80px] opacity-20 ${isSamba ? 'bg-blue-400' : 'bg-purple-500'}`} />

            {/* Cards */}
            <div className="relative w-64 h-40">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ y: 0, x: 0 }}
                        animate={{
                            y: [0, -10, 0],
                            x: [0, i === 0 ? -5 : i === 2 ? 5 : 0, 0]
                        }}
                        transition={{
                            duration: 4,
                            delay: i * 0.8,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        style={{
                            zIndex: 3 - i,
                            top: i * 15,
                            left: i * 15,
                        }}
                        className={`absolute inset-0 rounded-xl border backdrop-blur-md shadow-xl flex flex-col p-3
                            ${isSamba
                                ? 'bg-white/80 border-black/5 shadow-black/5'
                                : 'bg-[#1a1a1a]/90 border-white/10 shadow-black/50'}`}
                    >
                        {/* Mock UI */}
                        <div className={`w-8 h-8 rounded-full mb-2 ${isSamba ? 'bg-gray-200' : 'bg-white/10'}`} />
                        <div className={`w-3/4 h-2 rounded-full mb-2 ${isSamba ? 'bg-gray-200' : 'bg-white/10'}`} />
                        <div className={`w-1/2 h-2 rounded-full ${isSamba ? 'bg-gray-200' : 'bg-white/10'}`} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

// 4. Publish: Export (Renamed from Deployment)
const PublishVisual = ({ isSamba }) => {
    return (
        <div className="w-full h-full flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-32 h-32 md:w-40 md:h-40 rotate-[-90deg]">
                <circle cx="50" cy="50" r="45" fill="none" strokeWidth="6"
                    stroke={isSamba ? "#eee" : "#333"}
                />
                <motion.circle
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="50" cy="50" r="45" fill="none" strokeWidth="6"
                    stroke={isSamba ? "#000" : "#fff"}
                    strokeLinecap="round"
                    strokeDasharray="1"
                    pathLength="1"
                />
            </svg>
            <div className={`absolute inset-0 flex flex-col items-center justify-center`}>
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className={`text-3xl md:text-4xl font-bold font-neueHaas ${isSamba ? 'text-black' : 'text-white'}`}
                >
                    Ready
                </motion.span>
                <span className={`text-[10px] uppercase tracking-wider mt-1 ${isSamba ? 'text-gray-500' : 'text-gray-500'}`}>Export Complete</span>
            </div>
        </div>
    );
};


// --- Ruler Line Component ---
const RulerLine = ({ index, totalLines, scrollYProgress, isSamba }) => {
    const position = index / totalLines;
    const range = [position - 0.04, position, position + 0.04];

    // Width: Base 12px -> Peak 48px
    const width = useTransform(scrollYProgress, range, [12, 48, 12], { clamp: true });

    // Color: Base (Visible Grey) -> Active (Red) -> Base (Visible Grey)
    const baseColor = isSamba ? '#D4D4D8' : '#52525B';
    const activeColor = '#FF3B30';

    const backgroundColor = useTransform(
        scrollYProgress,
        range,
        [baseColor, activeColor, baseColor],
        { clamp: true }
    );

    return (
        <motion.div
            className="rounded-e-full origin-left flex-shrink-0"
            style={{
                width,
                height: 1,
                backgroundColor
            }}
        />
    );
};

// --- DATA ---
const STEPS = [
    {
        id: "Capture",
        title: "Record Workflow",
        subtitle: "Input",
        description: "Simply record your screen as you work. SkyDocs runs silently in the background, capturing every click, scroll, and interaction with pixel-perfect precision.",
        Visual: CaptureVisual
    },
    {
        id: "Transcribe",
        title: "AI Processing",
        subtitle: "Analyze",
        description: "Our advanced AI instantly analyzes the footage, transcribing audio and generating step-by-step guides, identifying key actions automatically.",
        Visual: TranscribeVisual
    },
    {
        id: "Refine",
        title: "Polished Editing",
        subtitle: "Refine",
        description: "Fine-tune your documentation with our intuitive editor. Add annotations, cuts, and voiceovers to create the perfect guide.",
        Visual: RefineVisual
    },
    {
        id: "Publish",
        title: "Instant Export",
        subtitle: "Output",
        description: "Export as a polished 4K video or a beautifully formatted article. Ready to share with your team or customers in seconds.",
        Visual: PublishVisual
    }
];

// --- Main Process Component ---
const Process = ({ currentTheme }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const isSamba = currentTheme === 'SAMBA';
    // Theme Colors
    const theme = {
        bg: isSamba ? 'bg-white' : 'bg-[#0a0a0a]',
        text: isSamba ? 'text-black' : 'text-white',
        textMuted: isSamba ? 'text-gray-500' : 'text-zinc-500',
        ruler: isSamba ? 'text-black/10' : 'text-white/10', // Using currentColor in child
        rulerActive: isSamba ? '#000' : '#fff',
        tag: isSamba ? 'bg-black text-white' : 'bg-white text-black',
        border: isSamba ? 'border-gray-200' : 'border-white/10'
    };

    // Ruler Lines
    const lineCount = 60;
    const lines = useMemo(() => Array.from({ length: lineCount }), []);

    return (
        <section
            ref={containerRef}
            className={`relative ${theme.bg} ${theme.text} font-sans transition-colors duration-700 ease-in-out`}
        >
            <div className="flex relative">

                {/* --- Left Column: Physics Ruler --- */}
                <div className="hidden md:flex w-[20%] lg:w-[15%] relative z-20 flex-col items-end border-r border-dashed"
                    style={{ borderColor: isSamba ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}>

                    <div className="sticky top-0 h-screen flex flex-col justify-center py-20 pr-0 border-r-0">
                        {/* Ruler Container */}
                        <div className="flex flex-col items-end gap-3">
                            {lines.map((_, i) => (
                                <RulerLine
                                    key={i}
                                    index={i}
                                    totalLines={lineCount}
                                    scrollYProgress={scrollYProgress}
                                    isSamba={isSamba}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- Right Column: Content --- */}
                <div className="w-full md:w-[80%] lg:w-[85%] pb-32">

                    {/* Section Header */}
                    <div className="min-h-[60vh] flex flex-col justify-end px-6 md:px-20 lg:px-32 mb-20">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className={`font-iki text-xs uppercase tracking-widest mb-6 block ${theme.textMuted}`}
                        >
                            // The Methodology
                        </motion.span>
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter font-neueHaas leading-[0.9]">
                            Precision in <br />
                            <span className={theme.textMuted}>Every Step.</span>
                        </h2>
                    </div>

                    {/* Steps Feed */}
                    <div className="flex flex-col">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="min-h-[90vh] flex flex-col justify-center px-6 md:px-20 lg:px-32 border-b border-dashed last:border-0"
                                style={{ borderColor: isSamba ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                                    {/* Text Content */}
                                    <div className="order-2 lg:order-1 max-w-lg">
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className={`font-iki text-xs uppercase px-2 py-1 rounded border ${theme.textMuted} ${isSamba ? 'border-black/10' : 'border-white/10'}`}>
                                                0{index + 1}
                                            </span>
                                            <span className={`font-iki text-sm uppercase tracking-wider ${theme.textMuted}`}>
                                                {step.subtitle}
                                            </span>
                                        </div>

                                        <h3 className="text-3xl md:text-4xl font-medium mb-6 font-neueHaas">
                                            {step.title}
                                        </h3>
                                        <p className={`text-lg md:text-xl leading-relaxed ${theme.textMuted}`}>
                                            {step.description}
                                        </p>

                                        {step.id === "Publish" && (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className={`mt-10 px-8 py-4 rounded-full text-sm font-bold uppercase tracking-widest transition-all
                                                    ${isSamba ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-200'}`}
                                            >
                                                Start Project &rarr;
                                            </motion.button>
                                        )}
                                    </div>

                                    {/* Dynamic Visualization */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.8 }}
                                        className="order-1 lg:order-2 w-full aspect-square md:aspect-video lg:aspect-square bg-white/5 rounded-2xl overflow-hidden relative border"
                                        style={{ borderColor: isSamba ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}
                                    >
                                        <step.Visual isSamba={isSamba} />
                                    </motion.div>

                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Process;
