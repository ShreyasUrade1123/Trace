import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TextScroll = ({ currentTheme }) => {
    const sectionRef = useRef(null);
    const textRef = useRef(null);
    const isNoir = currentTheme === "NOIR";

    useEffect(() => {
        const el = sectionRef.current;
        const textEl = textRef.current;

        const words = textEl.querySelectorAll('.word');

        // Animation for text reveal
        gsap.fromTo(words,
            { opacity: 0.1 },
            {
                opacity: 1,
                stagger: 0.05,
                scrollTrigger: {
                    trigger: el,
                    start: "top 70%",
                    end: "bottom 80%",
                    scrub: true,
                }
            }
        );

    }, []);

    const text = "Trace has empowered our Creators to build intricate AI pipelines & produce professional assets in minutes, not hours.";
    const words = text.split(" ");

    return (
        <section ref={sectionRef} className={`min-h-[80vh] flex items-center justify-center transition-colors duration-500 ${isNoir ? 'bg-[#141414]' : 'bg-[#FDFBF7]'} px-8 md:px-20 py-24 relative z-20`}>
            <div className="max-w-6xl mx-auto text-center">
                <p ref={textRef} className={`text-4xl md:text-6xl lg:text-7xl font-neueHaas font-medium leading-[1.1] tracking-tight transition-colors duration-500 ${isNoir ? 'text-white' : 'text-black'}`}>
                    {words.map((word, i) => (
                        <span key={i} className="word inline-block mr-[0.25em] opacity-10">
                            {word}
                        </span>
                    ))}
                </p>
            </div>
        </section>
    );
};

export default TextScroll;
