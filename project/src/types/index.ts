export interface User {
  id: string;
  email: string;
}

export interface StoredPassword {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PasswordGeneratorOptions {
  length: number;
  includeNumbers: boolean;
  includeSymbols: boolean;
  includeUppercase: boolean;
  includeLowercase: boolean;
  excludeAmbiguous: boolean;
}