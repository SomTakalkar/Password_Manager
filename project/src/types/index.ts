export interface User {
  id: string;
  email: string;
  masterPasswordHash: string;
  twoFactorEnabled: boolean;
}

export interface StoredPassword {
  id: string;
  title: string;
  username: string;
  password: string; // Encrypted
  url?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeUppercase: boolean;
  includeLowercase: boolean;
  excludeAmbiguous: boolean;
}