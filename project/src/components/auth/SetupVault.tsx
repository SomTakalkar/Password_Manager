import React, { useState } from 'react';
import { Shield, ArrowRight, Lock, CheckCircle, AlertTriangle, FileText, Copy } from 'lucide-react';
import { passwordService } from '../../services/passwordService';

interface SetupVaultProps {
    onSetupComplete: (password: string) => void;
}

const SetupVault: React.FC<SetupVaultProps> = ({ onSetupComplete }) => {
    const [step, setStep] = useState<'password' | 'recovery'>('password');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [recoveryKey, setRecoveryKey] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreateVault = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);
        try {
            const key = await passwordService.setupVault(password);
            setRecoveryKey(key);
            setStep('recovery');
        } catch (err) {
            setError('Failed to setup vault');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinish = () => {
        onSetupComplete(password);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(recoveryKey);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />

            <div className="w-full max-w-lg relative z-10">
                {step === 'password' ? (
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl ring-1 ring-white/5">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 mb-4">
                                <Shield className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">Create Your Vault</h1>
                            <p className="text-slate-400">Set a strong Master Password to encrypt your data locally.</p>
                        </div>

                        <form onSubmit={handleCreateVault} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Master Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                        placeholder="Enter a strong password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                        placeholder="Repeat password"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex items-center justify-center py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium shadow-lg shadow-emerald-500/20 transition-all duration-200"
                            >
                                {isLoading ? 'Encrypting...' : 'Create Vault'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl ring-1 ring-white/5">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 mb-4">
                                <FileText className="w-8 h-8 text-amber-400" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-2">Save Your Recovery Key</h1>
                            <p className="text-slate-400 text-sm">
                                If you lose your Master Password, this key is the <b>ONLY</b> way to recover your data.
                            </p>
                        </div>

                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-6 relative group">
                            <code className="text-emerald-400 font-mono text-lg break-all select-all">
                                {recoveryKey}
                            </code>
                            <button
                                onClick={copyToClipboard}
                                className="absolute top-2 right-2 p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                                title="Copy to clipboard"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="flex items-start space-x-3 bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 mb-8">
                            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-amber-200/80 text-sm">
                                We cannot recover your password for you. Please save this key in a safe place (like a physical notebook).
                            </p>
                        </div>

                        <button
                            onClick={handleFinish}
                            className="w-full flex items-center justify-center py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium border border-slate-700 transition-all duration-200"
                        >
                            I have saved my key
                            <CheckCircle className="ml-2 h-5 w-5 text-emerald-500" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SetupVault;
