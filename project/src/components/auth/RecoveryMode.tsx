import React, { useState } from 'react';
import { Key, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { passwordService } from '../../services/passwordService';

interface RecoveryModeProps {
    onRecoveryComplete: (password: string) => void;
    onCancel: () => void;
}

const RecoveryMode: React.FC<RecoveryModeProps> = ({ onRecoveryComplete, onCancel }) => {
    const [recoveryKey, setRecoveryKey] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRecovery = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (newPassword.length < 8) throw new Error('Password too short');

            await passwordService.recoverVault(recoveryKey.trim(), newPassword);
            onRecoveryComplete(newPassword);
        } catch (err) {
            setError('Invalid recovery key or failed to reset.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md relative z-10">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl ring-1 ring-white/5">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 mb-4">
                        <Key className="w-6 h-6 text-purple-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Recovery Mode</h1>
                    <p className="text-slate-400 text-sm">Enter your Recovery Key to reset access.</p>
                </div>

                <form onSubmit={handleRecovery} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Recovery Key</label>
                        <textarea
                            required
                            value={recoveryKey}
                            onChange={(e) => setRecoveryKey(e.target.value)}
                            className="block w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white font-mono text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors h-24 resize-none"
                            placeholder="REC-..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">New Master Password</label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full px-4 py-3 bg-slate-950/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                            placeholder="New strong password"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center space-x-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                            <AlertTriangle className="h-4 w-4" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 border border-white/10 rounded-xl text-slate-300 hover:bg-white/5 transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 flex items-center justify-center px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium shadow-lg shadow-purple-500/20 transition-all duration-200 text-sm"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Vault'}
                            <ShieldCheck className="ml-2 h-4 w-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecoveryMode;
