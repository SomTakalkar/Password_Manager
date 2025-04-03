import { supabase } from '../lib/supabase';
import { encryptPassword, decryptPassword } from '../utils/encryption';
import type { StoredPassword } from '../types';

export const passwordService = {
    async createPassword(
        data: Omit<StoredPassword, 'id' | 'createdAt' | 'updatedAt'>,
        masterKey: string
    ): Promise<StoredPassword> {
        try {
            const encryptedPassword = await encryptPassword(data.password, masterKey);
            console.log('🔐 Encrypted Password:', encryptedPassword);

            const { data: newPassword, error } = await supabase
                .from('passwords')
                .insert({
                    title: data.title,
                    username: data.username,
                    encrypted_password: encryptedPassword,
                    url: data.url,
                    notes: data.notes,
                })
                .select()
                .single();

            if (error) {
                console.error('❌ Supabase Insert Error:', error);
                throw error;
            }

            console.log('✅ New Password Saved:', newPassword);
            return newPassword as StoredPassword;
        } catch (err) {
            console.error('❌ Create Password Error:', err);
            throw err;
        }
    },

    async getPasswords(): Promise<StoredPassword[]> {
        const { data: passwords, error } = await supabase
            .from('passwords')
            .select('*')
            .order('title', { ascending: true });

        if (error) throw error;
        return passwords as StoredPassword[];
    },

    async updatePassword(
        id: string,
        data: Partial<StoredPassword>,
        masterKey: string
    ): Promise<StoredPassword> {
        const updates: Record<string, any> = { ...data };

        if (data.password) {
            updates.encrypted_password = await encryptPassword(data.password, masterKey);
            delete updates.password;
        }

        const { data: updatedPassword, error } = await supabase
            .from('passwords')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return updatedPassword as StoredPassword;
    },

    async deletePassword(id: string): Promise<void> {
        const { error } = await supabase
            .from('passwords')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async decryptPassword(encryptedPassword: string, masterKey: string): Promise<string> {
        return decryptPassword(encryptedPassword, masterKey);
    }
};
