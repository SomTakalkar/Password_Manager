import CryptoJS from 'crypto-js';
// #import * as argon2 from 'argon2-browser'; // Argon2 is not used in this snippet

export const encryptPassword = async (password: string, masterKey: string): Promise<string> => {
  // Generate a random IV (Initialization Vector) which will also be used as the salt for PBKDF2
  const iv = CryptoJS.lib.WordArray.random(16);

  // Derive an encryption key using PBKDF2.
  // DO NOT convert the key to a string. Use the WordArray object directly.
  const key = CryptoJS.PBKDF2(masterKey, iv, {
    keySize: 256 / 32,
    iterations: 10000
  });

  // Encrypt the password using AES-CBC
  const encrypted = CryptoJS.AES.encrypt(password, key, { // Pass the key object directly
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: iv
  });

  // Return IV + Encrypted data as a single Base64 string
  return CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext));
};

export const decryptPassword = async (encryptedData: string, masterKey: string): Promise<string> => {
  try {
    // Convert the encrypted data from Base64
    const encryptedWordArray = CryptoJS.enc.Base64.parse(encryptedData);

    // Extract IV (first 16 bytes)
    const iv = CryptoJS.lib.WordArray.create(encryptedWordArray.words.slice(0, 4));

    // Extract actual ciphertext (the rest of the data)
    const ciphertext = CryptoJS.lib.WordArray.create(encryptedWordArray.words.slice(4));

    // Derive the key using PBKDF2 with the same parameters
    const key = CryptoJS.PBKDF2(masterKey, iv, {
      keySize: 256 / 32,
      iterations: 10000
    });

    // Decrypt the password using AES-CBC
    // This line should now work correctly
    const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        key,
        {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
          iv: iv
        }
    );

    // Convert the decrypted data to a UTF-8 string
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

    // If the decrypted text is empty, it means decryption failed (e.g., wrong master key)
    if (!decryptedText) {
      throw new Error('Failed to decrypt password. Check the master key.');
    }

    return decryptedText;
  } catch (error) {
    // It's good practice to throw a more specific error.
    // A common failure is providing the wrong master key, which results in a malformed block upon decryption.
    throw new Error('Failed to decrypt password. Please ensure the master key is correct.');
  }
};