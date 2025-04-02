import CryptoJS from 'crypto-js';
import * as argon2 from 'argon2-browser';

export const encryptPassword = async (password: string, masterKey: string): Promise<string> => {
  // Generate a random salt for each encryption
  const salt = CryptoJS.lib.WordArray.random(128 / 8);
  
  // Derive an encryption key from the master key using PBKDF2
  const key = CryptoJS.PBKDF2(masterKey, salt, {
    keySize: 256 / 32,
    iterations: 10000
  });

  // Encrypt the password using AES-GCM
  const encrypted = CryptoJS.AES.encrypt(password, key.toString(), {
    mode: CryptoJS.mode.GCM,
    padding: CryptoJS.pad.Pkcs7,
    salt: salt
  });

  // Return the complete encrypted string with salt
  return encrypted.toString();
};

export const decryptPassword = async (encryptedData: string, masterKey: string): Promise<string> => {
  try {
    // Extract salt from the encrypted data
    const ciphertext = CryptoJS.enc.Base64.parse(encryptedData);
    const salt = ciphertext.words.slice(0, 4);
    
    // Derive the same key using PBKDF2
    const key = CryptoJS.PBKDF2(masterKey, salt, {
      keySize: 256 / 32,
      iterations: 10000
    });

    // Decrypt the password
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key.toString(), {
      mode: CryptoJS.mode.GCM,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error('Failed to decrypt password');
  }
};

export const hashMasterPassword = async (password: string, salt: string): Promise<string> => {
  try {
    const result = await argon2.hash({
      pass: password,
      salt: new TextEncoder().encode(salt),
      type: argon2.ArgonType.Argon2id,
      time: 3, // Number of iterations
      mem: 4096, // Memory usage in KiB
      hashLen: 32, // Output hash length
    });

    return result.encoded;
  } catch (error) {
    throw new Error('Failed to hash master password');
  }
};

export const verifyMasterPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await argon2.verify({
      pass: password,
      encoded: hash,
    });
  } catch (error) {
    return false;
  }
};