import { encryptPassword, decryptPassword } from '../utils/encryption';
import { generateDEK, generateSalt, deriveKeyFromPassword, wrapKey, unwrapKey, generateRecoveryKey, VaultKeys } from '../utils/keyManagement';
import type { StoredPassword } from '../types';

const STORAGE_KEY_PASSWORDS = 'passwords';
const STORAGE_KEY_VAULT = 'vault_keys';

export const passwordService = {
    // --- Vault Management ---

    isVaultInitialized(): boolean {
        return !!localStorage.getItem(STORAGE_KEY_VAULT);
    },

    /**
     * Creates a new vault.
     * Generates a DEK, wraps it with the password, and creates a recovery key.
     * Returns the Recovery Key to be shown to the user.
     */
    async setupVault(password: string): Promise<string> {
        const dek = generateDEK();
        const salt = generateSalt();
        const iterations = 100000; // Strong iterations for PBKDF2
        const derivedKey = deriveKeyFromPassword(password, salt, iterations);

        const recoveryKey = generateRecoveryKey();

        const vaultKeys: VaultKeys = {
            salt,
            iterations,
            wrappedDEK: wrapKey(dek, derivedKey),
            recoveryDEK: wrapKey(dek, recoveryKey) // Recovery Key wraps the DEK directly (simple model)
        };

        localStorage.setItem(STORAGE_KEY_VAULT, JSON.stringify(vaultKeys));
        localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify([])); // Init empty db

        return recoveryKey;
    },

    /**
     * Attempts to unlock the vault and retrieve the DEK.
     */
    async unlockVault(password: string): Promise<string> {
        const vaultData = localStorage.getItem(STORAGE_KEY_VAULT);
        if (!vaultData) throw new Error('Vault not initialized');

        const vaultKeys: VaultKeys = JSON.parse(vaultData);
        const derivedKey = deriveKeyFromPassword(password, vaultKeys.salt, vaultKeys.iterations);

        try {
            const dek = unwrapKey(vaultKeys.wrappedDEK, derivedKey);
            if (!dek) throw new Error('Invalid password');
            return dek;
        } catch (e) {
            throw new Error('Invalid password');
        }
    },

    /**
     * Resets the Master Password using the Recovery Key.
     * Unwraps the DEK with Recovery Key, then re-wraps with new password.
     */
    async recoverVault(recoveryKey: string, newPassword: string): Promise<void> {
        const vaultData = localStorage.getItem(STORAGE_KEY_VAULT);
        if (!vaultData) throw new Error('Vault not initialized');

        const vaultKeys: VaultKeys = JSON.parse(vaultData);

        // 1. Unwrap DEK using Recovery Key
        let dek: string;
        try {
            dek = unwrapKey(vaultKeys.recoveryDEK, recoveryKey.trim());
            if (!dek) throw new Error('Invalid recovery key');
        } catch (e) {
            throw new Error('Invalid recovery key');
        }

        // 2. Generate new wrapper for the same DEK using new Password
        const newSalt = generateSalt();
        const newDerivedKey = deriveKeyFromPassword(newPassword, newSalt, vaultKeys.iterations);

        const newVaultKeys: VaultKeys = {
            ...vaultKeys,
            salt: newSalt,
            wrappedDEK: wrapKey(dek, newDerivedKey),
            // Recovery key remains valid (or valid until we rotate it, but keeping it simple for now)
            // Ideally we should NOT rotate the recovery key unless requested, otherwise the user's printed backup fails.
            // The recoveryDEK stays the same because the DEK didn't change, and Recovery Key didn't change.
        };

        localStorage.setItem(STORAGE_KEY_VAULT, JSON.stringify(newVaultKeys));
    },

    // --- Password Operations (Using DEK) ---

    async createPassword(data: { title: string; username: string; password: string; url: string; notes: string }, dek: string): Promise<StoredPassword> {
        try {
            // Use the DEK to encrypt the password entry
            const encryptedPassword = await encryptPassword(data.password, dek);

            const newPassword: StoredPassword = {
                id: crypto.randomUUID(),
                title: data.title,
                username: data.username,
                encrypted_password: encryptedPassword,
                url: data.url,
                notes: data.notes,
                user_id: 'local-user', // DEK ensures isolation effectively
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const storedPasswordsStr = localStorage.getItem(STORAGE_KEY_PASSWORDS);
            const passwords: StoredPassword[] = storedPasswordsStr ? JSON.parse(storedPasswordsStr) : [];

            passwords.push(newPassword);
            localStorage.setItem(STORAGE_KEY_PASSWORDS, JSON.stringify(passwords));

            return newPassword;
        } catch (error) {
            console.error('Error creating password:', error);
            throw new Error('Failed to create password');
        }
    },

    async getPasswords(dek: string): Promise<StoredPassword[]> {
        // We just fetch. Decryption happens when viewing specific item usually, 
        // to keep memory safe, but here we return StoredPassword object which has encrypted fields.
        try {
            const storedPasswordsStr = localStorage.getItem(STORAGE_KEY_PASSWORDS);
            if (!storedPasswordsStr) return [];
            return JSON.parse(storedPasswordsStr);
        } catch (error) {
            console.error('Error fetching passwords:', error);
            return [];
        }
    },

    // Decrypt individual password using DEK
    async decryptPassword(encryptedPassword: string, dek: string): Promise<string> {
        return decryptPassword(encryptedPassword, dek);
    }
};
