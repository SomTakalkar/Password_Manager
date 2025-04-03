import { useState, useEffect } from 'react';
import { passwordService } from '../services/passwordService';
import type { StoredPassword } from '../types';

export const usePasswords = () => {
    const [passwords, setPasswords] = useState<StoredPassword[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        loadPasswords();
    }, []);

    const loadPasswords = async () => {
        try {
            setLoading(true);
            const data = await passwordService.getPasswords();
            setPasswords(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load passwords'));
        } finally {
            setLoading(false);
        }
    };

    const addPassword = async (data: Omit<StoredPassword, 'id' | 'createdAt' | 'updatedAt'>, masterKey: string) => {
        try {
            const newPassword = await passwordService.createPassword(data, masterKey);
            setPasswords(prev => [...prev, newPassword]);
            return newPassword;
        } catch (err) {
            throw err instanceof Error ? err : new Error('Failed to add password');
        }
    };

    const updatePassword = async (id: string, data: Partial<StoredPassword>, masterKey: string) => {
        try {
            const updatedPassword = await passwordService.updatePassword(id, data, masterKey);
            setPasswords(prev => prev.map(p => p.id === id ? updatedPassword : p));
            return updatedPassword;
        } catch (err) {
            throw err instanceof Error ? err : new Error('Failed to update password');
        }
    };

    const deletePassword = async (id: string) => {
        try {
            await passwordService.deletePassword(id);
            setPasswords(prev => prev.filter(p => p.id !== id));
        } catch (err) {
            throw err instanceof Error ? err : new Error('Failed to delete password');
        }
    };

    return {
        passwords,
        loading,
        error,
        addPassword,
        updatePassword,
        deletePassword,
        refresh: loadPasswords
    };
};