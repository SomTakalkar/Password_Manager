import CryptoJS from 'crypto-js';

// Types for our Key Architecture
export interface VaultKeys {
    salt: string;           // Salt for PBKDF2
    wrappedDEK: string;     // DEK encrypted by Master Password
    recoveryDEK: string;    // DEK encrypted by Recovery Key
    iterations: number;     // PBKDF2 iterations
}

export const generateRecoveryKey = (): string => {
    // Generate a human-readable recovery key (e.g. 32 chars hex)
    const randomBytes = CryptoJS.lib.WordArray.random(16); // 128-bit entropy
    return 'REC-' + randomBytes.toString(CryptoJS.enc.Hex).toUpperCase();
};

export const generateDEK = (): string => {
    // Generate 256-bit Data Encryption Key
    return CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Base64);
};

export const deriveKeyFromPassword = (password: string, salt: string, iterations: number = 10000): string => {
    // PBKDF2 derivation
    const key = CryptoJS.PBKDF2(password, CryptoJS.enc.Hex.parse(salt), {
        keySize: 256 / 32,
        iterations: iterations
    });
    return key.toString(CryptoJS.enc.Base64);
};

export const wrapKey = (keyToWrap: string, wrappingKey: string): string => {
    // Encrypt the DEK using the Wrapping Key
    return CryptoJS.AES.encrypt(keyToWrap, wrappingKey).toString();
};

export const unwrapKey = (wrappedKey: string, wrappingKey: string): string => {
    // Decrypt the DEK
    const bytes = CryptoJS.AES.decrypt(wrappedKey, wrappingKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};

export const generateSalt = (): string => {
    return CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
};
