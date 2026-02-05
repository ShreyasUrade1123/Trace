import React from 'react';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex bg-[#F0F0F0] h-screen relative overflow-hidden font-sans">

            {/* --- Ambient Background (Matches Login) --- */}
            <div className="absolute inset-0 z-0">
                {/* Gradient Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob" />
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-400/20 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />

                {/* Grid Pattern Mesh */}
                <div className="absolute inset-0 pointer-events-none opacity-80"
                    style={{
                        backgroundImage: `linear-gradient(#E5E5E5 1px, transparent 1px), linear-gradient(90deg, #E5E5E5 1px, transparent 1px), radial-gradient(circle at 1px 1px, #D4D4D4 3px, transparent 3px)`,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            {/* Sidebar z-index ensures it sits above background but can blend if glassmorphism used */}
            <div className="relative z-20 h-screen sticky top-0">
                <Sidebar />
            </div>

            <main className="flex-1 overflow-y-auto relative z-10">
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
