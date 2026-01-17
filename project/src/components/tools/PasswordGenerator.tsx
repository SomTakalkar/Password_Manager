import React, { useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { generatePassword, calculatePasswordStrength } from '../../utils/passwordGenerator';
import type { PasswordGeneratorOptions } from '../../types';

const PasswordGenerator: React.FC = () => {
  const [options, setOptions] = useState<PasswordGeneratorOptions>({
    length: 16,
    includeNumbers: true,
    includeSymbols: true,
    includeUppercase: true,
    includeLowercase: true,
    excludeAmbiguous: true,
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(options);
    setGeneratedPassword(newPassword);
    setCopied(false);
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const passwordStrength = calculatePasswordStrength(generatedPassword);

  React.useEffect(() => {
    handleGeneratePassword();
  }, []); // Run once on mount

  // Re-generate when options change? 
  // Standard UX usually waits for explicit Generate or updates live. 
  // Let's update live for better feel.
  React.useEffect(() => {
    handleGeneratePassword();
  }, [options]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Password Generator</h1>
        <p className="mt-2 text-gray-500 dark:text-slate-400">
          Generate strong, secure passwords based on your preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-2xl p-8 shadow-2xl">
        <div className="relative mb-8">
          <div className="group relative">
            <input
              type="text"
              readOnly
              value={generatedPassword}
              className="block w-full pr-24 pl-6 py-4 bg-gray-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white text-xl font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
              <button
                onClick={handleGeneratePassword}
                className="p-2.5 rounded-lg text-gray-400 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
                title="Regenerate"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
              <button
                onClick={handleCopyPassword}
                className={`p-2.5 rounded-lg transition-all ${copied ? 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-400/10' : 'text-gray-400 dark:text-slate-400 hover:text-emerald-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'}`}
                title="Copy"
              >
                {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Strength Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">Strength</span>
              <span className={`text-xs font-bold uppercase tracking-wider ${passwordStrength > 80 ? 'text-emerald-600 dark:text-emerald-400' :
                  passwordStrength > 50 ? 'text-amber-500 dark:text-amber-400' : 'text-red-500 dark:text-red-400'
                }`}>
                {passwordStrength > 80 ? 'Strong' : passwordStrength > 50 ? 'Medium' : 'Weak'}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full transition-all duration-500 ease-out rounded-full"
                style={{
                  width: `${passwordStrength}%`,
                  backgroundColor: passwordStrength > 80 ? '#34d399' : passwordStrength > 50 ? '#fbbf24' : '#f87171',
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="length" className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Password Length
              </label>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{options.length}</span>
            </div>
            <input
              type="range"
              id="length"
              min="8"
              max="32"
              value={options.length}
              onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['includeUppercase', 'includeLowercase', 'includeNumbers', 'includeSymbols', 'excludeAmbiguous'].map((key) => {
              const labelMap: Record<string, string> = {
                includeUppercase: 'Uppercase (A-Z)',
                includeLowercase: 'Lowercase (a-z)',
                includeNumbers: 'Numbers (0-9)',
                includeSymbols: 'Symbols (!@#)',
                excludeAmbiguous: 'No Ambiguous (i, l, 1)'
              };
              return (
                <label key={key} className="flex items-center p-3 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer transition-colors group">
                  <input
                    type="checkbox"
                    checked={options[key as keyof PasswordGeneratorOptions] as boolean}
                    onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 dark:border-slate-600 text-emerald-500 focus:ring-emerald-500/50 focus:ring-offset-0 bg-white dark:bg-slate-800"
                  />
                  <span className="ml-3 text-sm text-gray-700 dark:text-slate-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{labelMap[key]}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;