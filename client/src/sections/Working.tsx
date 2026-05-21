import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, MoreHorizontal } from 'lucide-react';

// --- Node Data Structure ---
// Compacted coordinates to fit within ~1500-1600px width for better screen fit
const INITIAL_NODES = [
    // --- Column 1 (Far Left) ---
    // Milan Cathedral (Top Left)
    {
        id: 'ref-1',
        type: 'custom-image',
        x: -2.333335876464844,
        y: 230,
        title: '',
        width: 284,
        data: { image: 'https://media.fuser.studio/4c8eec479251131c3d20413e95b9238f40bf024d18f4fe12f4d8e95511d42d7f-thumb-512.webp' }
    },
    // Yellow Tracksuit (Bottom Left)
    {
        id: 'ref-2',
        type: 'custom-image',
        x: 74.66667175292969,
        y: 640,
        title: '',
        width: 150,
        data: { image: 'https://media.fuser.studio/5263ae2ccf896505c02d98ca329b7268d0dec12c31893086e8b33dceebed8afa-thumb-256.webp' }
    },

    // --- Column 2 (Mid Left) ---
    // White/Ref Frame (Top) - Placeholder/Input
    {
        id: 'ref-3',
        type: 'custom-image',
        x: 375,
        y: 127,
        title: '',
        width: 221,
        data: { image: 'https://media.fuser.studio/8df77dc08efb54879f41319a37e51d519f5ae6c4c74f0b69fe0a10fc438ee45b-thumb-256.webp' }
    },
    // Guy in Blazer Sitting (Bottom)
    {
        id: 'ref-4',
        type: 'custom-image',
        x: 342.3333435058594,
        y: 513,
        title: '',
        width: 195,
        data: { image: 'https://media.fuser.studio/eba940cbb7197c8417b6448c37309f2f5da3c0fe7ff740aa5d8213d19a200d81-thumb-256.webp' }
    },

    // --- Column 3 (Center) ---
    // Gemini (Top)
    {
        id: 'gemini',
        type: 'GoogleGenerativeAIChatNode',
        x: 695.6666259765625,
        y: 48.333343505859375,
        title: 'Gemini Chat',
        width: 244,
        data: {
            label: 'Attachment',
            image: 'https://media.fuser.studio/f2d7f16f9d0e4367ce9b927e6f289af92e74b50bb53f3c8385b2dd9f601ce276-thumb-256.webp'
        }
    },
    // Claude (Bottom)
    {
        id: 'claude',
        type: 'AnthropicChatNode',
        x: 604.6666870117188,
        y: 455.00006103515625,
        title: 'Claude Chat',
        width: 260,
        data: {
            prompt: 'Rewrite the attached prompt to get clothing more like the attached reference images, return only the prompt, keep it specific yet concise, show the full body, style and material is like sculptural windbreakers ',
            label: 'Attachment',
            output: 'A full-body model poses in sculptural technical outerwear against a stark white background. The ensemble features a monochromatic dusty pink oversized technical windbreaker with dramatic exaggerated collar, voluminous balloon sleeves, and cinched drawstring waist creating architectural proportions. The technical nylon material has a matte finish with minimalist zip closures and elastic cuffs in the style of Phoebe Philo meets Nike. Paired with matching wide-leg technical pants and black leather shoes. Hair slicked back, serious expression, flat diffused lighting emphasizing the luxurious restraint and sculptural boldness of contemporary sportswear design with avant-garde functionality and clean geometric lines.'
        }
    },

    // --- Column 4 (Processing) ---
    // Rodin (Top)
    {
        id: 'rodin',
        type: 'FalRodinNode',
        x: 1029.6666259765625,
        y: 90.33334350585938,
        title: 'Rodin',
        width: 240,
        data: {
            imagesLabel: 'Images',
            image: 'https://plus.unsplash.com/premium_photo-1681396827663-7186fe34d402?q=80&w=1000&auto=format&fit=crop' // 3D render placeholder
        }
    },
    // Flux (Bottom)
    {
        id: 'flux',
        type: 'FalFluxKreaDevNode',
        x: 913.5387529687225,
        y: 452.00006103515625,
        title: 'Flux Krea Dev',
        width: 177,
        data: {
            promptLabel: 'Prompt',
            imagePromptLabel: 'Image Prompt',
            image: 'https://media.fuser.studio/344edd6013e88a52850a21337d6ffc327e12b9e51afb0d060d170ae01f6063c0-thumb-256.webp'
        }
    },

    // --- Column 5 (Output) ---
    // Veo (Video) - Now acting as final or near final
    {
        id: 'veo',
        type: 'FalVeoNode',
        x: 1121.9177263193399,
        y: 468.99993896484375,
        title: 'Veo',
        width: 177,
        data: {
            firstFrameLabel: 'First Frame',
            videoSrc: 'https://statics.fuser.studio/landing-new/fallbacks/v1.mp4'
        }
    },
    {
        id: 'video-node',
        type: 'VideoNode',
        x: 1324.3331298828125,
        y: 180,
        title: 'Video',
        width: 350,
        data: {
            videoSrc: 'https://statics.fuser.studio/landing-new/fallbacks/v0.mp4'
        }
    },

    // Total Width Used: ~1350 + 240 = ~1600px. Fits safely in 1920px.
];

const INITIAL_CONNECTIONS = [
    { from: 'ref-1', sourceHandle: 'right', to: 'gemini', targetHandle: 'in-attachment', opacity: 1 },
    { from: 'ref-1', sourceHandle: 'right', to: 'claude', targetHandle: 'in-attachment', opacity: 1 },
    { from: 'ref-2', sourceHandle: 'right', to: 'claude', targetHandle: 'in-prompt', opacity: 1 },
    { from: 'ref-3', sourceHandle: 'right', to: 'gemini', targetHandle: 'in-attachment', opacity: 1 },
    { from: 'ref-4', sourceHandle: 'right', to: 'claude', targetHandle: 'in-text', opacity: 1 },
    { from: 'ref-4', sourceHandle: 'right', to: 'flux', targetHandle: 'in-image-prompt', opacity: 1 },
    { from: 'gemini', sourceHandle: 'out', to: 'rodin', targetHandle: 'in-images', opacity: 1 },
    { from: 'claude', sourceHandle: 'out-text', to: 'flux', targetHandle: 'in-prompt', opacity: 1 },
    { from: 'flux', sourceHandle: 'out-image', to: 'veo', targetHandle: 'in-first-frame', opacity: 1 },
    { from: 'veo', sourceHandle: 'out-video', to: 'video-node', targetHandle: 'in-video', opacity: 1 }
];

const ConnectionLine = ({ start, end }) => {
    const deltaX = Math.abs(end.x - start.x);
    const controlPointX1 = start.x + deltaX * 0.5;
    const controlPointX2 = end.x - deltaX * 0.5;
    const path = `M ${start.x} ${start.y} C ${controlPointX1} ${start.y}, ${controlPointX2} ${end.y}, ${end.x} ${end.y}`;

    return (
        <svg style={{ zIndex: 0 }} className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
            <g className="react-flow__edge">
                <path
                    d={path}
                    fill="none"
                    style={{ strokeLinecap: 'round', strokeWidth: 1, stroke: 'rgba(115,115,115,0.8)' }}
                />
            </g>
        </svg>
    );
};

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

