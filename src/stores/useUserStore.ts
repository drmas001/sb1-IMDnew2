import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type User = Database['public']['Tables']['users']['Row'];
type NewUser = Omit<User, 'id' | 'created_at' | 'updated_at'>;

interface UserStore {
  users: User[];
  loading: boolean;
  error: string | null;
  currentUser: User | null;
  selectedUser: User | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: NewUser) => Promise<void>;
  updateUser: (id: number, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  login: (medicalCode: string) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  loading: false,
  error: null,
  currentUser: null,
  selectedUser: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ users: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addUser: async (user) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([user])
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        users: [data, ...state.users],
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  updateUser: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        users: state.users.map(u => u.id === id ? data : u),
        selectedUser: state.selectedUser?.id === id ? data : state.selectedUser,
        currentUser: state.currentUser?.id === id ? data : state.currentUser,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        users: state.users.filter(u => u.id !== id),
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  login: async (medicalCode) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('medical_code', medicalCode)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      if (!data) throw new Error('User not found or inactive');

      set({ currentUser: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  logout: () => {
    set({ currentUser: null });
  }
}));