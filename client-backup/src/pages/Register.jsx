import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signup } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password strength
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        const result = await signup(email, password, name);

        setIsLoading(false);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F0F0] relative overflow-hidden flex items-center justify-center p-6 font-sans">

            {/* --- Ambient Background --- */}
            {/* Gradient Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-400/20 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob" />
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-400/20 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-blob animation-delay-4000" />

            {/* Grid Pattern Mesh */}
            <div className="absolute inset-0 pointer-events-none opacity-80"
                style={{
                    backgroundImage: `linear-gradient(#E5E5E5 1px, transparent 1px), linear-gradient(90deg, #E5E5E5 1px, transparent 1px), radial-gradient(circle at 1px 1px, #D4D4D4 3px, transparent 3px)`,
                    backgroundSize: '60px 60px'
                }}
            />

            {/* --- Glassmorphism Card --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[480px] relative z-10"
            >
                <div className="backdrop-blur-2xl bg-white/60 border border-white/50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] rounded-[32px] p-8 md:p-12 overflow-hidden relative">

                    {/* Inner sheen */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50" />

                    {/* Header */}
                    <div className="mb-10 text-center">
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="font-neueHaas font-medium text-4xl md:text-5xl text-black tracking-tight mb-3"
                        >
                            Create account.
                        </motion.h2>
                        <p className="font-neueHaas text-gray-500 text-lg leading-snug">
                            Join the platform and start building.
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/5 border border-red-500/20 text-red-600 px-4 py-3 rounded-xl mb-8 font-neueHaas text-sm flex items-center justify-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="group">
                            <label className="block font-iki text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-black transition-colors">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-white/50 border border-gray-200/50 rounded-xl px-4 py-3.5 font-neueHaas text-lg text-black focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all placeholder-gray-300"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="block font-iki text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-black transition-colors">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/50 border border-gray-200/50 rounded-xl px-4 py-3.5 font-neueHaas text-lg text-black focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all placeholder-gray-300"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="block font-iki text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-black transition-colors">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/50 border border-gray-200/50 rounded-xl px-4 py-3.5 font-neueHaas text-xl text-black focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all placeholder-gray-300 tracking-widest"
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                            <p className="text-xs text-gray-400 mt-1.5 font-neueHaas">Minimum 8 characters</p>
                        </div>

                        <div className="group">
                            <label className="block font-iki text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 group-focus-within:text-black transition-colors">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-white/50 border border-gray-200/50 rounded-xl px-4 py-3.5 font-neueHaas text-xl text-black focus:border-black/20 focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all placeholder-gray-300 tracking-widest"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0A0A0A] text-white font-neueHaas font-medium text-lg py-4 rounded-xl hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-black/10 flex items-center justify-center gap-3 group mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating Account...
                                </span>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="font-neueHaas text-gray-500 text-sm">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-black font-medium hover:underline decoration-1 underline-offset-2 transition-all"
                            >
                                Log In
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom branding subtle */}
                <div className="mt-8 text-center opacity-30">
                    <h1 className="font-neueHaas font-bold tracking-tighter text-2xl text-black">Trace</h1>
                </div>

            </motion.div>
        </div>
    );
};

export default Register;
