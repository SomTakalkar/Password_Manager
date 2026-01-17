export interface User {
  id: string;
  email: string;
  masterPasswordHash: string;
  twoFactorEnabled: boolean;
}

export interface StoredPassword {
  id: string;
  user_id: string;
  title: string;
  username: string;
  encrypted_password: string; // Encrypted content
  url?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeUppercase: boolean;
  includeLowercase: boolean;
  excludeAmbiguous: boolean;
}