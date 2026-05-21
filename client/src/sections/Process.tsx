import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// --- STYLES FOR THE MARQUEE AND CTA BUTTON ---
const STYLE_INJECTION = `
  @keyframes marquee-left {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes marquee-right {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
  }
  .animate-marquee-left {
    display: flex;
    animation: marquee-left 35s linear infinite;
  }
  .animate-marquee-right {
    display: flex;
    animation: marquee-right 35s linear infinite;
  }
  .animate-marquee-left:hover,
  .animate-marquee-right:hover {
    animation-play-state: paused;
  }
  
  .primary-btn {
    display: inline-block;
    border-radius: 9999px;
    overflow: hidden;
    height: 48px;
    border: 1px solid currentColor;
    position: relative;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  .primary-btn_inner {
    height: 100%;
    overflow: hidden;
    position: relative;
    padding: 0 28px;
  }
  .primary-btn_track {
    display: flex;
    flex-direction: column;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    height: 96px; /* 48px * 2 */
  }
  .primary-btn_text-wrap {
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .primary-btn:hover .primary-btn_track {
    transform: translateY(-50%);
  }

  .process_pogress {
    height: 100%;
    position: absolute;
    inset: 0% auto 0% 0%;
  }
  #progress_bar {
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    width: 120px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 12px;
    padding-left: 1rem;
    z-index: 10;
    pointer-events: none;
    overflow: visible;
  }
  #progress_bar .process-line {
    height: 1px;
    width: 32px;
    transition: width 0.2s, background-color 0.2s;
    position: relative;
  }
  .process-line .step-label {
    position: absolute;
    top: -8px;
    left: 100%;
    margin-left: 14px;
    font-family: inherit;
    font-size: 10px;
    letter-spacing: 0.25em;
    font-weight: 600;
    text-transform: uppercase;
    color: #F63A22;
    opacity: 0;
    transition: opacity 0.3s ease;
    white-space: nowrap;
    pointer-events: none;
  }
  .process-line.show-label .step-label {
    opacity: 1;
  }
`;

// --- STEP VISUALIZATIONS ---

