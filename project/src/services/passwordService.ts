import { db, auth } from '../lib/firebase'; // Import Firebase db and auth

import { encryptPassword, decryptPassword } from '../utils/encryption';
import type { StoredPassword } from '../types';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDoc,
} from 'firebase/firestore';

export const passwordService = {
  async createPassword(
    data: Omit<StoredPassword, 'id' | 'createdAt' | 'updatedAt'>,
    masterKey: string
  ): Promise<StoredPassword> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const encryptedPassword = await encryptPassword(data.password, masterKey);
    const passwordsRef = collection(db, 'passwords');

    const newPassword = {
      user_id: auth.currentUser.uid, // Use Firebase auth.currentUser.uid
      title: data.title,
      username: data.username,
      encrypted_password: encryptedPassword,
      url: data.url,
      notes: data.notes,
      created_at: new Date(), // Use JavaScript Date for timestamps
      updated_at: new Date(),
    };

    const docRef = await addDoc(passwordsRef, newPassword);
    return { id: docRef.id, ...newPassword } as StoredPassword;
  },

  async getPasswords(): Promise<StoredPassword[]> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const passwordsRef = collection(db, 'passwords');
    const q = query(
      passwordsRef,
      where('user_id', '==', auth.currentUser.uid), // Filter by user_id
      orderBy('title', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const passwords: StoredPassword[] = [];
    querySnapshot.forEach((doc) => {
      passwords.push({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamps to JavaScript Dates if needed
        created_at: (doc.data().created_at as any)?.toDate(),
        updated_at: (doc.data().updated_at as any)?.toDate(),
      } as StoredPassword);
    });
    return passwords;
  },

  async updatePassword(
    id: string,
    data: Partial<StoredPassword>,
    masterKey: string
  ): Promise<StoredPassword> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const passwordDocRef = doc(db, 'passwords', id);
    const updates: Record<string, any> = { ...data };

    if (data.password) {
      updates.encrypted_password = await encryptPassword(data.password, masterKey);
      delete updates.password;
    }

    updates.updated_at = new Date(); // Update the timestamp

    await updateDoc(passwordDocRef, updates);

    // Fetch the updated document
    const updatedDocRef = doc(db, 'passwords', id);
    const updatedDoc = await getDoc(updatedDocRef);
    if (!updatedDoc.exists()) {
      throw new Error('Password not found');
    }

    return {
      id: updatedDoc.id,
      ...updatedDoc.data(),
      created_at: (updatedDoc.data().created_at as any)?.toDate(),
      updated_at: (updatedDoc.data().updated_at as any)?.toDate(),
    } as StoredPassword;
  },

  async deletePassword(id: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const passwordDocRef = doc(db, 'passwords', id);
    await deleteDoc(passwordDocRef);
  },

  async decryptPassword(encryptedPassword: string, masterKey: string): Promise<string> {
    return decryptPassword(encryptedPassword, masterKey);
  },
};
