import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { Command } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import gsap from 'gsap';

// --- content definitions ---
const heroContent = [
    {
        text: "Reflections on the water",
        images: [
            // Slot 1: Far Left (Landscape) -> Moved down
            { src: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=400&auto=format&fit=crop", className: "absolute left-[3%] top-[45%] w-64 h-64 rounded-2xl object-cover overflow-hidden" },
            // Slot 2: Top Left (Square) -> Moved down
            { src: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=400&q=80", className: "absolute left-[18%] top-[20%] w-48 h-48 rounded-xl object-cover overflow-hidden" },
            // Slot 4: Top Center (Main) -> Moved down
            { src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=600&q=80", className: "absolute left-[48%] top-[26%] w-72 h-64 rounded-2xl object-cover overflow-hidden" },
            // Slot 6: Far Right (Tall) -> Moved down
            { src: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=400&q=80", className: "absolute right-[-2%] top-[40%] w-72 h-[32rem] rounded-l-3xl object-cover overflow-hidden" },
            // Slot 7: Bottom Left (Large) -> Adjusted
            { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80", className: "absolute left-[6%] top-[85%] w-80 h-96 rounded-t-3xl object-cover overflow-hidden" },
            // Slot 8: Bottom Right (Square) -> Adjusted
            { src: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=500&q=80", className: "absolute right-[18%] top-[78%] w-72 h-72 rounded-t-3xl object-cover overflow-hidden" }
        ]
    },
    {
        text: "Quiet Place",
        images: [
            // Slot 1
            { src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80", className: "absolute left-[0%] top-[60%] w-64 h-40 rounded-2xl object-cover overflow-hidden" },
            // Slot 2
            { src: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=400&q=80", className: "absolute left-[18%] top-[35%] w-48 h-48 rounded-xl object-cover overflow-hidden" },
            // Slot 3: Center Left (Tiny) -> Moved down
            { src: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?auto=format&fit=crop&w=300&q=80", className: "absolute left-[33%] top-[58%] w-24 h-24 rounded-lg object-cover overflow-hidden" },
            // Slot 4
            { src: "https://images.unsplash.com/photo-1499750310159-5b5f336a6133?auto=format&fit=crop&w=600&q=80", className: "absolute left-[48%] top-[40%] w-96 h-64 rounded-2xl object-cover overflow-hidden" },
            // Slot 6
            { src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=400&q=80", className: "absolute right-[-2%] top-[40%] w-72 h-[32rem] rounded-l-3xl object-cover overflow-hidden" },
            // Slot 7
            { src: "https://images.unsplash.com/photo-1517604931442-71053e3e2c3c?auto=format&fit=crop&w=600&q=80", className: "absolute left-[5%] top-[85%] w-72 h-80 rounded-t-3xl object-cover overflow-hidden" },
            // Slot 8
            { src: "https://images.unsplash.com/photo-1542466500-dccb2789cbbb?auto=format&fit=crop&w=500&q=80", className: "absolute right-[24%] top-[78%] w-60 h-60 rounded-t-3xl object-cover overflow-hidden" }
        ]
    },
    {
        text: "Black and White Videos",
        images: [
            // Slot 1
            { src: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=400&q=80", className: "absolute left-[0%] top-[60%] w-64 h-40 rounded-2xl object-cover grayscale overflow-hidden" },
            // Slot 2
            { src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80", className: "absolute left-[18%] top-[28%] w-48 h-48 rounded-xl object-cover grayscale overflow-hidden" },
            // Slot 3
            { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=80", className: "absolute left-[33%] top-[58%] w-28 h-18 rounded-lg object-cover grayscale overflow-hidden" },
            // Slot 4
            { src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=600&q=80", className: "absolute left-[48%] top-[29%] w-72 h-64 rounded-2xl object-cover grayscale overflow-hidden" },
            // Slot 5: Center Right (Tiny) -> Moved down
            { src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=300&q=80", className: "absolute right-[23%] top-[55%] w-28 h-18 rounded-lg object-cover grayscale overflow-hidden" },
            // Slot 6
            { src: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=400&q=80", className: "absolute right-[-2%] top-[50%] w-72 h-96 rounded-l-3xl object-cover grayscale overflow-hidden" },
            // Slot 7
            { src: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?auto=format&fit=crop&w=600&q=80", className: "absolute left-[6%] top-[85%] w-80 h-96 rounded-t-3xl object-cover grayscale overflow-hidden" },
            // Slot 8
            { src: "https://images.unsplash.com/photo-1542466500-dccb2789cbbb?auto=format&fit=crop&w=500&q=80", className: "absolute right-[18%] top-[85%] w-64 h-72 rounded-t-3xl object-cover grayscale overflow-hidden" }
        ]
    }
];

const Hero = ({ onIntroComplete, currentTheme = "SAMBA" }) => {
    // Animation Sequence State: 'grid' -> 'white-enter' -> 'final'
    const [animationStage, setAnimationStage] = useState('grid');
    const [placeholder, setPlaceholder] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const imagesRef = useRef([]);

    const isNoir = currentTheme === "NOIR";

    // Mouse position for parallax effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    const handleMouseMove = (e) => {
        const { clientX, clientY, innerWidth, innerHeight } = e;
        mouseX.set((clientX / innerWidth) - 0.5);
        mouseY.set((clientY / innerHeight) - 0.5);
    };

    // GSAP Sequence
    useEffect(() => {
        if (animationStage !== 'final') return;

        let ctx = gsap.context(() => {
            const tl = gsap.timeline({ repeat: -1 });

            // Ensure initial state
            setPlaceholder("");
            gsap.set(imagesRef.current, { scale: 0, opacity: 0 });

            // REBUILD TIMELINE WITH NUMERIC TWEEN
            const masterTl = gsap.timeline({ repeat: -1 });

            heroContent.forEach((item, index) => {
                masterTl.call(() => setActiveIndex(index));

                // Type IN
                const proxy = { len: 0 };
                masterTl.to(proxy, {
                    len: item.text.length,
                    duration: 1.5,
                    ease: "none",
                    onUpdate: () => setPlaceholder(item.text.substring(0, Math.round(proxy.len)))
                });

                // Images Pop Out (Start slightly after typing starts)
                masterTl.to(`.image-group-${index} .parallax-target`, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "back.out(1.7)"
                }, "-=1.0");

                // Wait
                masterTl.to({}, { duration: 2 });

                // Images Pop In (Disappear)
                masterTl.to(`.image-group-${index} .parallax-target`, {
                    scale: 0,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    ease: "back.in(1.7)"
                });

                // Type OUT
                masterTl.to(proxy, {
                    len: 0,
                    duration: 1,
                    ease: "none",
                    onUpdate: () => setPlaceholder(item.text.substring(0, Math.round(proxy.len)))
                }, "<");
            });

            return () => masterTl.kill(); // Cleanup
        });

        return () => ctx.revert();
    }, [animationStage]); // Run once final stage is reached

    // ... (previous code)

    useEffect(() => {
        // Sequence Timings
        const startSequence = async () => {
            // 0.0s: Grid is visible (initial state)

            // 1.0s: White Background Appears (Stage 2)
            await new Promise(r => setTimeout(r, 1000));
            setAnimationStage('white-enter');

            // 2.5s: Zoom Out / Reveal (Stage 3)
            await new Promise(r => setTimeout(r, 1500));
            setAnimationStage('final');

            // Signal intro complete
            if (onIntroComplete) {
                setTimeout(() => onIntroComplete(), 800);
            }
        };

        startSequence();
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const headerVariants = {
        grid: { height: "100vh", opacity: 0, borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px" },
        'white-enter': { height: "100vh", opacity: 1, borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px" },
        final: { height: "auto", opacity: 1, borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
    };

    const logoVariants = {
        grid: { scale: 15, y: 0, x: 0, opacity: 0 },
        'white-enter': {
            scale: 2.4,
            y: "-25vh",
            x: "-2vw",
            opacity: 1,
            transition: { duration: 0.1, ease: [0.16, 1, 0.3, 1] }
        },
        final: {
            scale: 1,
            y: 0,
            x: 0,
            opacity: 1,
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.8 } }
    };

    return (
        <div className={`relative w-full min-h-screen transition-colors duration-500 ${isNoir ? 'bg-transparent text-white' : 'bg-transparent text-gray-900 selection:bg-black selection:text-white'} flex flex-col overflow-hidden`}>
            {/* ... (Top Section) ... */}
            <motion.div
                className={`relative z-30 w-full flex flex-col justify-end shadow-sm transition-colors duration-500 ${isNoir ? 'bg-[#141414]' : 'bg-white'}`}
                initial="grid"
                animate={animationStage}
                variants={headerVariants}
            >
                {/* ... */}
                <div className="w-full max-w-[1800px] mx-auto px-8 md:px-12 flex flex-col md:flex-row items-stretch gap-16 md:gap-96 pt-20 md:pt-26 pb-8 md:pb-12">
                    {/* ... (Logos & Text) ... */}
                    <div className="flex-1 flex items-start">
                        <motion.div variants={logoVariants} className="origin-top-left">
                            <h1 className="text-[13rem] md:text-[17rem] leading-[0.75] font-bold tracking-tighter -ml-2 select-none whitespace-nowrap">
                                Trace
                            </h1>
                        </motion.div>
                    </div>

                    <motion.div
                        className="flex-1 flex flex-col justify-between items-start"
                        variants={contentVariants}
                        initial="hidden"
                        animate={animationStage === 'final' ? "visible" : "hidden"}
                    >
                        {/* Top Text */}
                        <h2 className="text-3xl md:text-3.5xl font-neueHaas font-medium leading-[1.1] tracking-tight pt-6 md:pt-0">
                            The Creative Sidekick<br />
                            <RotatingText words={["Made for Designers.", "Made for Agencies.", "Made for Storytellers."]} />
                            <br />
                            Built for Storytellers.
                        </h2>
                        {/* Bottom Button */}
                        <button className={`group flex items-center gap-3 p-2 pr-5 rounded-xl cursor-pointer hover:scale-105 transition-all duration-300 ${isNoir ? 'bg-white text-black' : 'bg-black text-white'}`}>
                            {/* ... */}
                            <div className="w-12 h-12 bg-[#FCD34D] rounded-lg flex items-center justify-center overflow-hidden relative">
                                <img
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                                    alt="User"
                                    className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500 grayscale contrast-125"
                                />
                            </div>
                            <span className="font-ikicompressedlight text-xs md:text-sm tracking-wide relative">
                                <span>Start Creating</span>
                            </span>
                        </button>
                    </motion.div>
                </div>
            </motion.div>

            {/* --- BOTTOM SECTION: FLOATING IMAGES & GRID (Parallax) --- */}
            <div className="absolute inset-0 z-0 pt-[40vh]">
                {/* Grid is handled in LandingPage, but Hero has this overlay div? */}
                {/* The original code had a grid div here. In Noir mode, we might want it invisible or different */}
                {/* LandingPage adds a global grid. If we keep this, we get double grids. */}
                {/* Given the refactoring, let's make this transparent or remove it if LandingPage covers it. */}
                {/* LandingPage's grid covers the whole screen 'absolute inset-0'. Hero is z-10 on LandingPage. */}
                {/* Hero's grid div inside 'absolute inset-0 z-0' within Hero. */}
                {/* If LandingPage provides the grid, we can remove it here or hide it. Let's hide it to avoid conflict. */}
                {/* Actually, let's keep it but make it transparent so we don't break layout if it holds space? No, it is absolute. */}

                {/* --- SEARCH BAR (Typewriter) --- */}
                {animationStage === 'final' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <ScrollOpacitySearchBar placeholder={placeholder} currentTheme={currentTheme} />
                    </motion.div>
                )}

                {/* --- DYNAMIC PARALLAX IMAGES --- */}
                <AnimatePresence>
                    {animationStage === 'final' && (
                        <>
                            {heroContent.map((group, groupIndex) => (
                                <div key={groupIndex} className={`image-group-${groupIndex} ${groupIndex === activeIndex ? 'block' : 'hidden'}`}>
                                    {group.images.map((img, imgIndex) => (
                                        <ParallaxImage
                                            key={imgIndex}
                                            x={smoothX}
                                            y={smoothY}
                                            speed={(imgIndex + 1) * 5}
                                            className={`${img.className} parallax-target opacity-0 scale-0`}
                                        >
                                            <div className="w-full h-full overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
                                                <img src={img.src} className="w-full h-full object-cover" alt="Visual" />
                                            </div>
                                        </ParallaxImage>
                                    ))}
                                </div>
                            ))}
                        </>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};

const RotatingText = ({ words }) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <span className="inline-block relative h-[1.2em] w-full overflow-hidden align-top text-gray-400">
            <AnimatePresence mode='popLayout'>
                <motion.span
                    key={index}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-110%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "circOut" }}
                    className="absolute left-0 top-0 whitespace-nowrap"
                >
                    {words[index]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
};

// Wrapper for Parallax
const ParallaxImage = ({ className, x, y, speed, children }) => {
    const moveX = useTransform(x, value => value * speed);
    const moveY = useTransform(y, value => value * speed);

    return (
        <motion.div
            style={{ x: moveX, y: moveY }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const ScrollOpacitySearchBar = ({ placeholder, currentTheme }) => {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    return (
        <motion.div style={{ opacity }} className="absolute left-0 right-0 top-[73%] z-40">
            <SearchBar placeholder={placeholder} currentTheme={currentTheme} />
        </motion.div>
    );
};

export default Hero;