// Step 1: Discover (Horizontal Marquees)
const DiscoverVisual = ({ isNoir }) => {
  const row1 = [
    "What’s the primary goal of the new website?",
    "Who is your ideal customer or user?",
    "Will your team need training?",
    "What does success look like?"
  ];
  const row2 = [
    "Are there any visual or tone/style directions to avoid?",
    "What information are users looking for?",
    "Are there any sites you admire?",
    "What does success look like?"
  ];
  const row3 = [
    "Who will be involved in approvals or feedback?",
    "What pages do you expect the site to have?",
    "Who are your main competitors?",
    "How would you describe your brand in 3 words?"
  ];
  const row4 = [
    "How do you want users to feel?",
    "Are there different types of users with different needs?",
    "What does your company do?",
    "What’s the primary goal of the new website?"
  ];

  const renderRow = (items, directionClass) => {
    const doubled = [...items, ...items];
    return (
      <div className="w-full overflow-hidden py-1.5 flex relative">
        <div className={`flex gap-3 whitespace-nowrap ${directionClass}`}>
          {doubled.map((item, idx) => (
            <div
              key={idx}
              className={`px-5 py-2.5 text-xs md:text-sm font-medium rounded-full border transition-all duration-300
                ${isNoir 
                  ? "bg-[#18181B]/80 text-zinc-300 border-zinc-800" 
                  : "bg-white/95 text-zinc-700 border-zinc-200 shadow-sm"}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto h-[240px] md:h-[280px] overflow-hidden flex flex-col justify-center rounded-2xl border border-dashed transition-colors duration-500
      ${isNoir ? "border-zinc-800 bg-[#0F0F12]/30" : "border-zinc-300 bg-zinc-100/30"}`}>
      {renderRow(row1, "animate-marquee-left")}
      {renderRow(row2, "animate-marquee-right")}
      {renderRow(row3, "animate-marquee-left")}
      {renderRow(row4, "animate-marquee-right")}
      
      {/* Side gradient overlays for premium fade effect */}
      <div className={`absolute inset-y-0 left-0 w-20 pointer-events-none bg-gradient-to-r transition-all duration-500
        ${isNoir ? "from-[#0A0A0A] to-transparent" : "from-white to-transparent"}`} />
      <div className={`absolute inset-y-0 right-0 w-20 pointer-events-none bg-gradient-to-l transition-all duration-500
        ${isNoir ? "from-[#0A0A0A] to-transparent" : "from-white to-transparent"}`} />
    </div>
  );
};

// Step 2: Design (Layered Overlapping Mockup Cards)
const DesignVisual = ({ isNoir }) => {
  return (
    <div className={`relative w-full max-w-2xl mx-auto h-[240px] md:h-[280px] flex items-center justify-center overflow-hidden rounded-2xl border border-dashed transition-colors duration-500
      ${isNoir ? "border-zinc-800 bg-[#0F0F12]/30" : "border-zinc-300 bg-zinc-100/30"}`}>
      <div className="relative w-80 h-56 flex items-center justify-center">
        {/* V2 image wrap (rotated -4deg, bottom/left card) */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          style={{
            transform: "translate3d(0px, 20px, 0px) rotateZ(-4deg)",
            transformStyle: "preserve-3d"
          }}
          className={`absolute w-48 aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border origin-bottom-left cursor-pointer transition-colors duration-500
            ${isNoir ? "border-white/10 bg-zinc-950" : "border-zinc-200 bg-white"}`}
        >
          <img
            src="https://cdn.prod.website-files.com/668ebb5fda4eee91ba68ef54/6867db77d43aba49681dfeab_Orbi%20Hero%20v2%20(1).jpg"
            alt="Orbi Hero v2"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* V1 image wrap (rotated 4deg, top/right card) */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
          transition={{ type: "spring", stiffness: 350, damping: 22 }}
          style={{
            transform: "translate3d(0px, -8px, 0px) rotateZ(4deg)",
            transformStyle: "preserve-3d"
          }}
          className={`absolute w-48 aspect-[4/3] rounded-xl overflow-hidden shadow-2xl border origin-bottom-right cursor-pointer transition-colors duration-500
            ${isNoir ? "border-white/10 bg-zinc-950" : "border-zinc-200 bg-white"}`}
        >
          <img
            src="https://cdn.prod.website-files.com/668ebb5fda4eee91ba68ef54/6867db62e06cdbf757e994d4_Orbi%20Hero%20V1.jpeg"
            alt="Orbi Hero V1"
            className="w-full h-full object-cover"
          />
          {/* Decorative Corner Layout Squares */}
          <div className={`absolute top-2 left-2 w-2 h-2 border-t border-l ${isNoir ? 'border-white/40' : 'border-black/30'}`} />
          <div className={`absolute top-2 right-2 w-2 h-2 border-t border-r ${isNoir ? 'border-white/40' : 'border-black/30'}`} />
          <div className={`absolute bottom-2 left-2 w-2 h-2 border-b border-l ${isNoir ? 'border-white/40' : 'border-black/30'}`} />
          <div className={`absolute bottom-2 right-2 w-2 h-2 border-b border-r ${isNoir ? 'border-white/40' : 'border-black/30'}`} />
          
          <div className={`absolute bottom-3 left-3 px-2 py-0.5 rounded text-[8px] font-mono tracking-wider shadow-sm
            ${isNoir ? "bg-black/90 text-white border border-white/10" : "bg-white/90 text-black border border-zinc-200"}`}>
            Orbi v2
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Step 3: Build (Webflow Editor Interface & Mock Page Scroll)
const BuildVisual = ({ scrollYProgress, isNoir }) => {
  const y = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "-70%"]);

  return (
    <div className={`relative w-full max-w-2xl mx-auto h-[240px] md:h-[280px] flex items-center justify-center overflow-hidden rounded-2xl border border-dashed transition-colors duration-500
      ${isNoir ? "border-zinc-800 bg-[#0F0F12]/30" : "border-zinc-300 bg-zinc-100/30"}`}>
      <div className={`relative w-[300px] h-[190px] rounded-xl overflow-hidden border shadow-2xl bg-zinc-950 transition-colors duration-500
        ${isNoir ? "border-zinc-800" : "border-zinc-200"}`}>
        {/* Editor Layout Frame */}
        <img
          src="https://cdn.prod.website-files.com/668ebb5fda4eee91ba68ef54/68669ebaa1c3d0da804411d1_Webflow%20UI%20(1).png"
          alt="Webflow Editor UI"
          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
        />
        
        {/* Web page mockup within Editor canvas frame */}
        <div className="absolute top-[33px] left-[56px] right-[56px] bottom-[15px] overflow-hidden rounded-sm bg-black z-0">
          <motion.img
            style={{ y }}
            src="https://cdn.prod.website-files.com/668ebb5fda4eee91ba68ef54/68669faa13683d5184b0e7f4_Orbi%20Landing%20Page%20(1)%20(1).jpg"
            alt="Orbi Landing Page mockup"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
};

// Step 4: Launch (Success Growth Graph with Pulsing Glow Dot)
const LaunchVisual = ({ scrollYProgress, isNoir }) => {
  const pathRef = useRef(null);
  const pathProgress = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);
  const [dotPos, setDotPos] = useState({ x: 1, y: 231 });

  useEffect(() => {
    return pathProgress.on("change", (latest) => {
      if (!pathRef.current) return;
      try {
        const path = pathRef.current;
        const totalLength = path.getTotalLength();
        const pt = path.getPointAtLength(latest * totalLength);
        setDotPos({ x: pt.x, y: pt.y });
      } catch {
        // ignore
      }
    });
  }, [pathProgress]);

  return (
    <div className={`relative w-full max-w-2xl mx-auto h-[240px] md:h-[280px] flex items-center justify-center overflow-hidden rounded-2xl border border-dashed transition-colors duration-500
      ${isNoir ? "border-zinc-800 bg-[#0F0F12]/30" : "border-zinc-300 bg-zinc-100/30"}`}>
      <div className="relative w-full max-w-[400px] px-6">
        <div className="graph-wrapper w-full aspect-[681/232]">
          {/* Background Gradient Area Fill */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 681 296" preserveAspectRatio="none">
            <defs>
              <linearGradient id="launch_graph_bg_gradient" x1="339.5" y1="0" x2="339.5" y2="295" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22F677" stopOpacity="0.35"></stop>
                <stop offset="1" stopColor="#22F677" stopOpacity="0"></stop>
              </linearGradient>
            </defs>
            <path 
              d="M167.381 162.324C104.219 202.317 0 230.547 0 230.547V295.336H679V0C679 0 626.891 99.982 584.256 103.511C541.621 107.04 528.988 71.7518 486.353 79.9856C443.719 88.2194 393.188 204.488 312.656 195.259C232.123 186.03 230.544 122.331 167.381 162.324Z" 
              fill="url(#launch_graph_bg_gradient)"
            />
          </svg>

          {/* SVG Growth Line and Interactive Dot */}
          <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 681 232" preserveAspectRatio="none">
            {/* Background trace line */}
            <path
              d="M1 231C1 231 105.219 202.837 168.381 162.939C231.544 123.041 233.123 186.589 313.656 195.796C394.188 205.003 444.719 89.0102 487.353 80.7959C529.988 72.5816 542.621 107.786 585.256 104.265C627.891 100.745 680 1 680 1"
              stroke={isNoir ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}
              strokeWidth="2"
              fill="none"
            />
            {/* Drawing green active curve */}
            <motion.path
              ref={pathRef}
              d="M1 231C1 231 105.219 202.837 168.381 162.939C231.544 123.041 233.123 186.589 313.656 195.796C394.188 205.003 444.719 89.0102 487.353 80.7959C529.988 72.5816 542.621 107.786 585.256 104.265C627.891 100.745 680 1 680 1"
              stroke="#22F677"
              strokeWidth="2.5"
              fill="none"
              style={{ pathLength: pathProgress }}
            />
            {/* Interactive coordinates pointer group */}
            <g transform={`translate(${dotPos.x}, ${dotPos.y})`}>
              <circle r="7" fill="#4DCD80" stroke="#22F677" strokeWidth="2.5" />
              <circle r="15" fill="#22F677" opacity="0.3" className="animate-ping" style={{ transformOrigin: "0px 0px" }} />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PROCESS SECTION COMPONENT ---
const Process = ({ currentTheme }) => {
  const isNoir = currentTheme === 'NOIR';

  // Section level scroll references
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);

  // Use Scroll hooks for each individual step to drive their local visual states
  const { scrollYProgress: step3Scroll } = useScroll({
    target: step3Ref,
    offset: ["start end", "end start"]
  });

  const { scrollYProgress: step4Scroll } = useScroll({
    target: step4Ref,
    offset: ["start end", "end start"]
  });

  useEffect(() => {
    const container = progressBarRef.current;
    if (!container) return;

    const lineHeight = 1;
    const lineGap = 12;

    const widths = [32, 34, 38, 46, 62, 94, 62, 46, 38, 34, 32];
    const colorsNoir = [
      'rgba(255,255,255,0.1)', '#2B2929', '#3D2B29', '#5C2F29', '#9A372A',
      '#F63A22', '#9A372A', '#5C2F29', '#3D2B29', '#2B2929', 'rgba(255,255,255,0.1)'
    ];
    const colorsSamba = [
      'rgba(0,0,0,0.1)', '#E4E4E7', '#FECACA', '#FCA5A5', '#EF4444',
      '#F63A22', '#EF4444', '#FCA5A5', '#FECACA', '#E4E4E7', 'rgba(0,0,0,0.1)'
    ];

    const colors = isNoir ? colorsNoir : colorsSamba;

    let lines = [];

    function generateLines() {
      if (!container) return;
      container.innerHTML = '';
      const totalLines = Math.ceil(container.getBoundingClientRect().height / (lineHeight + lineGap));

      for (let i = 0; i < totalLines; i++) {
        const line = document.createElement('div');
        line.className = 'process-line';
        container.appendChild(line);
      }

      lines = container.querySelectorAll('.process-line');
      updateLines();
    }

    function updateLines() {
      const centerY = window.innerHeight / 2;

      lines.forEach((line) => {
        const rect = line.getBoundingClientRect();
        const distance = Math.abs(rect.top - centerY);
        const step = lineGap + lineHeight;
        const offset = Math.round(distance / step);

        if (offset <= 5) {
          const styleIndex = offset + 5;
          line.style.width = `${widths[styleIndex]}px`;
          line.style.backgroundColor = colors[styleIndex];
        } else {
          line.style.width = '32px';
          line.style.backgroundColor = isNoir ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
          line.classList.remove('show-label');
          const existing = line.querySelector('.step-label');
          if (existing) existing.remove();
        }
      });
    }

    // Detect scroll stop
    let scrollTimeout;
    function onScrollStop() {
      const centerY = window.innerHeight / 2;

      // Find the line closest to center
      let activeLine = null;
      let smallestDistance = Infinity;

      lines.forEach((line) => {
        const rect = line.getBoundingClientRect();
        const distance = Math.abs(rect.top - centerY);
        if (distance < smallestDistance) {
          smallestDistance = distance;
          activeLine = line;
        }
      });

      if (!activeLine) return;

      // Find the closest step to center
      const steps = document.querySelectorAll('[id^="step"]');
      let currentStep = null;
      let closestDistance = Infinity;

      steps.forEach((stepEl) => {
        const rect = stepEl.getBoundingClientRect();
        const stepCenter = rect.top + rect.height / 2;
        const distanceToCenter = Math.abs(stepCenter - centerY);

        if (distanceToCenter < closestDistance) {
          closestDistance = distanceToCenter;
          currentStep = stepEl;
        }
      });

      // Clear all labels
      lines.forEach((line) => {
        line.classList.remove('show-label');
        const existing = line.querySelector('.step-label');
        if (existing) existing.remove();
      });

      if (activeLine && currentStep) {
        const containerRect = container.getBoundingClientRect();
        const lineRect = activeLine.getBoundingClientRect();

        const buffer = 100;
        const lineY = lineRect.top + lineRect.height / 2;

        const isTooCloseToTop = lineY < containerRect.top + buffer;
        const isTooCloseToBottom = lineY > containerRect.bottom - buffer;

        if (isTooCloseToTop || isTooCloseToBottom) return;

        const stepId = currentStep.id;
        const stepNum = 'Step ' + stepId.replace('step', '');
        const label = document.createElement('span');
        label.className = 'step-label';
        label.textContent = stepNum;
        activeLine.appendChild(label);
        activeLine.classList.add('show-label');
      }
    }

    const handleScroll = () => {
      updateLines();

      // Instantly hide any labels on scroll
      lines.forEach((line) => {
        line.classList.remove('show-label');
        const existing = line.querySelector('.step-label');
        if (existing) existing.remove();
      });

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(onScrollStop, 100);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', generateLines);

    // Initial generation after a short delay to allow layout to settle
    const timer = setTimeout(generateLines, 300);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', generateLines);
      clearTimeout(timer);
      clearTimeout(scrollTimeout);
    };
  }, [isNoir]);

  return (
    <section
      ref={containerRef}
      id="process"
      className={`relative w-full font-sans transition-colors duration-700 ease-in-out py-24 md:py-32 overflow-hidden
        ${isNoir ? "bg-[#0A0A0A] text-white" : "bg-[#FAFAFA] text-zinc-900"}`}
    >
      {/* Styles Injections */}
      <style dangerouslySetInnerHTML={{ __html: STYLE_INJECTION }} />

      {/* Decorative Rotating Background Stars */}
      <motion.img
        src="https://cdn.prod.website-files.com/668ebb5fda4eee91ba68ef54/6784e48f44bc03f26ce40e7d_Group%2018.svg"
        alt=""
        className={`absolute top-20 left-10 w-8 h-8 opacity-15 pointer-events-none select-none z-0 ${isNoir ? "invert" : ""}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <motion.img
        src="https://cdn.prod.website-files.com/668ebb5fda4eee91ba68ef54/6784e48f44bc03f26ce40e7d_Group%2018.svg"
        alt=""
        className={`absolute bottom-20 right-10 w-8 h-8 opacity-15 pointer-events-none select-none z-0 ${isNoir ? "invert" : ""}`}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Ruler progress bar (Two Hands Studio style) */}
        <div className="process_pogress absolute left-6 md:left-12 lg:left-20 top-0 bottom-0 pointer-events-none hidden lg:block">
          <div id="progress_bar" ref={progressBarRef} />
        </div>
        
        {/* Section Header */}
        <div className="mb-20 md:mb-28 text-center max-w-2xl mx-auto">
          <div className="inline-block mb-3">
            <span className="font-iki text-xs tracking-[0.25em] text-[#F63A22] uppercase font-semibold">
              Process
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-helvetica-now font-bold tracking-tight">
            How I take you from <span className={isNoir ? "text-white" : "text-zinc-950"}>zero to launch</span>
          </h2>
        </div>

        {/* Vertical centered stack of steps (matching original Webflow design) */}
        <div className="flex flex-col gap-32 md:gap-40 max-w-4xl mx-auto">

          {/* STEP 1: DISCOVER */}
          <div
            ref={step1Ref}
            id="step1"
            className="flex flex-col gap-8 md:gap-12 items-center text-center border-b border-dashed border-zinc-800/40 pb-24 last:border-0 last:pb-0"
          >
            <div className="w-full">
              <DiscoverVisual isNoir={isNoir} />
            </div>
            
            <div className="max-w-xl px-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="font-iki text-xs px-2 py-0.5 rounded border border-[#F63A22]/20 text-[#F63A22] bg-[#F63A22]/5">
                  01
                </span>
                <span className="font-iki text-xs uppercase tracking-wider text-zinc-500">
                  Discovery & Strategy
                </span>
              </div>
              
              <p className={`text-base md:text-lg leading-relaxed ${isNoir ? "text-zinc-400" : "text-zinc-600"}`}>
                <span className={isNoir ? "text-white font-medium" : "text-zinc-900 font-medium"}>Discover </span> 
                what your goals are, who it&apos;s for, and what success looks like. We&apos;ll align on what really matters before diving into design.
              </p>
            </div>
          </div>

          {/* STEP 2: DESIGN */}
          <div
            ref={step2Ref}
            id="step2"
            className="flex flex-col gap-8 md:gap-12 items-center text-center border-b border-dashed border-zinc-800/40 pb-24 last:border-0 last:pb-0"
          >
            <div className="w-full">
              <DesignVisual isNoir={isNoir} />
            </div>
            
            <div className="max-w-xl px-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="font-iki text-xs px-2 py-0.5 rounded border border-[#F63A22]/20 text-[#F63A22] bg-[#F63A22]/5">
                  02
                </span>
                <span className="font-iki text-xs uppercase tracking-wider text-zinc-500">
                  Visual Direction
                </span>
              </div>
              
              <p className={`text-base md:text-lg leading-relaxed ${isNoir ? "text-zinc-400" : "text-zinc-600"}`}>
                <span className={isNoir ? "text-white font-medium" : "text-zinc-900 font-medium"}>Design </span> 
                a site that looks sharp and feels like you. You’ll see a few visual directions so we can quickly align on the right one.
              </p>
            </div>
          </div>

          {/* STEP 3: BUILD */}
          <div
            ref={step3Ref}
            id="step3"
            className="flex flex-col gap-8 md:gap-12 items-center text-center border-b border-dashed border-zinc-800/40 pb-24 last:border-0 last:pb-0"
          >
            <div className="w-full">
              <BuildVisual scrollYProgress={step3Scroll} isNoir={isNoir} />
            </div>
            
            <div className="max-w-xl px-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="font-iki text-xs px-2 py-0.5 rounded border border-[#F63A22]/20 text-[#F63A22] bg-[#F63A22]/5">
                  03
                </span>
                <span className="font-iki text-xs uppercase tracking-wider text-zinc-500">
                  Development
                </span>
              </div>
              
              <p className={`text-base md:text-lg leading-relaxed ${isNoir ? "text-zinc-400" : "text-zinc-600"}`}>
                <span className={isNoir ? "text-white font-medium" : "text-zinc-900 font-medium"}>Build </span> 
                a site that’s fast, stable, and easy to update. No messy code or bloated templates - just clean Webflow structure built to last.
              </p>
            </div>
          </div>

          {/* STEP 4: LAUNCH */}
          <div
            ref={step4Ref}
            id="step4"
            className="flex flex-col gap-8 md:gap-12 items-center text-center"
          >
            <div className="w-full">
              <LaunchVisual scrollYProgress={step4Scroll} isNoir={isNoir} />
            </div>
            
            <div className="max-w-xl px-4 flex flex-col items-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="font-iki text-xs px-2 py-0.5 rounded border border-[#F63A22]/20 text-[#F63A22] bg-[#F63A22]/5">
                  04
                </span>
                <span className="font-iki text-xs uppercase tracking-wider text-zinc-500">
                  Deployment & Growth
                </span>
              </div>
              
              <p className={`text-base md:text-lg leading-relaxed ${isNoir ? "text-zinc-400" : "text-zinc-600"} mb-8`}>
                <span className={isNoir ? "text-white font-medium" : "text-zinc-900 font-medium"}>Launch </span> 
                with confidence, knowing the site is responsive, fast, and easy to grow. I’ll also be on hand to support you post-launch.
              </p>

              {/* Text-shifting Hover Button */}
              <a
                href="/get-started"
                className={`primary-btn w-56 block transition-all duration-300
                  ${isNoir 
                    ? "bg-white text-black hover:bg-zinc-200 border-white" 
                    : "bg-zinc-950 text-white hover:bg-zinc-800 border-zinc-950"}`}
              >
                <div className="primary-btn_inner">
                  <div className="primary-btn_track">
                    <div className="primary-btn_text-wrap">
                      <div className="font-mono tracking-wider font-semibold text-xs">Start today &rarr;</div>
                    </div>
                    <div className="primary-btn_text-wrap">
                      <div className="font-mono tracking-wider font-semibold text-xs">Get a helping hand</div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

        </div>

      </div>


    </section>
  );
};

export default Process;
