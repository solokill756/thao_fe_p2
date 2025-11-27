import { AuthProvider, Role } from '@prisma/client';

export interface UserWithStats {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string | null;
  avatar_url: string | null;
  role: Role;
  auth_provider: AuthProvider;
  created_at: Date | null;
  updated_at: Date | null;
  bookingsCount: number;
  totalSpent: number;
}