const NodeCard = ({ node, isNoir, isDraggable, isSelected, onSelect, onPositionChange }) => {
    const isImageOnly = !node.title;
    let cardBg = isNoir
        ? (isImageOnly ? 'bg-white p-1.5' : 'bg-[#1e1e1e] border border-[#333]')
        : (isImageOnly ? 'bg-white p-2.5 shadow-xl' : 'bg-white border border-gray-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]');

    if (node.type === 'custom-image' || node.type === 'GoogleGenerativeAIChatNode' || node.type === 'AnthropicChatNode' || node.type === 'FalFluxKreaDevNode' || node.type === 'FalRodinNode' || node.type === 'FalVeoNode' || node.type === 'VideoNode') {
        cardBg = 'bg-transparent';
    }

    return (
        <motion.div
            drag={isDraggable}
            dragMomentum={isDraggable ? false : undefined}
            onUpdate={isDraggable ? (latest) => {
                if (onPositionChange && typeof latest.x === 'number' && typeof latest.y === 'number') {
                    onPositionChange(node.id, latest.x, latest.y);
                }
            } : undefined}
            onClick={(e) => {
                e.stopPropagation();
                if (onSelect) onSelect(node.id);
            }}
            initial={{ x: node.x, y: node.y }}
            animate={{
                boxShadow: isSelected
                    ? '0 0 0 2px rgba(139,92,246,0.7), -15px -15px 40px rgba(139,92,246,0.4), 15px 15px 40px rgba(236,72,153,0.4), -30px 10px 60px rgba(139,92,246,0.15), 30px -10px 60px rgba(236,72,153,0.15)'
                    : '0 0 0 0px rgba(139,92,246,0)',
            }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className={`absolute rounded-2xl ${cardBg} flex flex-col ${isDraggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
            style={{
                zIndex: isSelected ? 20 : 10,
                width: node.width || 280
            }}
        >
            {node.type !== 'GoogleGenerativeAIChatNode' && node.type !== 'AnthropicChatNode' && node.type !== 'FalFluxKreaDevNode' && node.type !== 'FalRodinNode' && node.type !== 'FalVeoNode' && node.type !== 'VideoNode' && node.type !== 'custom-image' && (
                <NodeHeader title={node.title} icon={node.icon} color={node.color} isNoir={isNoir} />
            )}

            <div className={`${(isImageOnly || node.type === 'GoogleGenerativeAIChatNode' || node.type === 'AnthropicChatNode' || node.type === 'FalFluxKreaDevNode' || node.type === 'FalRodinNode' || node.type === 'FalVeoNode' || node.type === 'VideoNode' || node.type === 'custom-image') ? '' : 'p-4'} flex-1 flex flex-col gap-3 pointer-events-none`}>

                {node.type === 'reference' && (
                    <img src={node.data.image} alt="Ref" draggable="false" className="w-full h-auto aspect-[3/4] object-cover rounded-xl select-none" />
                )}

                {node.type === 'GoogleGenerativeAIChatNode' && (
                    <div className={`relative flex w-full flex-col space-y-2 font-sans text-xs select-none [&>*:last-child]:!rounded-b-2xl rounded-2xl p-1.5 outline-[0.125rem] outline-neutral-300/0 duration-300 shadow-xl border ${isNoir ? 'bg-neutral-950 text-neutral-200 border-white/5' : 'bg-[#FAFAFA] text-black border-gray-200'}`}>
                        <div className={`node-optimized relative flex flex-row items-center justify-between gap-2 p-0 font-semibold duration-300 ${isNoir ? 'bg-neutral-950 text-neutral-200' : 'bg-[#FAFAFA] text-black'}`}>
                            <div className="flex w-full max-w-full flex-row items-center gap-2 truncate">
                                <span className="contents">
                                    <button className={`cursor-pointer appearance-none rounded-md border text-center text-base font-medium duration-200 outline-none border-transparent bg-transparent flex items-center justify-end !bg-transparent p-0 ${isNoir ? 'text-neutral-200 hover:bg-neutral-800' : 'text-black hover:bg-gray-200'}`} type="button" tabIndex={-1}>
                                        <svg viewBox="0 0 256 262" width="100%" className="size-4"><path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path><path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path><path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path><path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path></svg>
                                    </button>
                                </span>
                                <div className="group/editable-text flex items-center justify-start break-words select-none h-4 w-auto max-w-full cursor-text truncate text-[1em]/[1rem] text-inherit">
                                    <span className="truncate">{node.title}</span>
                                </div>
                            </div>
                            <span className="contents">
                                <button className={`cursor-pointer appearance-none rounded-md border text-center text-base font-medium duration-200 border-transparent bg-transparent nodrag nopan flex items-center justify-end place-self-end p-0.5 ${isNoir ? 'text-neutral-500 hover:bg-neutral-800' : 'text-gray-400 hover:bg-gray-200'}`} type="button" tabIndex={-1}>
                                    <svg viewBox="0 0 16 16" width="1.2em" height="1.2em" className="min-size-4 size-4 animate-in duration-300 fade-in-0"><path fill="currentColor" d="M5.25 8a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0m4 0a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M12 9.25a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5"></path></svg>
                                </button>
                            </span>
                        </div>
                        <div className="flex cursor-default flex-col gap-4 !bg-transparent">
                            <div className={`relative flex flex-col duration-300 *:text-[0.625rem]/[0.75rem] ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                <div className="flex flex-col gap-2 duration-300">
                                    <div className="relative flex flex-row justify-between mt-2">
                                        <div className="group/item flex items-center gap-1 truncate whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-2 truncate ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                                <span className={`truncate text-[1em] font-normal ${isNoir ? 'text-neutral-400' : 'text-black'}`}>{node.data.label}</span>
                                            </span>
                                        </div>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -left-2 z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2"><div className="size-2 rounded-full border-slate-500 bg-slate-500 text-slate-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 h-4 group-hover:scale-150 flex items-center justify-center"><svg viewBox="0 0 18 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none h-4 w-2"><rect width="18" height="36" rx="9"></rect></svg></div></div></span>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -right-1.5 z-[60] flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 duration-300"><div className="size-2 rounded-full border-slate-500 bg-slate-500 text-slate-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] opacity-40 group-hover:opacity-100 flex items-center justify-center"><svg viewBox="0 0 43 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none h-2"><rect width="9" height="36" rx="4.5"></rect><path d="M40.2585 13.8777C43.2001 15.8388 43.2001 20.1612 40.2585 22.1223L20.7025 35.1596C17.4101 37.3545 13 34.9943 13 31.0373L13 4.96269C13 1.00566 17.4101 -1.35455 20.7025 0.840414L40.2585 13.8777Z"></path></svg></div></div></span>
                                    </div>
                                </div>
                            </div>
                            <div className={`relative flex flex-col duration-300 *:text-[0.625rem]/[0.75rem] ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                <div className="flex flex-col gap-2 duration-300">
                                    <div className="relative flex flex-row justify-between px-0">
                                        <div className="contents">
                                            <div className="contents">
                                                <div role="button" tabIndex={-1} aria-label="image preview" className="group relative z-0 flex w-full flex-col gap-2 rounded-lg ring-0 outline-none">
                                                    <div className="contents">
                                                        <div className="relative rounded-lg">
                                                            <img alt="Displaying input" className="node-optimized flex w-full h-auto object-cover rounded-lg ring-0 outline-none" draggable="false" src={node.data.image} style={{ backgroundImage: 'linear-gradient(45deg, rgba(128, 128, 128, 0.25) 25%, transparent 25%), linear-gradient(-45deg, rgba(128, 128, 128, 0.25) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(128, 128, 128, 0.25) 75%), linear-gradient(-45deg, transparent 75%, rgba(128, 128, 128, 0.25) 75%)', backgroundPosition: '0px 0px, 0px 10px, 10px -10px, -10px 0px', backgroundSize: '20px 20px' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="contents"><div className="node-optimized group absolute top-30 -right-1.5 z-[60] flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 duration-300"><div className="size-2 rounded-full border-green-500 bg-green-500 text-green-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] flex items-center justify-center"><svg viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><circle cx="18" cy="18" r="18"></circle></svg></div></div></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {node.type === 'AnthropicChatNode' && (
                    <div className={`relative flex w-full flex-col space-y-2 font-sans text-xs select-none [&>*:last-child]:!rounded-b-2xl rounded-2xl p-1.5 outline-[0.125rem] outline-neutral-300/0 duration-300 shadow-xl border ${isNoir ? 'bg-neutral-950 text-neutral-200 border-white/5' : 'bg-[#FAFAFA] text-black border-gray-200'}`}>
                        <div className={`node-optimized relative flex flex-row items-center justify-between gap-2 p-0 font-semibold duration-300 ${isNoir ? 'bg-neutral-950 text-neutral-200' : 'bg-[#FAFAFA] text-black'}`}>
                            <div className="flex w-full max-w-full flex-row items-center gap-2 truncate">
                                <span className="contents">
                                    <button className={`cursor-pointer appearance-none rounded-md border text-center text-base font-medium duration-200 outline-none border-transparent bg-transparent flex items-center justify-end !bg-transparent p-0 ${isNoir ? 'text-neutral-200 hover:bg-neutral-800' : 'text-black hover:bg-gray-200'}`} type="button" tabIndex={-1}>
                                        <svg viewBox="0 0 256 257" width="100%" className="size-4"><path fill="#d97757" d="m50.228 170.321l50.357-28.257l.843-2.463l-.843-1.361h-2.462l-8.426-.518l-28.775-.778l-24.952-1.037l-24.175-1.296l-6.092-1.297L0 125.796l.583-3.759l5.12-3.434l7.324.648l16.202 1.101l24.304 1.685l17.629 1.037l26.118 2.722h4.148l.583-1.685l-1.426-1.037l-1.101-1.037l-25.147-17.045l-27.22-18.017l-14.258-10.37l-7.713-5.25l-3.888-4.925l-1.685-10.758l7-7.713l9.397.649l2.398.648l9.527 7.323l20.35 15.75L94.817 91.9l3.889 3.24l1.555-1.102l.195-.777l-1.75-2.917l-14.453-26.118l-15.425-26.572l-6.87-11.018l-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0l10.63 1.426l4.472 3.888l6.61 15.101l10.694 23.786l16.591 32.34l4.861 9.592l2.592 8.879l.973 2.722h1.685v-1.556l1.36-18.211l2.528-22.36l2.463-28.776l.843-8.1l4.018-9.722l7.971-5.25l6.222 2.981l5.12 7.324l-.713 4.73l-3.046 19.768l-5.962 30.98l-3.889 20.739h2.268l2.593-2.593l10.499-13.934l17.628-22.036l7.778-8.749l9.073-9.657l5.833-4.601h11.018l8.1 12.055l-3.628 12.443l-11.342 14.388l-9.398 12.184l-13.48 18.147l-8.426 14.518l.778 1.166l2.01-.194l30.46-6.481l16.462-2.982l19.637-3.37l8.88 4.148l.971 4.213l-3.5 8.62l-20.998 5.184l-24.628 4.926l-36.682 8.685l-.454.324l.519.648l16.526 1.555l7.065.389h17.304l32.21 2.398l8.426 5.574l5.055 6.805l-.843 5.184l-12.962 6.611l-17.498-4.148l-40.83-9.721l-14-3.5h-1.944v1.167l11.666 11.406l21.387 19.314l26.767 24.887l1.36 6.157l-3.434 4.86l-3.63-.518l-23.526-17.693l-9.073-7.972l-20.545-17.304h-1.36v1.814l4.73 6.935l25.017 37.59l1.296 11.536l-1.814 3.76l-6.481 2.268l-7.13-1.297l-14.647-20.544l-15.1-23.138l-12.185-20.739l-1.49.843l-7.194 77.448l-3.37 3.953l-7.778 2.981l-6.48-4.925l-3.436-7.972l3.435-15.749l4.148-20.544l3.37-16.333l3.046-20.285l1.815-6.74l-.13-.454l-1.49.194l-15.295 20.999l-23.267 31.433l-18.406 19.702l-4.407 1.75l-7.648-3.954l.713-7.064l4.277-6.286l25.47-32.405l15.36-20.092l9.917-11.6l-.065-1.686h-.583L44.07 198.125l-12.055 1.555l-5.185-4.86l.648-7.972l2.463-2.593l20.35-13.999z"></path></svg>
                                    </button>
                                </span>
                                <div className="group/editable-text flex items-center justify-start break-words select-none h-4 w-auto max-w-full cursor-text truncate text-[1em]/[1rem] text-inherit">
                                    <span className="truncate">{node.title}</span>
                                </div>
                            </div>
                            <span className="contents">
                                <button className={`cursor-pointer appearance-none rounded-md border text-center text-base font-medium duration-200 border-transparent bg-transparent nodrag nopan flex items-center justify-end place-self-end p-0.5 ${isNoir ? 'text-neutral-500 hover:bg-neutral-800' : 'text-gray-400 hover:bg-gray-200'}`} type="button" tabIndex={-1}>
                                    <svg viewBox="0 0 16 16" width="1.2em" height="1.2em" className="min-size-4 size-4 animate-in duration-300 fade-in-0"><path fill="currentColor" d="M5.25 8a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0m4 0a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M12 9.25a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5"></path></svg>
                                </button>
                            </span>
                        </div>
                        <div className="flex cursor-default flex-col gap-4 !bg-transparent">
                            <div className={`relative flex flex-col duration-300 *:text-[0.625rem]/[0.75rem] ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                <div className="flex flex-col gap-2 duration-300">
                                    <div className="relative flex flex-row justify-between px-0">
                                        <div className="flex w-full flex-col gap-2">
                                            <div className={`h-auto w-full rounded-md px-2 py-4 border-none relative ${isNoir ? 'bg-neutral-800' : 'bg-gray-100'}`}>
                                                <textarea className={`node-optimized better-scrollbar block w-full bg-transparent px-1 py-0 text-[1em] !scrollbar-w-1 field-sized !h-auto max-h-40 min-h-3 resize-none pointer-events-none ${isNoir ? 'text-neutral-50' : 'text-black'}`} placeholder="Prompt" readOnly tabIndex={-1} value={node.data.prompt} />
                                            </div>
                                        </div>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -left-1.5 z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2"><div className="size-2 rounded-full border-amber-500 bg-amber-500 text-amber-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] opacity-80 group-hover:opacity-100 flex items-center justify-center"><svg viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><circle cx="18" cy="18" r="18"></circle></svg></div></div></span>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -right-1.5 z-[60] flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 duration-300"><div className="size-2 rounded-full border-amber-500 bg-amber-500 text-amber-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] opacity-40 group-hover:opacity-100 flex items-center justify-center"><svg viewBox="0 0 30 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><path d="M27.2585 13.8777C30.2001 15.8388 30.2001 20.1612 27.2585 22.1223L7.70254 35.1596C4.4101 37.3545 -1.72967e-07 34.9943 0 31.0373L1.13976e-06 4.96269C1.31272e-06 1.00566 4.4101 -1.35455 7.70254 0.840414L27.2585 13.8777Z"></path></svg></div></div></span>
                                    </div>
                                    <div className="relative flex flex-row justify-between">
                                        <div className="group/item flex items-center gap-1 truncate whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-2 truncate ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                                <span className={`truncate text-[1em] font-normal ${isNoir ? 'text-neutral-400' : 'text-black'}`}>{node.data.label}</span>
                                            </span>
                                        </div>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -left-2 z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2"><div className="size-2 rounded-full border-slate-500 bg-slate-500 text-slate-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 h-4 group-hover:scale-150 flex items-center justify-center"><svg viewBox="0 0 18 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none h-4 w-2"><rect width="18" height="36" rx="9"></rect></svg></div></div></span>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -right-1.5 z-[60] flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 duration-300"><div className="size-2 rounded-full border-slate-500 bg-slate-500 text-slate-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] opacity-40 group-hover:opacity-100 flex items-center justify-center"><svg viewBox="0 0 43 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none h-2"><rect width="9" height="36" rx="4.5"></rect><path d="M40.2585 13.8777C43.2001 15.8388 43.2001 20.1612 40.2585 22.1223L20.7025 35.1596C17.4101 37.3545 13 34.9943 13 31.0373L13 4.96269C13 1.00566 17.4101 -1.35455 20.7025 0.840414L40.2585 13.8777Z"></path></svg></div></div></span>
                                    </div>
                                </div>
                            </div>
                            <div className={`relative flex flex-col duration-300 *:text-[0.625rem]/[0.75rem] ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                <div className="flex flex-col gap-2 duration-300">
                                    <div className="relative flex flex-row justify-between">
                                        <div className={`p-3 rounded-lg text-[6.5px] leading-relaxed w-full ${isNoir ? 'bg-white/5 text-gray-400' : 'bg-orange-50/50 text-gray-600'}`}>
                                            A full-body model poses in sculptural technical outerwear against a stark white background. The ensemble features a monochromatic dusty pink oversized technical windbreaker with dramatic exaggerated collar, voluminous balloon sleeves, and cinched drawstring waist creating architectural proportions. The technical nylon material has a matte finish with minimalist zip closures and elastic cuffs in the style of Phoebe Philo meets Nike. Paired with matching wide-leg technical pants and black leather shoes. Hair slicked back, serious expression, flat diffused lighting emphasizing the luxurious restraint and sculptural boldness of contemporary sportswear design with avant-garde functionality and clean geometric lines.
                                        </div>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -left-1.5 z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2"><div className="size-2 rounded-full border-blue-500 bg-blue-500 text-blue-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] opacity-80 group-hover:opacity-100 flex items-center justify-center"><svg viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><circle cx="18" cy="18" r="18"></circle></svg></div></div></span>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -right-1.5 z-[60] flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 duration-300"><div className="size-2 rounded-full border-amber-500 bg-amber-500 text-amber-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] flex items-center justify-center"><svg viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><circle cx="18" cy="18" r="18"></circle></svg></div></div></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {node.type === 'FalFluxKreaDevNode' && (
                    <div className={`relative flex w-full flex-col space-y-2 font-sans text-xs select-none [&>*:last-child]:!rounded-b-2xl rounded-2xl p-1.5 outline-[0.125rem] outline-neutral-300/0 duration-300 shadow-xl border ${isNoir ? 'bg-neutral-950 text-neutral-200 border-white/5' : 'bg-[#FAFAFA] text-black border-gray-200'}`}>
                        <div className={`node-optimized relative flex flex-row items-center justify-between gap-2 p-0 font-semibold duration-300 ${isNoir ? 'bg-neutral-950 text-neutral-200' : 'bg-[#FAFAFA] text-black'}`}>
                            <div className="flex w-full max-w-full flex-row items-center gap-2 truncate">
                                <span className="contents">
                                    <button className={`cursor-pointer appearance-none rounded-md border text-center text-base font-medium duration-200 outline-none border-transparent bg-transparent flex items-center justify-end !bg-transparent p-0 ${isNoir ? 'text-neutral-200 hover:bg-neutral-800' : 'text-black hover:bg-gray-200'}`} type="button" tabIndex={-1}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" className="size-4"><path fill="currentColor" d="M5.518 14.81c.789.724 1.62 1.167 2.703 1.24l.29.01c1.412.048 2.608 1.004 2.883 2.392.408 2.053-1.39 3.87-3.45 3.5a2.99 2.99 0 0 1-2.396-2.393 5 5 0 0 1-.044-.564v-4.18q0-.018.014-.006M16.29 12.85q.04-.038.074.007c.241.33.495.683.697 1.02a10 10 0 0 1 1.415 4.512q.033.49.02.756a2.977 2.977 0 0 1-2.954 2.85 2.974 2.974 0 0 1-2.94-2.396c-.065-.332-.045-.791-.099-1.142q-.252-1.619-1.53-2.62l-.022-.012a.04.04 0 0 1-.018-.018v-.012l.003-.003.006-.003a11.2 11.2 0 0 0 5.348-2.939M12.61 4.358c.4-1.86 2.463-2.904 4.195-2.064a2.98 2.98 0 0 1 1.657 2.258q.045.305.03.755c-.196 5.39-4.65 9.705-10.068 9.66l-.186-.006c-1.907-.137-3.236-2.11-2.56-3.96.196-.529.53-.99.964-1.334a2.9 2.9 0 0 1 1.497-.614c.343-.037.755-.027 1.085-.09a4.07 4.07 0 0 0 3.272-3.374c.059-.378.027-.83.114-1.231"></path><path fill="currentColor" d="M8.258 2.015a2.977 2.977 0 0 1 3.17 2.585c.192 1.488-.792 2.927-2.271 3.264-.37.085-.784.06-1.177.112-.93.113-1.794.55-2.453 1.236l-.007.004H5.51l-.005-.006-.002-.007q0-.008.003-.015a.04.04 0 0 0 .007-.02 418 418 0 0 1-.01-4.191 2.966 2.966 0 0 1 2.754-2.962"></path></svg>
                                    </button>
                                </span>
                                <div className="group/editable-text flex items-center justify-start break-words select-none h-4 w-auto max-w-full cursor-text truncate text-[1em]/[1rem] text-inherit">
                                    <span className="truncate">{node.title}</span>
                                </div>
                            </div>
                            <span className="contents">
                                <button className={`cursor-pointer appearance-none rounded-md border text-center text-base font-medium duration-200 border-transparent bg-transparent nodrag nopan flex items-center justify-end place-self-end p-0.5 ${isNoir ? 'text-neutral-500 hover:bg-neutral-800' : 'text-gray-400 hover:bg-gray-200'}`} type="button" tabIndex={-1}>
                                    <svg viewBox="0 0 16 16" width="1.2em" height="1.2em" className="min-size-4 size-4 animate-in duration-300 fade-in-0"><path fill="currentColor" d="M5.25 8a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0m4 0a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M12 9.25a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5"></path></svg>
                                </button>
                            </span>
                        </div>
                        <div className="flex cursor-default flex-col gap-2.5 !bg-transparent">
                            <div className={`relative flex flex-col duration-300 *:text-[0.625rem]/[0.75rem] ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                <div className="flex flex-col gap-0 duration-300">
                                    <div className="relative flex flex-row justify-between px-1">
                                        <div className="group/item flex items-center gap-1 truncate whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-2 truncate ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                                <span className={`truncate text-[0.85em] font-normal ${isNoir ? 'text-neutral-400' : 'text-gray-400'}`}>{node.data.promptLabel}</span>
                                            </span>
                                        </div>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -left-1.5 z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2"><div className="size-2 rounded-full border-amber-500 bg-amber-500 text-amber-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] flex items-center justify-center"><svg viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><circle cx="18" cy="18" r="18"></circle></svg></div></div></span>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -right-1.5 z-[60] flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 duration-300"><div className="size-2 rounded-full border-amber-500 bg-amber-500 text-amber-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] opacity-40 group-hover:opacity-100 flex items-center justify-center"><svg viewBox="0 0 30 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><path d="M27.2585 13.8777C30.2001 15.8388 30.2001 20.1612 27.2585 22.1223L7.70254 35.1596C4.4101 37.3545 -1.72967e-07 34.9943 0 31.0373L1.13976e-06 4.96269C1.31272e-06 1.00566 4.4101 -1.35455 7.70254 0.840414L27.2585 13.8777Z"></path></svg></div></div></span>
                                    </div>
                                    <div className="relative flex flex-row justify-between px-1 mt-1">
                                        <div className="flex w-full flex-col gap-2">
                                            <div className="group/item flex items-center gap-1 truncate whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-2 truncate ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                                    <span className={`truncate text-[0.85em] font-normal ${isNoir ? 'text-neutral-400' : 'text-gray-400'}`}>{node.data.imagePromptLabel}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -left-1.5 z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2"><div className="size-2 rounded-full border-green-500 bg-green-500 text-green-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] flex items-center justify-center"><svg viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><circle cx="18" cy="18" r="18"></circle></svg></div></div></span>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -right-1.5 z-[60] flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 duration-300"><div className="size-2 rounded-full border-green-500 bg-green-500 text-green-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] opacity-40 group-hover:opacity-100 flex items-center justify-center"><svg viewBox="0 0 30 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><path d="M27.2585 13.8777C30.2001 15.8388 30.2001 20.1612 27.2585 22.1223L7.70254 35.1596C4.4101 37.3545 -1.72967e-07 34.9943 0 31.0373L1.13976e-06 4.96269C1.31272e-06 1.00566 4.4101 -1.35455 7.70254 0.840414L27.2585 13.8777Z"></path></svg></div></div></span>
                                    </div>
                                </div>
                            </div>
                            <div className={`relative flex flex-col duration-300 *:text-[0.625rem]/[0.75rem] ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                <div className="flex flex-col gap-2 duration-300">
                                    <div className="relative flex flex-row justify-between px-0">
                                        <div className="contents">
                                            <div className="contents">
                                                <div role="button" tabIndex={-1} aria-label="image preview" className="group relative z-0 flex w-full flex-col gap-2 rounded-lg ring-0 outline-none">
                                                    <div className="contents">
                                                        <div className="relative rounded-lg">
                                                            <img alt="Displaying input" className="node-optimized flex w-full rounded-lg ring-0 outline-none" draggable="true" src={node.data.image} style={{ backgroundImage: 'linear-gradient(45deg, rgba(128, 128, 128, 0.25) 25%, transparent 25%), linear-gradient(-45deg, rgba(128, 128, 128, 0.25) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(128, 128, 128, 0.25) 75%), linear-gradient(-45deg, transparent 75%, rgba(128, 128, 128, 0.25) 75%)', backgroundPosition: '0px 0px, 0px 10px, 10px -10px, -10px 0px', backgroundSize: '20px 20px' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -right-1.5 z-[60] flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 duration-300"><div className="size-2 rounded-full border-green-500 bg-green-500 text-green-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] flex items-center justify-center"><svg viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><circle cx="18" cy="18" r="18"></circle></svg></div></div></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {node.type === 'FalRodinNode' && (
                    <div className={`relative flex w-full flex-col space-y-2 font-sans text-xs select-none [&>*:last-child]:!rounded-b-2xl rounded-2xl p-1.5 outline-[0.125rem] outline-neutral-300/0 duration-300 shadow-xl border ${isNoir ? 'bg-neutral-950 text-neutral-200 border-white/5' : 'bg-[#FAFAFA] text-black border-gray-200'}`}>
                        <div className={`node-optimized relative flex flex-row items-center justify-between gap-2 p-0 font-semibold duration-300 ${isNoir ? 'bg-neutral-950 text-neutral-200' : 'bg-[#FAFAFA] text-black'}`}>
                            <div className="flex w-full max-w-full flex-row items-center gap-2 truncate">
                                <span className="contents">
                                    <button className={`cursor-pointer appearance-none rounded-md border text-center text-base font-medium duration-200 outline-none border-transparent bg-transparent flex items-center justify-end !bg-transparent p-0 ${isNoir ? 'text-neutral-200 hover:bg-neutral-800' : 'text-black hover:bg-gray-200'}`} type="button" tabIndex={-1}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" className="size-4"><path fill="currentColor" d="M19.297 8.571c2.017 1.994 3.62 5.947 2.103 8.619-1.29 2.272-4.658 1.39-4.641-1.354.007-1.112.61-1.971 1.05-2.93.775-1.693.889-3.627.173-5.364.064-.06.524.313.608.377.26.2.482.427.71.652zM8.375 18.892c.776.883 2.029 1.694 3.165 2.012.246.068.546.092.8.166.04.011.128-.002.093.073-.03.063-.669.304-.787.346-2.84 1.024-7.246.582-9.123-2.023-1.513-2.102.504-4.792 2.95-3.77 1.449.606 1.95 2.11 2.902 3.196M3.75 8.936c-.22.203-.424.518-.624.695-.05.044-.118.09-.19.083.048-.25.048-.517.09-.768.341-2.083 1.642-4.307 3.318-5.6C7.465 2.48 9.28 1.605 10.691 2.19c1.842.766 2.063 3.12.436 4.281-1.308.933-2.75.577-4.206.874-1.101.222-2.342.835-3.169 1.592zM9.366 13.166c.044-.141.49-.022.607-.02 1.28.039 2.483-.228 3.47-1.064.07-.059.1-.233.245-.142.065.04.055.618.05.727-.119 2.339-2.012 3.808-4.318 3.226a.4.4 0 0 1-.054-.093z"></path><path fill="currentColor" d="M15.794 17.74c.085.086-.46 1.004-.554 1.141-.426.624-1.138 1.339-1.786 1.735-.256.155-.307.19-.625.177-1.558-.068-3.258-1.041-4.263-2.194-.244-.28-.53-.666-.672-1.004.032-.06.103.007.14.029.178.107.348.27.536.385 2.068 1.255 4.764 1.376 6.8 0 .073-.05.362-.33.424-.268zM8.23 7.582c.015.073-.033.108-.086.144-.272.178-.689.309-1.001.509-1.798 1.144-3.078 3.31-2.944 5.47.01.158.084.342.084.5 0 .062.027.122-.064.105-.217-.088-.806-1.261-.906-1.525-.171-.452-.545-1.892-.386-2.308.055-.148.435-.627.557-.773C4.596 8.382 6.49 7.523 8.23 7.58zM17.222 13.268c-.07.011-.045-.102-.043-.148.027-.402.109-.75.087-1.17-.114-2.29-1.44-4.496-3.563-5.44-.111-.05-.31-.026-.303-.178.995-.2 2.118-.034 3.065.314.18.065.789.327.903.44.105.103.385.8.445.978.568 1.689.332 3.688-.59 5.204M11.55 12.679c.178-.227.42-.31.606-.546.673-.858.418-2.22-.437-2.86-.02-.086.045-.071.105-.064.148.018.552.296.687.402.566.441 1.004 1.156 1.1 1.875-.527.562-1.267 1.096-2.06 1.191z"></path></svg>
                                    </button>
                                </span>
                                <div className="group/editable-text flex items-center justify-start break-words select-none h-4 w-auto max-w-full cursor-text truncate text-[1em]/[1rem] text-inherit">
                                    <span className="truncate">{node.title}</span>
                                </div>
                            </div>
                            <span className="contents">
                                <button className={`cursor-pointer appearance-none rounded-md border text-center text-base font-medium duration-200 border-transparent bg-transparent nodrag nopan flex items-center justify-end place-self-end p-0.5 ${isNoir ? 'text-neutral-500 hover:bg-neutral-800' : 'text-gray-400 hover:bg-gray-200'}`} type="button" tabIndex={-1}>
                                    <svg viewBox="0 0 16 16" width="1.2em" height="1.2em" className="min-size-4 size-4 animate-in duration-300 fade-in-0"><path fill="currentColor" d="M5.25 8a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0m4 0a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M12 9.25a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5"></path></svg>
                                </button>
                            </span>
                        </div>
                        <div className="flex cursor-default flex-col gap-2.5 !bg-transparent">
                            <div className={`relative flex flex-col duration-300 *:text-[0.625rem]/[0.75rem] ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                <div className="flex flex-col gap-2 duration-300">
                                    <div className="relative flex flex-row justify-between px-1">
                                        <div className="flex w-full flex-row items-center justify-between gap-2">
                                            <div className="group/item flex items-center gap-1 truncate whitespace-nowrap shrink-0">
                                                <span className={`inline-flex items-center gap-2 truncate ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                                    <span className={`truncate text-[0.85em] font-medium ${isNoir ? 'text-neutral-400' : 'text-gray-400'}`}>{node.data.imagesLabel}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -left-2 z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2"><div className="size-2 rounded-full border-green-500 bg-green-500 text-green-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 h-4 group-hover:scale-150 flex items-center justify-center"><svg viewBox="0 0 18 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none h-4 w-2"><rect width="18" height="36" rx="9"></rect></svg></div></div></span>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -right-1.5 z-[60] flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 duration-300"><div className="size-2 rounded-full border-green-500 bg-green-500 text-green-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] opacity-40 group-hover:opacity-100 flex items-center justify-center"><svg viewBox="0 0 43 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none h-2"><rect width="9" height="36" rx="4.5"></rect><path d="M40.2585 13.8777C43.2001 15.8388 43.2001 20.1612 40.2585 22.1223L20.7025 35.1596C17.4101 37.3545 13 34.9943 13 31.0373L13 4.96269C13 1.00566 17.4101 -1.35455 20.7025 0.840414L40.2585 13.8777Z"></path></svg></div></div></span>
                                    </div>
                                </div>
                            </div>
                            <div className={`relative flex flex-col duration-300 *:text-[0.625rem]/[0.75rem] ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                <div className="flex flex-col gap-2 duration-300">
                                    <div className="relative flex flex-row justify-between px-0">
                                        <div className="contents">
                                            <div className="contents">
                                                <div role="button" tabIndex={-1} aria-label="mesh preview" className="group relative z-0 flex w-full flex-col gap-2 rounded-lg ring-0 outline-none">
                                                    <div className={`relative rounded-lg aspect-[3/4] overflow-hidden ${isNoir ? 'bg-neutral-800' : 'bg-gray-200'}`}>
                                                        <div className={`nopan nodrag nowheel relative z-0 size-full overflow-hidden rounded-md object-cover ${isNoir ? 'bg-neutral-950' : 'bg-gray-100'}`}>
                                                            <div className={`z-0 size-full overflow-hidden rounded-md ${isNoir ? 'bg-neutral-950' : 'bg-gray-100'}`} style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'auto', touchAction: 'none' }}>
                                                                <div style={{ width: '100%', height: '100%' }}>
                                                                    <img src={node.data.image} alt="3D Model Preview" className="w-full h-full object-cover" />
                                                                </div>
                                                            </div>
                                                            <div className={`absolute right-0 bottom-0 z-10 m-2 mx-3 rounded-full ${isNoir ? 'text-[#fff]/80' : 'text-black/60'}`}>
                                                                <svg viewBox="0 0 24 24" width="1.2em" height="1.2em" className="size-8"><path fill="currentColor" d="M12 7C6.5 7 2 9.2 2 12c0 2.2 2.9 4.1 7 4.8V20l4-4l-4-4v2.7c-3.2-.6-5-1.9-5-2.7c0-1.1 3-3 8-3s8 1.9 8 3c0 .7-1.5 1.9-4 2.5v2.1c3.5-.8 6-2.5 6-4.6c0-2.8-4.5-5-10-5"></path></svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="contents"><div className="node-optimized group absolute top-30 -right-1.5 z-[60] flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 duration-300"><div className="size-2 rounded-full border-rose-500 bg-rose-500 text-rose-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] opacity-80 group-hover:opacity-100 flex items-center justify-center"><svg viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><circle cx="18" cy="18" r="18"></circle></svg></div></div></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {node.type === 'FalVeoNode' && (
                    <div className={`relative flex w-full flex-col space-y-2 font-sans text-xs select-none [&>*:last-child]:!rounded-b-2xl rounded-2xl p-1.5 outline-[0.125rem] outline-neutral-300/0 duration-300 shadow-xl border ${isNoir ? 'bg-neutral-950 text-neutral-200 border-white/5' : 'bg-[#FAFAFA] text-black border-gray-200'}`}>
                        <div className={`node-optimized relative flex flex-row items-center justify-between gap-2 p-0 font-semibold duration-300 ${isNoir ? 'bg-neutral-950 text-neutral-200' : 'bg-[#FAFAFA] text-black'}`}>
                            <div className="flex w-full max-w-full flex-row items-center gap-2 truncate">
                                <span className="contents">
                                    <button className={`cursor-pointer appearance-none rounded-md border text-center text-base font-medium duration-200 outline-none border-transparent bg-transparent flex items-center justify-end !bg-transparent p-0 ${isNoir ? 'text-neutral-200 hover:bg-neutral-800' : 'text-black hover:bg-gray-200'}`} type="button" tabIndex={-1}>
                                        <svg viewBox="0 0 256 262" width="100%" className="size-4"><path fill="#4285f4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path><path fill="#34a853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path><path fill="#fbbc05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path><path fill="#eb4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path></svg>
                                    </button>
                                </span>
                                <div className="group/editable-text flex items-center justify-start break-words select-none h-4 w-auto max-w-full cursor-text truncate text-[1em]/[1rem] text-inherit">
                                    <span className="truncate">{node.title}</span>
                                </div>
                            </div>
                            <span className="contents">
                                <button className={`cursor-pointer appearance-none rounded-md border text-center text-base font-medium duration-200 border-transparent bg-transparent nodrag nopan flex items-center justify-end place-self-end p-0.5 ${isNoir ? 'text-neutral-500 hover:bg-neutral-800' : 'text-gray-400 hover:bg-gray-200'}`} type="button" tabIndex={-1}>
                                    <svg viewBox="0 0 16 16" width="1.2em" height="1.2em" className="min-size-4 size-4 animate-in duration-300 fade-in-0"><path fill="currentColor" d="M5.25 8a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0m4 0a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M12 9.25a1.25 1.25 0 1 0 0-2.5a1.25 1.25 0 0 0 0 2.5"></path></svg>
                                </button>
                            </span>
                        </div>
                        <div className="flex cursor-default flex-col gap-2.5 !bg-transparent">
                            <div className={`relative flex flex-col duration-300 *:text-[0.625rem]/[0.75rem] ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                <div className="flex flex-col gap-2 duration-300">
                                    <div className="relative flex flex-row justify-between px-1">
                                        <div className="flex w-full flex-col gap-2">
                                            <div className="group/item flex items-center gap-1 truncate whitespace-nowrap">
                                                <span className={`inline-flex items-center gap-2 truncate ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                                    <span className={`truncate text-[0.85em] font-medium ${isNoir ? 'text-neutral-400' : 'text-gray-400'}`}>{node.data.firstFrameLabel}</span>
                                                </span>
                                            </div>
                                        </div>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -left-1.5 z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2"><div className="size-2 rounded-full border-green-500 bg-green-500 text-green-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] flex items-center justify-center"><svg viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><circle cx="18" cy="18" r="18"></circle></svg></div></div></span>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -right-1.5 z-[60] flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 duration-300"><div className="size-2 rounded-full border-green-500 bg-green-500 text-green-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] opacity-40 group-hover:opacity-100 flex items-center justify-center"><svg viewBox="0 0 30 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><path d="M27.2585 13.8777C30.2001 15.8388 30.2001 20.1612 27.2585 22.1223L7.70254 35.1596C4.4101 37.3545 -1.72967e-07 34.9943 0 31.0373L1.13976e-06 4.96269C1.31272e-06 1.00566 4.4101 -1.35455 7.70254 0.840414L27.2585 13.8777Z"></path></svg></div></div></span>
                                    </div>
                                </div>
                            </div>
                            <div className={`relative flex flex-col duration-300 *:text-[0.625rem]/[0.75rem] ${isNoir ? 'text-neutral-400' : 'text-black'}`}>
                                <div className="flex flex-col gap-2 duration-300">
                                    <div className="relative flex flex-row justify-between px-0">
                                        <div className="contents">
                                            <div className="contents">
                                                <div role="button" tabIndex={-1} aria-label="video preview" className="group relative z-0 flex w-full flex-col gap-2 rounded-lg ring-0 outline-none">
                                                    <div className="contents">
                                                        <div className="group/video relative rounded-lg">
                                                            <div className="group/player relative w-full overflow-hidden node-optimized flex rounded-lg ring-0 outline-none">
                                                                <video controlsList="nofullscreen" loop playsInline className="w-full object-cover" draggable="true" autoPlay muted style={{ aspectRatio: '9 / 16', backgroundImage: 'linear-gradient(45deg, rgba(128, 128, 128, 0.25) 25%, transparent 25%), linear-gradient(-45deg, rgba(128, 128, 128, 0.25) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(128, 128, 128, 0.25) 75%), linear-gradient(-45deg, transparent 75%, rgba(128, 128, 128, 0.25) 75%)', backgroundPosition: '0px 0px, 0px 10px, 10px -10px, -10px 0px', backgroundSize: '20px 20px' }}>
                                                                    <source src={node.data.videoSrc} type="video/mp4" />
                                                                    <source src="https://statics.fuser.studio/landing-new/fallbacks/v1.webm" type="video/webm" />
                                                                    <source src="https://statics.fuser.studio/landing-new/fallbacks/v1.ogv" type="video/ogv" />
                                                                    <track kind="captions" />
                                                                </video>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -right-1.5 z-[60] flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 duration-300"><div className="size-2 rounded-full border-blue-500 bg-blue-500 text-blue-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] opacity-80 group-hover:opacity-100 flex items-center justify-center"><svg viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><circle cx="18" cy="18" r="18"></circle></svg></div></div></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {node.type === 'VideoNode' && (
                    <div className={`relative flex w-full flex-col space-y-2 font-sans text-xs select-none [&>*:last-child]:!rounded-b-2xl rounded-2xl p-1.5 outline-[0.125rem] outline-neutral-300/0 duration-300 shadow-xl border ${isNoir ? 'bg-neutral-950 text-neutral-200 border-white/5' : 'bg-[#FAFAFA] text-black border-gray-200'}`}>
                        <div className="flex cursor-default flex-col gap-4 !bg-transparent [&_.react-flow__handle]:!pointer-events-none">
                            <div className="relative flex flex-col text-neutral-400 duration-300 *:text-[0.625rem]/[0.75rem] empty:hidden bg-transparent p-0">
                                <div className="flex flex-col gap-2 duration-300 empty:hidden py-0">
                                    <div className="relative flex flex-row justify-between px-0">
                                        <div className="contents">
                                            <div className="contents">
                                                <div role="button" tabIndex={-1} aria-label="video preview" className="group relative z-0 flex w-full flex-col gap-2 rounded-lg ring-0 outline-none">
                                                    <div className="contents">
                                                        <div className="group/video relative rounded-lg">
                                                            <div className="group/player relative w-full overflow-hidden node-optimized flex rounded-lg ring-0 outline-none">
                                                                <video controlsList="nofullscreen" loop playsInline className="w-full object-cover" draggable="true" autoPlay muted style={{ aspectRatio: '9 / 16', backgroundImage: 'linear-gradient(45deg, rgba(128, 128, 128, 0.25) 25%, transparent 25%), linear-gradient(-45deg, rgba(128, 128, 128, 0.25) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(128, 128, 128, 0.25) 75%), linear-gradient(-45deg, transparent 75%, rgba(128, 128, 128, 0.25) 75%)', backgroundPosition: '0px 0px, 0px 10px, 10px -10px, -10px 0px', backgroundSize: '20px 20px' }}>
                                                                    <source src={node.data.videoSrc} type="video/mp4" />
                                                                    <source src="https://statics.fuser.studio/landing-new/fallbacks/v0.webm" type="video/webm" />
                                                                    <source src="https://statics.fuser.studio/landing-new/fallbacks/v0.ogv" type="video/ogv" />
                                                                    <track kind="captions" />
                                                                </video>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -left-1.5 z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2"><div className="size-2 rounded-full border-blue-500 bg-blue-500 text-blue-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] opacity-80 group-hover:opacity-100 flex items-center justify-center"><svg viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><circle cx="18" cy="18" r="18"></circle></svg></div></div></span>
                                        <span className="contents"><div className="node-optimized group absolute top-1/2 -right-1.5 z-[60] flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2 duration-300"><div className="size-2 rounded-full border-blue-500 bg-blue-500 text-blue-500 !relative !inset-x-[unset] !top-[unset] !m-0 !transform-none !bg-transparent duration-0 group-hover:scale-[2] opacity-40 group-hover:opacity-100 flex items-center justify-center"><svg viewBox="0 0 30 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none size-2"><path d="M27.2585 13.8777C30.2001 15.8388 30.2001 20.1612 27.2585 22.1223L7.70254 35.1596C4.4101 37.3545 -1.72967e-07 34.9943 0 31.0373L1.13976e-06 4.96269C1.31272e-06 1.00566 4.4101 -1.35455 7.70254 0.840414L27.2585 13.8777Z"></path></svg></div></div></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {node.type === 'custom-image' && (
                    <div className={`relative flex w-full flex-col space-y-2 font-sans text-xs text-neutral-200 select-none [&>*:last-child]:!rounded-b-2xl rounded-2xl p-1.5 outline-[0.125rem] outline-neutral-300/0 duration-300 ${isNoir ? 'bg-neutral-950' : 'bg-[#FAFAFA] shadow-xl border border-gray-100'}`}>
                        <div className="flex cursor-default flex-col gap-4 !bg-transparent [&_.react-flow__handle]:!pointer-events-none">
                            <div className="relative flex flex-col text-neutral-400 duration-300 *:text-[0.625rem]/[0.75rem] empty:hidden bg-transparent p-0">
                                <div className="flex flex-col gap-2 duration-300 empty:hidden py-0">
                                    <div className="relative flex flex-row justify-between px-0">
                                        <div className="contents">
                                            <div className="contents">
                                                <div role="button" tabIndex={-1} aria-label="image preview" className="group relative z-0 flex w-full flex-col gap-2 rounded-lg ring-0 outline-none">
                                                    <div className="contents">
                                                        <div className="relative rounded-lg">
                                                            <img
                                                                alt="Displaying input"
                                                                className="flex w-full rounded-lg ring-0 outline-none aspect-[3/4] object-cover"
                                                                draggable="false"
                                                                src={node.data.image}
                                                                style={{
                                                                    backgroundImage: 'linear-gradient(45deg, rgba(128, 128, 128, 0.25) 25%, transparent 25%), linear-gradient(-45deg, rgba(128, 128, 128, 0.25) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(128, 128, 128, 0.25) 75%), linear-gradient(-45deg, transparent 75%, rgba(128, 128, 128, 0.25) 75%)',
                                                                    backgroundPosition: '0px 0px, 0px 10px, 10px -10px, -10px 0px',
                                                                    backgroundSize: '20px 20px'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                        {node.data.image && <img src={node.data.image} alt="" draggable="false" className="w-full h-40 object-cover rounded-lg" />}
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
                                <img src={node.data.thumb} alt="" draggable="false" className="w-12 h-16 object-cover rounded-md opacity-80" />
                            )}
                            <div className="flex-1 relative group">
                                <img src={node.data.image} alt="" draggable="false" className="w-full h-auto aspect-[3/4] object-cover rounded-lg shadow-sm" />
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
                    <img src={node.data.image} alt="" draggable="false" className="w-full h-auto object-cover rounded-xl" />
                )}
            </div>

            {node.type === 'custom-image' ? (
                <>
                    <span className="group absolute top-1/2 left-0 z-20 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2">
                        <div className="w-2 h-2 rounded-full border border-green-500 text-green-500 flex items-center justify-center opacity-80 duration-0 group-hover:scale-[2] group-hover:opacity-100">
                            <svg viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none w-2 h-2"><circle cx="18" cy="18" r="18"></circle></svg>
                        </div>
                    </span>
                    <span className="group absolute top-1/2 right-0 z-20 flex translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full p-2">
                        <div className="w-2 h-2 rounded-full border border-green-500 text-green-500 flex items-center justify-center duration-0 group-hover:scale-[2]">
                            <svg viewBox="0 0 30 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="pointer-events-none w-2 h-2"><path d="M27.2585 13.8777C30.2001 15.8388 30.2001 20.1612 27.2585 22.1223L7.70254 35.1596C4.4101 37.3545 -1.72967e-07 34.9943 0 31.0373L1.13976e-06 4.96269C1.31272e-06 1.00566 4.4101 -1.35455 7.70254 0.840414L27.2585 13.8777Z"></path></svg>
                        </div>
                    </span>
                </>
            ) : node.type !== 'GoogleGenerativeAIChatNode' && node.type !== 'AnthropicChatNode' && node.type !== 'FalFluxKreaDevNode' && node.type !== 'FalRodinNode' && node.type !== 'FalVeoNode' && node.type !== 'VideoNode' ? (
                <>
                    <div className={`absolute left-0 top-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border-[1.5px] z-20 ${isNoir ? 'bg-[#2D2D2D] border-gray-500' : 'bg-white border-gray-400'}`} />
                    <div className={`absolute right-0 top-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full border-[1.5px] z-20 ${isNoir ? 'bg-[#2D2D2D] border-gray-500' : 'bg-white border-gray-400'}`} />
                </>
            ) : null}

        </motion.div>
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
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const handleSelectNode = (id) => setSelectedNodeId(prev => prev === id ? null : id);

    // Compute scale so the full canvas (~1700px wide) fits the container width
    const scaleFactor = Math.min(1, containerWidth / 1700);
    // Drag is only safe when scaleFactor=1 (no CSS transform) so coords stay in canvas space
    const isDraggable = scaleFactor >= 1;
    // Section height tracks the scaled canvas height (~1100px tall canvas)
    const canvasHeight = Math.max(360, scaleFactor * 1100 + 40);


    return (
        <section
            style={{ height: canvasHeight }}
            onClick={() => setSelectedNodeId(null)}
            className={`relative w-full overflow-hidden ${isNoir ? 'bg-gradient-to-b from-[#232323] to-[#0A0A0A]' : 'bg-gradient-to-b from-[#FDFBF8] via-[#F0F1F1] to-[#FAFAFA]'}`}
        >

            {/* Ambient Background with Fading Grid and Pink Glow */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Subtle Pink/Purple Radial Gradient Glow */}
                <div
                    className="absolute inset-0 opacity-60 mix-blend-multiply"
                    style={{
                        background: isNoir
                            ? 'radial-gradient(ellipse at 50% 40%, rgba(139, 92, 246, 0.15), transparent 30%), radial-gradient(ellipse at 60% 50%, rgba(236, 72, 153, 0.15), transparent 30%), radial-gradient(ellipse at 90% 20%, rgba(255, 205, 220, 0.15), transparent 30%), radial-gradient(ellipse at 40% 60%, rgba(236, 72, 153, 0.15), transparent 30%)'
                            : 'radial-gradient(ellipse at 10% 30%, rgba(255, 205, 220, 0.5), transparent 30%), radial-gradient(circle at 60% 40%, rgba(255, 205, 220, 0.3), transparent 40%), radial-gradient(ellipse at 90% 20%, rgba(255, 205, 220, 0.5), transparent 30%), radial-gradient(ellipse at 35% 60%, rgba(77, 29, 107, 0.25), transparent 50%)'
                    }}
                />
                {/* Fading Grid */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: isNoir
                            ? `linear-gradient(#4f4f4f 1px, transparent 1px), linear-gradient(90deg, #4f4f4f 1px, transparent 1px)`
                            : `linear-gradient(#E5E5E5 1px, transparent 1px), linear-gradient(90deg, #E5E5E5 1px, transparent 1px), radial-gradient(circle at 1px 1px, #D4D4D4 3px, transparent 3px)`,
                        backgroundSize: `${60 * scaleFactor}px ${60 * scaleFactor}px`,
                        opacity: isNoir ? 0.3 : 0.6,
                        maskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 40%, transparent 100%)'
                    }}
                />
            </div>

            {/* Canvas Container
                Using w-full and flex with justify center to keep nodes in middle of screen 
                Using a fixed internal width for coordinate system consistency 
            */}
            <div
                ref={containerRef}
                className="relative z-10 w-full max-w-[1920px] mx-auto h-full p-4"
                style={{ transform: `scale(${scaleFactor})`, transformOrigin: 'top left' }}
            >

                <div className="react-flow__edges absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                    {INITIAL_CONNECTIONS.map((conn, i) => {
                        const startNode = INITIAL_NODES.find(n => n.id === conn.from);
                        const endNode = INITIAL_NODES.find(n => n.id === conn.to);
                        if (!startNode || !endNode) return null;

                        const startPos = nodePositions[conn.from] || { x: startNode.x, y: startNode.y };
                        const endPos   = nodePositions[conn.to]   || { x: endNode.x,   y: endNode.y };

                        const getHandleOffset = (nodeId, handleId) => {
                            const offsets = {
                                'ref-1': { 'right': { x: 303, y: 203.5 } },
                                'ref-2': { 'right': { x: 167, y: 114 } },
                                'ref-3': { 'right': { x: 238, y: 161.5 } },
                                'ref-4': { 'right': { x: 212, y: 144.5 } },
                                'gemini': {
                                    'in-attachment': { x: 32, y: 81.5 },
                                    'out': { x: 269, y: 247.5 }
                                },
                                'claude': {
                                    'in-prompt': { x: 32, y: 137.5 },
                                    'in-attachment': { x: 32, y: 137.5 },
                                    'in-text': { x: 32, y: 137.5 },
                                    'out-text': { x: 262, y: 235.5 }
                                },
                                'flux': {
                                    'in-prompt': { x: 53, y: 98 },
                                    'in-image-prompt': { x: 55, y: 114 },
                                    'out-image': { x: 201, y: 247 }
                                },
                                'rodin': {
                                    'in-images': { x: 54, y: 97.5 },
                                    'out-images': { x: 222, y: 55 }
                                },
                                'veo': {
                                    'in-first-frame': { x: 53, y: 98 },
                                    'out-video': { x: 201, y: 231.5 }
                                },
                                'video-node': {
                                    'in-video': { x: 55, y: 333 }
                                }
                            };
                            return offsets[nodeId]?.[handleId] || { x: 0, y: 0 };
                        };

                        const startOffset = getHandleOffset(conn.from, conn.sourceHandle);
                        const endOffset = getHandleOffset(conn.to, conn.targetHandle);

                        const startPoint = {
                            x: startPos.x + startOffset.x,
                            y: startPos.y + startOffset.y
                        };

                        const endPoint = {
                            x: endPos.x + endOffset.x,
                            y: endPos.y + endOffset.y
                        };

                        return (
                            <ConnectionLine
                                key={`conn-${i}`}
                                start={startPoint}
                                end={endPoint}
                            />
                        );
                    })}
                </div>

                {INITIAL_NODES.map(node => (
                    <NodeCard
                        key={node.id}
                        node={node}
                        isNoir={isNoir}
                        isDraggable={isDraggable}
                        isSelected={selectedNodeId === node.id}
                        onSelect={handleSelectNode}
                        onPositionChange={(id, x, y) => {
                            setNodePositions(prev => ({
                                ...prev,
                                [id]: { x, y }
                            }));
                        }}
                    />
                ))}

            </div>
        </section>
    );
};

export default Working;
