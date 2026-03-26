import { create } from 'zustand';
import type { User } from '@/types/user.types';
import {
  getStoredUsers,
  setStoredUsers,
  generateUserId,
} from '@/services/user.service';

interface UserState {
  activeUserId: string | null;
  users: Record<string, User>;
  login: (userId: string) => void;
  logout: () => void;
  createUser: (name: string) => string;
  updateUser: (userId: string, data: Partial<Pick<User, 'name'>>) => void;
  deleteUser: (userId: string) => void;
}

const initial = getStoredUsers();

export const useUserStore = create<UserState>((set, get) => ({
  activeUserId: initial.active_user,
  users: initial.users,

  login: (userId) => {
    set({ activeUserId: userId });
    const { users } = get();
    setStoredUsers({ active_user: userId, users });
  },

  logout: () => {
    set({ activeUserId: null });
    const { users } = get();
    setStoredUsers({ active_user: null, users });
  },

  createUser: (name) => {
    const id = generateUserId();
    const user: User = { id, name };
    set((state) => {
      const users = { ...state.users, [id]: user };
      setStoredUsers({ active_user: state.activeUserId, users });
      return { users };
    });
    return id;
  },

  updateUser: (userId, data) => {
    set((state) => {
      const existing = state.users[userId];
      if (!existing) return state;
      const users = { ...state.users, [userId]: { ...existing, ...data } };
      setStoredUsers({ active_user: state.activeUserId, users });
      return { users };
    });
  },

  deleteUser: (userId) => {
    set((state) => {
      const { [userId]: _, ...rest } = state.users;
      const activeUserId =
        state.activeUserId === userId ? null : state.activeUserId;
      setStoredUsers({ active_user: activeUserId, users: rest });
      return { users: rest, activeUserId };
    });
  },
}));
