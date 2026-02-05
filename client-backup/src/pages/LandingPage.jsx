import React, { useState, useRef, useEffect } from 'react';
import Process from '../sections/Process';
import Footer from '../sections/Footer';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import Hero from '../sections/Hero';
import TextScroll from '../sections/TextScroll';
import Working from '../sections/Working';
import Features from '../sections/Features';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useThemeStore from '../store/themeStore';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    const [isHeroReady, setIsHeroReady] = useState(false);
    const { currentTheme } = useThemeStore();
    const searchBarRef = useRef(null);
    const heroRef = useRef(null);

    const themeStyles = {
        SAMBA: { bg: "bg-[#FDFBF7]", text: "text-black", gridOpacity: 0.6, gridColor: "#E5E5E5", radialColor: "#D4D4D4" },
        NOIR: { bg: "bg-[#2D2D2D]", text: "text-white", gridOpacity: 0.3, gridColor: "#4f4f4fff", radialColor: "#4f4f4fff" },
        PSYCHOLOGICAL: { bg: "bg-[#FDFBF7]", text: "text-black", gridOpacity: 0.6 },
        GIALLO: { bg: "bg-[#FDFBF7]", text: "text-black", gridOpacity: 0.6 },
        "SCI-FI": { bg: "bg-[#FDFBF7]", text: "text-black", gridOpacity: 0.6 }
    };
    const activeStyle = themeStyles[currentTheme] || themeStyles["SAMBA"];

    useEffect(() => {
        if (!searchBarRef.current || !heroRef.current) return;
        const sb = searchBarRef.current;
        gsap.set(sb, { opacity: 0, y: 50, scale: 0.9, display: "none" });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroRef.current,
                start: "bottom bottom",
                end: "bottom top",
                scrub: true,
                onEnter: () => gsap.fromTo(sb, { y: 100, opacity: 0, display: 'flex' }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }),
                onLeaveBack: () => gsap.to(sb, { y: 100, opacity: 0, duration: 0.3, ease: "power3.in", onComplete: () => gsap.set(sb, { display: "none" }) })
            }
        });
        return () => { if (tl.scrollTrigger) tl.scrollTrigger.kill(); tl.kill(); };
    }, []);

    return (
        <div className={`min-h-screen ${activeStyle.bg} ${activeStyle.text} font-sans relative flex flex-col transition-colors duration-500`}>
            {/* Grid Pattern */}
            <div className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ backgroundImage: `linear-gradient(${activeStyle.gridColor || '#E5E5E5'} 1px, transparent 1px), linear-gradient(90deg, ${activeStyle.gridColor || '#E5E5E5'} 1px, transparent 1px), radial-gradient(circle at 1px 1px, ${activeStyle.radialColor || '#D4D4D4'} 3px, transparent 3px)`, backgroundSize: '60px 60px', opacity: activeStyle.gridOpacity }}></div>

            <Header />

            <main className="relative z-10 flex-1 w-full">
                <div ref={heroRef} className="relative">
                    <Hero onIntroComplete={() => setIsHeroReady(true)} currentTheme={currentTheme} />
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-[600px]">
                        <SearchBar ref={searchBarRef} placeholder="Search anything" containerClass="bg-white/30 backdrop-blur-xl border-white/20 shadow-2xl" currentTheme={currentTheme} />
                    </div>
                </div>

                <TextScroll currentTheme={currentTheme} />
                <Working currentTheme={currentTheme} />
                <Features currentTheme={currentTheme} />

                {/* Process Section */}
                <Process currentTheme={currentTheme} />

                {/* Footer Section */}
                <Footer currentTheme={currentTheme} />
            </main>
        </div>
    );
};

export default LandingPage;
