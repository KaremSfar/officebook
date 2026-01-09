import { pb } from './pocketbaseClient';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar: string | null;
  updated_at?: string;
}

export const profileService = {
  async getProfile(userId: string): Promise<Profile | null> {
    const record = await pb.collection('users').getOne(userId);
    
    return {
      id: record.id,
      full_name: record.full_name,
      avatar: record.avatar ? pb.files.getUrl(record, record.avatar) : null,
      updated_at: record.updated,
    };
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    // PocketBase handles updated_at automatically
    await pb.collection('users').update(userId, updates);
  },

  async updatePassword(password: string) {
    const userId = pb.authStore.model?.id;
    if (!userId) throw new Error('Not authenticated');
    
    await pb.collection('users').update(userId, {
      password: password,
      passwordConfirm: password,
    });
  },

  async uploadAvatar(userId: string, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);

    const record = await pb.collection('users').update(userId, formData);
    return pb.files.getUrl(record, record.avatar);
  },
};
