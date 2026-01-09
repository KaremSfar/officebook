import { User, LoginCredentials, RegisterCredentials } from '../types';
import { pb } from './pocketbaseClient';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const authData = await pb.collection('users').authWithPassword(
      credentials.email,
      credentials.password,
    );

    const user = authData.record;

    return {
      id: user.id,
      email: user.email || '',
      name: user.full_name || 'User',
      avatar: user.avatar ? pb.files.getUrl(user, user.avatar) : `https://i.pravatar.cc/150?u=${user.email}`,
      role: 'EMPLOYEE',
    };
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const data = {
      email: credentials.email,
      password: credentials.password,
      passwordConfirm: credentials.password,
      full_name: credentials.name,
    };

    const record = await pb.collection('users').create(data);
    
    // After registration, we usually need to login to get the auth token
    return authService.login({
      email: credentials.email,
      password: credentials.password,
    });
  },

  logout: async (): Promise<void> => {
    pb.authStore.clear();
  },

  getCurrentUser: async (): Promise<User | null> => {
    if (!pb.authStore.isValid) return null;

    const user = pb.authStore.model;
    if (!user) return null;

    return {
      id: user.id,
      email: user.email || '',
      name: user.full_name || 'User',
      avatar: user.avatar ? pb.files.getUrl(user, user.avatar) : `https://i.pravatar.cc/150?u=${user.email}`,
      role: 'EMPLOYEE',
    };
  }
};
