import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Box, Zap, Video, Maximize2, MoreHorizontal } from 'lucide-react';

// --- Node Data Structure ---
// Compacted coordinates to fit within ~1500-1600px width for better screen fit
const INITIAL_NODES = [
    // --- Column 1 (Far Left) ---
    // Milan Cathedral (Top Left)
    {
        id: 'ref-1',
        type: 'reference',
        x: 20,
        y: 100,
        title: '',
        width: 250,
        data: { image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1000&auto=format&fit=crop' }
    },
    // Yellow Tracksuit (Bottom Left)
    {
        id: 'ref-2',
        type: 'reference',
        x: 40,
        y: 600,
        title: '',
        width: 200,
        data: { image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop' } // Yellowish outfit placeholder
    },

    // --- Column 2 (Mid Left) ---
    // White/Ref Frame (Top) - Placeholder/Input
    {
        id: 'ref-3',
        type: 'reference',
        x: 350,
        y: 50,
        title: '',
        width: 220,
        data: { image: 'https://plus.unsplash.com/premium_photo-1673327638363-2283083af643?q=80&w=1000&auto=format&fit=crop' } // Abstract/texture
    },
    // Guy in Blazer Sitting (Bottom)
    {
        id: 'ref-4',
        type: 'reference',
        x: 320,
        y: 520,
        title: '',
        width: 240,
        data: { image: 'https://images.unsplash.com/photo-1616423664033-63518d2c604e?q=80&w=1000&auto=format&fit=crop' }
    },

    // --- Column 3 (Center) ---
    // Gemini (Top)
    {
        id: 'gemini',
        type: 'chat',
        x: 650,
        y: 30,
        title: 'Google Gemini Chat',
        icon: Sparkles,
        color: 'blue',
        width: 280,
        data: {
            label: 'Attachments',
            image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=1000&auto=format&fit=crop' // Milan ref
        }
    },
    // Claude (Bottom)
    {
        id: 'claude',
        type: 'chat',
        x: 650,
        y: 500,
        title: 'Claude Chat',
        icon: MessageSquare,
        color: 'orange',
        width: 300,
        data: {
            label: 'Attachments',
            text: 'Rewrite the attached prompt to get clothing more like the attached reference images. Return only the prompt, keep it specific details about the cut, style and material like sculptural windbreakers.',
            output: 'A full-body model poses in sculptural technical outerwear against a stark white background...'
        }
    },

    // --- Column 4 (Processing) ---
    // Rodin (Top)
    {
        id: 'rodin',
        type: '3d',
        x: 1000,
        y: 60,
        title: 'Rodin',
        icon: Box,
        color: 'green',
        width: 260,
        data: {
            label: 'Images',
            thumb: 'https://images.unsplash.com/photo-1616423664033-63518d2c604e?q=80&w=200&auto=format&fit=crop',
            image: 'https://plus.unsplash.com/premium_photo-1681396827663-7186fe34d402?q=80&w=1000&auto=format&fit=crop' // 3D render placeholder
        }
    },
    // Flux (Bottom)
    {
        id: 'flux',
        type: 'generation',
        x: 1020,
        y: 480,
        title: 'Flux Krea Dev',
        icon: Zap,
        color: 'yellow',
        width: 250,
        data: {
            label: 'Image Prompt',
            thumb: 'https://images.unsplash.com/photo-1616423664033-63518d2c604e?q=80&w=200&auto=format&fit=crop', // Guy ref
            image: 'https://images.unsplash.com/photo-1616423664033-63518d2c604e?q=80&w=1000&auto=format&fit=crop'
        }
    },

    // --- Column 5 (Output) ---
    // Veo (Video) - Now acting as final or near final
    {
        id: 'veo',
        type: 'video',
        x: 1350,
        y: 480,
        title: 'Google Veo',
        icon: Video,
        color: 'blue',
        width: 240,
        data: {
            label: 'First Frame',
            thumb: 'https://images.unsplash.com/photo-1616423664033-63518d2c604e?q=80&w=200&auto=format&fit=crop',
            image: 'https://images.unsplash.com/photo-1616423664033-63518d2c604e?q=80&w=1000&auto=format&fit=crop'
        }
    },

    // Total Width Used: ~1350 + 240 = ~1600px. Fits safely in 1920px.
];

const INITIAL_CONNECTIONS = [
    { from: 'ref-1', to: 'gemini' },
    { from: 'ref-3', to: 'gemini' },
    { from: 'gemini', to: 'rodin' },
    { from: 'ref-4', to: 'claude' },
    { from: 'claude', to: 'flux' },
    { from: 'flux', to: 'veo' },
    // Rodin has output handle but no visible line in some refs, adding placeholder if needed
];

// --- Components ---

const NodeHeader = ({ title, icon: Icon, color, isNoir }) => {
    if (!title) return null;

    const colorMap = {
        blue: isNoir ? 'text-blue-400 bg-blue-400/10' : 'text-blue-600 bg-blue-50',
        orange: isNoir ? 'text-orange-400 bg-orange-400/10' : 'text-orange-600 bg-orange-50',
        green: isNoir ? 'text-green-400 bg-green-400/10' : 'text-green-600 bg-green-50',
        purple: isNoir ? 'text-purple-400 bg-purple-400/10' : 'text-purple-600 bg-purple-50',
        yellow: isNoir ? 'text-yellow-400 bg-yellow-400/10' : 'text-yellow-600 bg-yellow-50',
    };

    const themeColor = colorMap[color] || colorMap.blue;

    return (
        <div className={`px-4 py-3 flex items-center justify-between backdrop-blur-md rounded-t-2xl border-b ${isNoir ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-white/60'}`}>
            <div className="flex items-center gap-2.5">
                {Icon && (
                    <div className={`p-1 rounded text-[10px] ${themeColor}`}>
                        <Icon size={12} strokeWidth={3} />
                    </div>
                )}
                <span className={`text-[13px] font-semibold tracking-wide ${isNoir ? 'text-gray-200' : 'text-gray-900'}`}>{title}</span>
            </div>
            <MoreHorizontal size={16} className={`${isNoir ? 'text-gray-600' : 'text-gray-400'}`} />
        </div>
    );
};

const NodeCard = ({ node, isNoir, onDrag, constraintsRef }) => {
    const isImageOnly = !node.title;
    const cardBg = isNoir
        ? (isImageOnly ? 'bg-white p-1.5' : 'bg-[#1e1e1e] border border-[#333]')
        : (isImageOnly ? 'bg-white p-2.5 shadow-xl' : 'bg-white border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]');

    return (
        <motion.div
            drag
            dragConstraints={constraintsRef}
            dragMomentum={false}
            onDrag={onDrag}
            initial={{ x: node.x, y: node.y }}
            className={`absolute rounded-2xl ${cardBg} flex flex-col cursor-grab active:cursor-grabbing`}
            style={{
                zIndex: 10,
                width: node.width || 280
            }}
        >
            <NodeHeader title={node.title} icon={node.icon} color={node.color} isNoir={isNoir} />

            <div className={`${isImageOnly ? '' : 'p-4'} flex-1 flex flex-col gap-3 pointer-events-none`}>

                {node.type === 'reference' && (
                    <img src={node.data.image} alt="Ref" draggable="false" className="w-full h-auto aspect-[3/4] object-cover rounded-xl select-none" />
                )}

                {node.type === 'chat' && (
                    <>
                        {node.data.input && (
                            <div className={`p-3 rounded-lg text-xs leading-relaxed ${isNoir ? 'bg-white/5 text-gray-400' : 'bg-orange-50/50 text-gray-600'}`}>
                                {node.data.input}
                            </div>
                        )}
                        {node.data.text && (
                            <div className={`text-[11px] leading-relaxed ${isNoir ? 'text-gray-400' : 'text-gray-600'}`}>
                                {node.data.text}
                            </div>
                        )}
                        {node.data.label && (
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${isNoir ? 'text-gray-500' : 'text-gray-400'}`}>{node.data.label}</span>
                            </div>
                        )}
                        {node.data.image && <img src={node.data.image} draggable="false" className="w-full h-40 object-cover rounded-lg" />}
                        {node.data.output && (
                            <div className={`text-[11px] leading-relaxed ${isNoir ? 'text-gray-300' : 'text-gray-700'}`}>
                                {node.data.output}
                            </div>
                        )}
                    </>
                )}

                {(node.type === 'generation' || node.type === '3d' || node.type === 'video') && (
                    <>
                        {node.data.label && (
                            <div className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider ${isNoir ? 'text-gray-500' : 'text-gray-400'}`}>
                                <span>{node.data.label}</span>
                            </div>
                        )}
                        <div className="flex gap-3">
                            {node.data.thumb && (
                                <img src={node.data.thumb} draggable="false" className="w-12 h-16 object-cover rounded-md opacity-80" />
                            )}
                            <div className="flex-1 relative group">
                                <img src={node.data.image} draggable="false" className="w-full h-auto aspect-[3/4] object-cover rounded-lg shadow-sm" />
                                {node.type === '3d' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Box className="text-white/90 drop-shadow-md" size={24} />
                                    </div>
                                )}
                                {node.type === 'video' && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-0.5"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {node.type === 'output' && (
                    <img src={node.data.image} draggable="false" className="w-full h-auto object-cover rounded-xl" />
                )}
            </div>

            <div className={`absolute left-0 top-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-[1.5px] z-20 ${isNoir ? 'bg-[#2D2D2D] border-gray-500' : 'bg-white border-gray-400'}`} />
            <div className={`absolute right-0 top-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full border-[1.5px] z-20 ${isNoir ? 'bg-[#2D2D2D] border-gray-500' : 'bg-white border-gray-400'}`} />

        </motion.div>
    );
};

const ConnectionLine = ({ start, end, isNoir, opacity = 1 }) => {
    const x1 = start.x;
    const y1 = start.y;
    const x2 = end.x;
    const y2 = end.y;

    const dist = Math.abs(x2 - x1);
    const cp1x = x1 + dist * 0.5;
    const cp1y = y1;
    const cp2x = x2 - dist * 0.5;
    const cp2y = y2;

    const pathData = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;

    return (
        <g opacity={opacity}>
            <path
                d={pathData}
                stroke={isNoir ? '#777' : '#94a3b8'}
                strokeWidth="2.5"
                fill="none"
            />
            <circle r="3" fill={isNoir ? '#fff' : '#2563eb'}>
                <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={pathData}
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                />
            </circle>
        </g>
    );
};

const Working = ({ currentTheme }) => {
    const isNoir = currentTheme === 'NOIR';
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(1920); // Default ref width

    useEffect(() => {
        // Adjust container ref width based on window to help centering if needed
        const updateWidth = () => setContainerWidth(window.innerWidth);
        window.addEventListener('resize', updateWidth);
        updateWidth();
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    const [nodePositions, setNodePositions] = useState(
        INITIAL_NODES.reduce((acc, node) => ({ ...acc, [node.id]: { x: node.x, y: node.y } }), {})
    );

    const getNodeHeight = (type) => {
        if (type === 'output') return 600;
        if (type === 'reference') return 300;
        return 350;
    };

    return (
        <section className={`relative w-full h-[1200px] md:h-[1000px] overflow-hidden ${isNoir ? 'bg-[#2D2D2D]' : 'bg-[#F9FAFB]'}`}>

            {/* Canvas Container
                Using w-full and flex with justify center to keep nodes in middle of screen 
                Using a fixed internal width for coordinate system consistency 
            */}
            <div ref={containerRef} className="relative w-full max-w-[1920px] mx-auto h-full p-4 md:p-10 scale-[0.6] md:scale-[0.8] xl:scale-100 origin-top-left md:origin-top-center">

                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                    {INITIAL_CONNECTIONS.map((conn, i) => {
                        const startNode = INITIAL_NODES.find(n => n.id === conn.from);
                        const endNode = INITIAL_NODES.find(n => n.id === conn.to);
                        if (!startNode || !endNode) return null;

                        const startPos = nodePositions[conn.from] || { x: startNode.x, y: startNode.y };
                        const endPos = nodePositions[conn.to] || { x: endNode.x, y: endNode.y };

                        const startPoint = {
                            x: startPos.x + (startNode.width || 280),
                            y: startPos.y + (getNodeHeight(startNode.type) / 2)
                        };

                        const endPoint = {
                            x: endPos.x,
                            y: endPos.y + (getNodeHeight(endNode.type) / 2)
                        };

                        return (
                            <ConnectionLine
                                key={i}
                                start={startPoint}
                                end={endPoint}
                                isNoir={isNoir}
                                opacity={conn.opacity}
                            />
                        );
                    })}
                </svg>

                {INITIAL_NODES.map(node => (
                    <NodeCard
                        key={node.id}
                        node={node}
                        isNoir={isNoir}
                        constraintsRef={containerRef}
                        onDrag={(event, info) => {
                            const newX = nodePositions[node.id].x + info.delta.x;
                            const newY = nodePositions[node.id].y + info.delta.y;
                            setNodePositions(prev => ({
                                ...prev,
                                [node.id]: { x: newX, y: newY }
                            }));
                        }}
                    />
                ))}

            </div>
        </section>
    );
};

export default Working;
