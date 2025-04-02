import React, { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
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
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Password Generator</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate strong, secure passwords based on your preferences.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="relative">
          <input
            type="text"
            readOnly
            value={generatedPassword}
            className="block w-full pr-20 border-gray-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
          />
          <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-2">
            <button
              onClick={handleGeneratePassword}
              className="p-1 rounded text-gray-400 hover:text-gray-500"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            <button
              onClick={handleCopyPassword}
              className="p-1 rounded text-gray-400 hover:text-gray-500"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Password Strength</span>
            <span className="text-sm text-gray-500">{passwordStrength}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full"
              style={{
                width: `${passwordStrength}%`,
                backgroundColor: passwordStrength > 80 ? '#10B981' : passwordStrength > 50 ? '#F59E0B' : '#EF4444',
              }}
            />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700">
              Password Length: {options.length}
            </label>
            <input
              type="range"
              id="length"
              min="8"
              max="32"
              value={options.length}
              onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
              className="mt-1 w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.includeUppercase}
                onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Include Uppercase Letters</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.includeLowercase}
                onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Include Lowercase Letters</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.includeNumbers}
                onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Include Numbers</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.includeSymbols}
                onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Include Symbols</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={options.excludeAmbiguous}
                onChange={(e) => setOptions({ ...options, excludeAmbiguous: e.target.checked })}
                className="rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-300 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-gray-700">Exclude Ambiguous Characters</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;