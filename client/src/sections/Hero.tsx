import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll, Variants } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import gsap from 'gsap';

// --- content definitions ---
const heroContent = [
    {
        text: "Reflections on the water",
        images: [
            { src: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?q=80&w=400&auto=format&fit=crop",   className: "absolute left-[3%]   top-[45%] w-28 h-28 md:w-44 md:h-44 lg:w-64 lg:h-64 rounded-2xl object-cover overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=400&q=80",   className: "absolute left-[18%]  top-[20%] w-20 h-20 md:w-32 md:h-32 lg:w-48 lg:h-48 rounded-xl object-cover overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=600&q=80",   className: "absolute left-[48%]  top-[26%] w-32 h-28 md:w-52 md:h-44 lg:w-72 lg:h-64 rounded-2xl object-cover overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=400&q=80",   className: "absolute right-[-2%] top-[40%] w-36 h-52 md:w-52 md:h-72 lg:w-72 lg:h-[32rem] rounded-l-3xl object-cover overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",   className: "absolute left-[6%]   top-[85%] w-40 h-52 md:w-60 md:h-72 lg:w-80 lg:h-96 rounded-t-3xl object-cover overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=500&q=80",   className: "absolute right-[18%] top-[78%] w-32 h-32 md:w-52 md:h-52 lg:w-72 lg:h-72 rounded-t-3xl object-cover overflow-hidden" },
        ]
    },
    {
        text: "Quiet Place",
        images: [
            { src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80",   className: "absolute left-[0%]   top-[60%] w-28 h-20 md:w-44 md:h-28 lg:w-64 lg:h-40 rounded-2xl object-cover overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=400&q=80",   className: "absolute left-[18%]  top-[35%] w-20 h-20 md:w-32 md:h-32 lg:w-48 lg:h-48 rounded-xl object-cover overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1507041957456-9c397ce39c97?auto=format&fit=crop&w=300&q=80",   className: "absolute left-[33%]  top-[58%] w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 rounded-lg object-cover overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1499750310159-5b5f336a6133?auto=format&fit=crop&w=600&q=80",   className: "absolute left-[48%]  top-[40%] w-44 h-28 md:w-64 md:h-44 lg:w-96 lg:h-64 rounded-2xl object-cover overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=400&q=80",   className: "absolute right-[-2%] top-[40%] w-36 h-52 md:w-52 md:h-72 lg:w-72 lg:h-[32rem] rounded-l-3xl object-cover overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1517604931442-71053e3e2c3c?auto=format&fit=crop&w=600&q=80",   className: "absolute left-[5%]   top-[85%] w-36 h-40 md:w-52 md:h-60 lg:w-72 lg:h-80 rounded-t-3xl object-cover overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1542466500-dccb2789cbbb?auto=format&fit=crop&w=500&q=80",     className: "absolute right-[24%] top-[78%] w-28 h-28 md:w-44 md:h-44 lg:w-60 lg:h-60 rounded-t-3xl object-cover overflow-hidden" },
        ]
    },
    {
        text: "Black and White Videos",
        images: [
            { src: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=400&q=80",   className: "absolute left-[0%]   top-[60%] w-28 h-20 md:w-44 md:h-28 lg:w-64 lg:h-40 rounded-2xl object-cover grayscale overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=400&q=80",   className: "absolute left-[18%]  top-[28%] w-20 h-20 md:w-32 md:h-32 lg:w-48 lg:h-48 rounded-xl object-cover grayscale overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=80",   className: "absolute left-[33%]  top-[58%] w-14 h-9  md:w-20 md:h-12 lg:w-28 lg:h-[4.5rem] rounded-lg object-cover grayscale overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=600&q=80",   className: "absolute left-[48%]  top-[29%] w-32 h-28 md:w-52 md:h-44 lg:w-72 lg:h-64 rounded-2xl object-cover grayscale overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?auto=format&fit=crop&w=300&q=80",   className: "absolute right-[23%] top-[55%] w-14 h-9  md:w-20 md:h-12 lg:w-28 lg:h-[4.5rem] rounded-lg object-cover grayscale overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&w=400&q=80",   className: "absolute right-[-2%] top-[50%] w-36 h-48 md:w-52 md:h-72 lg:w-72 lg:h-96 rounded-l-3xl object-cover grayscale overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?auto=format&fit=crop&w=600&q=80",   className: "absolute left-[6%]   top-[85%] w-40 h-52 md:w-60 md:h-72 lg:w-80 lg:h-96 rounded-t-3xl object-cover grayscale overflow-hidden" },
            { src: "https://images.unsplash.com/photo-1542466500-dccb2789cbbb?auto=format&fit=crop&w=500&q=80",     className: "absolute right-[18%] top-[85%] w-28 h-36 md:w-44 md:h-52 lg:w-64 lg:h-72 rounded-t-3xl object-cover grayscale overflow-hidden" },
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

        const ctx = gsap.context(() => {
            setPlaceholder("");
            gsap.set(imagesRef.current, { scale: 0, opacity: 0 });

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

                // Images Pop Out
                masterTl.to(`.image-group-${index} .parallax-target`, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "back.out(1.7)"
                }, "-=1.0");

                masterTl.to({}, { duration: 2 });

                // Images Pop In
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

            return () => masterTl.kill();
        });

        return () => ctx.revert();
    }, [animationStage]);

    // UPDATED SEQUENCE TIMINGS (Flim.ai Sync)
    useEffect(() => {
        const startSequence = async () => {
            // 0.0s: Grid is visible, logo is positioned off-screen at bottom
            await new Promise(r => setTimeout(r, 100));
            
            // Trigger slide up to center
            setAnimationStage('white-enter');

            // Wait 2.2s: 1.2s for the slide-up animation to finish, plus 1.0s cinematic pause
            await new Promise(r => setTimeout(r, 2200));
            
            // Trigger shrink to final layout position
            setAnimationStage('final');

            if (onIntroComplete) {
                setTimeout(() => onIntroComplete(), 1200);
            }
        };

        startSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [device, setDevice] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop');

    useEffect(() => {
        const update = () => {
            const w = window.innerWidth;
            if (w < 480) setDevice('mobile');
            else if (w < 991) setDevice('tablet');
            else setDevice('desktop');
        };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    const headerVariants: Variants = {
        grid: { height: "100vh", opacity: 0, borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px" },
        'white-enter': { 
            height: "100vh", 
            opacity: 1, 
            borderBottomLeftRadius: "0px", 
            borderBottomRightRadius: "0px",
            transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] as const }
        },
        final: { height: "auto", opacity: 1, borderBottomLeftRadius: "0px", borderBottomRightRadius: "0px", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const } }
    };

    // RESTORED: Desktop uses 2.4 scale. Mobile/Tablet stays 1.0 to prevent overflow.
    const logoVariants: Variants = device === 'desktop' ? {
        grid: { 
            scale: 2.4, 
            y: "100vh", 
            x: "-2vw", 
            opacity: 1 
        },
        'white-enter': {
            scale: 2.4,
            y: "-25vh",
            x: 0,
            opacity: 1,
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }
        },
        final: {
            scale: 1,
            y: 0,
            x: 0,
            opacity: 1,
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }
        }
    } : {
        grid: { 
            scale: 1, 
            y: "100vh", 
            x: "0vw", 
            opacity: 1 
        },
        'white-enter': {
            scale: 1,
            y: "25vh", // Slides up slightly lower on mobile to stay centered
            x: "0vw",
            opacity: 1,
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }
        },
        final: {
            scale: 1,
            y: 0,
            x: "-0.5vw",
            opacity: 1,
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as const }
        }
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { delay: 0.5, duration: 0.8 } }
    };

    return (
        <div className={`relative w-full min-h-screen transition-colors duration-500 ${isNoir ? 'bg-transparent text-white' : 'bg-transparent text-gray-900 selection:bg-black selection:text-white'} flex flex-col overflow-hidden`}>
            
            <motion.div
                className={`relative z-30 w-full flex flex-col justify-end shadow-sm transition-colors duration-500 ${isNoir ? 'bg-[#141414]' : 'bg-white'}`}
                initial="grid"
                animate={animationStage}
                variants={headerVariants}
            >
                {/* RESTORED: lg:flex-row, lg:items-end, and lg:gap-[clamp(40px,8vw,120px)] */}
                <div className="w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row lg:items-start lg:justify-start px-2 md:px-4 lg:px-4 gap-2 lg:gap-[clamp(280px,30vw,600px)] pt-12 md:pt-12 lg:pt-22.5 pb-4 md:pb-4 lg:pb-12">
                    
                    {/* Logotype Wrapper */}
                    <div className="w-full lg:w-auto flex items-start justify-start">
                        <motion.div variants={logoVariants} className="lg:origin-top-left origin-bottom-left w-full will-change-transform">
                            {/* RESTORED: hero-logo class */}
                            <h1 className="
                                hero-logo
                                leading-[0.9]
                                font-bold
                                tracking-tighter
                                lg:-ml-[vw]
                                select-none
                                whitespace-nowrap
                                text-left
                            ">
                                Trace
                            </h1>
                        </motion.div>
                    </div>

                    {/* Tagline + Button Wrapper */}
                    <motion.div
                        className="
                          w-full lg:w-auto
                          flex flex-row lg:flex-col
                          justify-between items-end lg:items-start
                          gap-4 lg:gap-13
                          pb-2
                        "
                        variants={contentVariants}
                        initial="hidden"
                        animate={animationStage === 'final' ? "visible" : "hidden"}
                    >
                        {/* Top Text / Tagline */}
                        {device === 'desktop' ? (
                            <h2 className="text-3xl md:text-3.7xl font-helveticaNow font-bold leading-[1] tracking-tight pt-6 md:pt-0 lg:pt-5">
                                The Creative Sidekick<br />
                                Made For
                                <span className="ml-1 inline-flex">
                                    <Typewriter words={["Art directors.", "Storytellers.", "Agencies.", "Designers."]} />
                                </span>
                                <br />
                                Built for Storytellers.
                            </h2>
                        ) : (
                            <h2 className="
                              hero-tagline
                              font-helveticaNow
                              font-bold
                              leading-[1]
                              tracking-tight
                              max-w-[260px] lg:max-w-none
                            ">
                                The Creative Sidekick<br />
                                Made For
                                <span className="ml-1 inline-flex">
                                    <Typewriter words={["Art directors.", "Storytellers.", "Agencies.", "Designers."]} />
                                </span>
                                <br />
                                Built for Storytellers.
                            </h2>
                        )}

                        {/* Bottom Button */}
                        <div className="flex-shrink-0">
                            {device === 'desktop' ? (
                                <button className={`
                                    group flex items-center gap-3
                                    px-2 py-2 pr-5
                                    rounded-lg cursor-pointer
                                    hover:scale-105 transition-all duration-300
                                    ${isNoir ? 'bg-white text-black' : 'bg-black text-white'}
                                `}>
                                    <div className="
                                      w-13 h-13
                                      bg-[#FECC33] rounded-md
                                      flex items-center justify-center
                                      overflow-hidden relative
                                    ">
                                        <div className="w-12 h-12 rounded-full overflow-hidden">
                                            <img
                                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                                                alt="User"
                                                className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500 grayscale contrast-125"
                                            />
                                        </div>
                                    </div>
                                    <span className="font-tgfrekuent font-normal text-[12px] tracking-wide uppercase whitespace-nowrap">
                                        Start Creating
                                    </span>
                                </button>
                            ) : (
                                <button className={`
                                    group flex items-center gap-3
                                    px-2 py-2 pr-4
                                    rounded-lg cursor-pointer
                                    hover:scale-105 transition-all duration-300
                                    ${isNoir ? 'bg-white text-black' : 'bg-black text-white'}
                                `}>
                                    <div className="
                                      w-9 h-9 lg:w-12 lg:h-12
                                      bg-[#FECC33] rounded-lg
                                      flex items-center justify-center
                                      overflow-hidden relative
                                    ">
                                        <div className="w-7 h-7 lg:w-10 lg:h-10 rounded-full overflow-hidden">
                                            <img
                                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                                                alt="User"
                                                className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500 grayscale contrast-125"
                                            />
                                        </div>
                                    </div>
                                    <span className="font-tgfrekuent font-normal text-[10px] lg:text-xs tracking-wide uppercase whitespace-nowrap">
                                        Start Creating
                                    </span>
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* --- BOTTOM SECTION: FLOATING IMAGES & GRID (Parallax) --- */}
            <div className="absolute inset-0 z-0 pt-[40vh]">
                {animationStage === 'final' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <ScrollOpacitySearchBar placeholder={placeholder} currentTheme={currentTheme} />
                    </motion.div>
                )}

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


// Wrapper for Parallax
const ParallaxImage = ({ className, x, y, speed, children }) => {
    const moveX = useTransform(x, (value: number) => value * speed);
    const moveY = useTransform(y, (value: number) => value * speed);

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
            <SearchBar placeholder={placeholder} currentTheme={currentTheme} className="-mt-8" />
        </motion.div>
    );
};

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

export default Hero;