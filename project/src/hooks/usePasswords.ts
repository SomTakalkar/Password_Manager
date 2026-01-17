import { useState, useEffect, useCallback } from 'react';
import { passwordService } from '../services/passwordService';
import type { StoredPassword } from '../types';

export const usePasswords = (masterKey: string) => {
    const [passwords, setPasswords] = useState<StoredPassword[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadPasswords = useCallback(async () => {
        if (!masterKey) return;
        try {
            setLoading(true);
            const data = await passwordService.getPasswords(masterKey);
            setPasswords(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to load passwords'));
        } finally {
            setLoading(false);
        }
    }, [masterKey]);

    useEffect(() => {
        loadPasswords();
    }, [loadPasswords]);

    const addPassword = async (data: { title: string; username: string; password: string; url: string; notes: string }, dek: string) => {
        try {
            const newPassword = await passwordService.createPassword(data, dek);
            setPasswords(prev => [...prev, newPassword]);
            return newPassword;
        } catch (err) {
            throw err instanceof Error ? err : new Error('Failed to add password');
        }
    };

    // Placeholder for update/delete if not implemented in service yet
    const deletePassword = async (id: string) => {
        // Implementation needed in service
        try {
            // await passwordService.deletePassword(id, masterKey); 
            // For now just update state locally or implement service method
            setPasswords(prev => prev.filter(p => p.id !== id));
            // TODO: calling service delete method (not visible in recent edit but assumed existing or need to add)
        } catch (err) {
            throw err instanceof Error ? err : new Error('Failed to delete password');
        }
    };

    return {
        passwords,
        loading,
        error,
        addPassword,
        deletePassword,
        refresh: loadPasswords
    };
};
