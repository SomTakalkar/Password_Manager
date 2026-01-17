import React, { useState } from 'react';
import { Shield, ArrowRight, Lock } from 'lucide-react';

interface MasterPasswordLoginProps {
    onLogin: (password: string) => Promise<void>;
    onForgotPassword?: () => void;
}

const MasterPasswordLogin: React.FC<MasterPasswordLoginProps> = ({ onLogin, onForgotPassword }) => {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) return;

        setIsLoading(true);
        setError('');

        try {
            await onLogin(password);
        } catch (e) {
            setError('Incorrect password');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8 space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 backdrop-blur-xl mb-4 shadow-xl ring-1 ring-white/10">
                        <Shield className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 pb-1">
                        Secure Vault
                    </h1>
                    <p className="text-slate-400 text-sm">Enter your master password to decrypt</p>
                </div>

                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl ring-1 ring-white/5">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Master Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    className={`block w-full pl-11 pr-4 py-3.5 bg-slate-950/50 border rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200 ${error ? 'border-red-500/50' : 'border-slate-800'}`}
                                    placeholder="Enter access key..."
                                    autoFocus
                                />
                            </div>
                            {error && <p className="text-red-400 text-sm ml-1">{error}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Unlock Vault
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>

                        {onForgotPassword && (
                            <button
                                type="button"
                                onClick={onForgotPassword}
                                className="w-full text-sm text-slate-500 hover:text-emerald-400 transition-colors"
                            >
                                Forgot Master Password?
                            </button>
                        )}
                    </form>
                </div>

                <p className="mt-8 text-center text-xs text-slate-500">
                    <span className="opacity-50">Local Encrypted Storage • AES-256 Encryption</span>
                </p>
            </div>
        </div>
    );
};

export default MasterPasswordLogin;
