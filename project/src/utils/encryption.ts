import CryptoJS from 'crypto-js';
import * as argon2 from 'argon2-browser';

export const encryptPassword = async (password: string, masterKey: string): Promise<string> => {
  // Generate a random IV (Initialization Vector)
  const iv = CryptoJS.lib.WordArray.random(16);

  // Derive an encryption key using PBKDF2
  const key = CryptoJS.PBKDF2(masterKey, iv, {
    keySize: 256 / 32,
    iterations: 10000
  });

  // Encrypt the password using AES-CBC
  const encrypted = CryptoJS.AES.encrypt(password, key, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: iv
  });

  // Return IV + Encrypted data as Base64
  return CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext));
};

export const decryptPassword = async (encryptedData: string, masterKey: string): Promise<string> => {
  try {
    // Convert the encrypted data from Base64
    const encryptedWordArray = CryptoJS.enc.Base64.parse(encryptedData);

    // Extract IV (first 16 bytes)
    const iv = CryptoJS.lib.WordArray.create(encryptedWordArray.words.slice(0, 4));

    // Extract actual ciphertext
    const ciphertext = CryptoJS.lib.WordArray.create(encryptedWordArray.words.slice(4));

    // Derive the key using PBKDF2
    const key = CryptoJS.PBKDF2(masterKey, iv, {
      keySize: 256 / 32,
      iterations: 10000
    });

    // Decrypt the password using AES-CBC
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        key,
        {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
          iv: iv
        }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    throw new Error('Failed to decrypt password');
  }
};
