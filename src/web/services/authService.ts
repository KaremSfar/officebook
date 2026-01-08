import { User, LoginCredentials, RegisterCredentials } from '../types';
import { supabase } from './supabaseClient';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('No user found');

    return {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata.full_name || 'User',
      avatar: data.user.user_metadata.avatar_url || `https://i.pravatar.cc/150?u=${data.user.email}`,
      role: 'EMPLOYEE',
    };
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          full_name: credentials.name,
          avatar_url: `https://i.pravatar.cc/150?u=${credentials.email}`,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Signup failed');

    return {
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata.full_name || credentials.name,
      avatar: data.user.user_metadata.avatar_url || `https://i.pravatar.cc/150?u=${data.user.email}`,
      role: 'EMPLOYEE',
    };
  },

  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getCurrentUser: async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    return {
      id: session.user.id,
      email: session.user.email || '',
      name: session.user.user_metadata.full_name || 'User',
      avatar: session.user.user_metadata.avatar_url || `https://i.pravatar.cc/150?u=${session.user.email}`,
      role: 'EMPLOYEE',
    };
  }
};
