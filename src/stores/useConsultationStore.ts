import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Consultation = Database['public']['Tables']['consultations']['Row'];
type ConsultationInsert = Database['public']['Tables']['consultations']['Insert'];
type ConsultationUpdate = Database['public']['Tables']['consultations']['Update'];

interface ConsultationStore {
  consultations: Consultation[];
  loading: boolean;
  error: string | null;
  fetchConsultations: () => Promise<void>;
  addConsultation: (consultation: Omit<ConsultationInsert, 'id' | 'created_at' | 'updated_at'>) => Promise<Consultation | null>;
  updateConsultation: (id: number, updates: ConsultationUpdate) => Promise<void>;
}

export const useConsultationStore = create<ConsultationStore>((set, get) => ({
  consultations: [],
  loading: false,
  error: null,

  fetchConsultations: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ consultations: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addConsultation: async (consultation) => {
    set({ loading: true, error: null });
    try {
      const consultationData: ConsultationInsert = {
        ...consultation,
        patient_id: consultation.mrn,
        status: 'active'
      };

      const { data, error } = await supabase
        .from('consultations')
        .insert([consultationData])
        .select()
        .single();

      if (error) throw error;

      set(state => ({
        consultations: [data, ...state.consultations],
        loading: false
      }));

      return data;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return null;
    }
  },

  updateConsultation: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('consultations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      set(state => ({
        consultations: state.consultations.map(c => c.id === id ? data : c),
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  }
}));