interface UserModel {
  user_id: string;
  full_name: string;
  email: string;
  password_hash: string;
  phone_number: string;
  avatar_url: string;
  role: 'admin' | 'user';
  auth_provider: 'local' | 'google' | 'facebook' | 'twitter';
  provider_id: string;
  created_at: Date;
  updated_at: Date;
}

export default UserModel;
