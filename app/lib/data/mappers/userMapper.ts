import UserModel from '../models/userModel';

type RawUserData = Record<string, string | undefined>;

export function mapToUserModel(data: RawUserData): UserModel {
  return {
    user_id: data.user_id ?? '',
    full_name: data.full_name ?? '',
    email: data.email ?? '',
    password_hash: data.password_hash ?? '',
    phone_number: data.phone_number ?? '',
    avatar_url: data.avatar_url ?? '',
    auth_provider:
      (data.auth_provider as 'local' | 'google' | 'facebook' | 'twitter') ??
      'local',
    provider_id: data.provider_id ?? '',
    created_at: data.created_at ? new Date(data.created_at) : new Date(),
    updated_at: data.updated_at ? new Date(data.updated_at) : new Date(),
    role: (data.role as 'admin' | 'user') ?? 'user',
  };
}

export function mapToUserModels(dataArray: RawUserData[]): UserModel[] {
  return dataArray.map(mapToUserModel);
}
