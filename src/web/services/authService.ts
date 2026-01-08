import { User, LoginCredentials, RegisterCredentials } from '../types';
import { storageService } from './storageService';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    await delay(800);
    const users = storageService.getUsers();
    const foundUser = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );

    if (foundUser) {
      const { password: _, ...userData } = foundUser;
      storageService.setCurrentUser(userData);
      return userData;
    }
    throw new Error('Invalid email or password');
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    await delay(1000);
    const users = storageService.getUsers();
    
    if (users.some(u => u.email === credentials.email)) {
      throw new Error('User already exists');
    }

    const newUser: User & { password?: string } = {
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      email: credentials.email,
      name: credentials.name,
      password: credentials.password,
      role: 'EMPLOYEE',
      avatar: `https://i.pravatar.cc/150?u=${credentials.email}`
    };

    storageService.saveUser(newUser);
    const { password: _, ...userData } = newUser;
    storageService.setCurrentUser(userData);
    return userData;
  },

  logout: async (): Promise<void> => {
    await delay(500);
    storageService.setCurrentUser(null);
  },

  getCurrentUser: async (): Promise<User | null> => {
    await delay(300);
    return storageService.getCurrentUser();
  }
};
