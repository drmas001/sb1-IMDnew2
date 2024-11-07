import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useUserStore } from './useUserStore';

interface ActivePatient {
  id: number;
  patient_id: number;
  mrn: string;
  name: string;
  admission_date: string;
  department: string;
  doctor_name: string;
  diagnosis: string;
  status: 'active' | 'discharged' | 'transferred';
  admitting_doctor_id: number;
}

interface DischargeData {
  discharge_date: string;
  discharge_type: 'regular' | 'against-medical-advice' | 'transfer';
  follow_up_required: boolean;
  follow_up_date?: string;
  discharge_note: string;
}

interface DischargeStore {
  activePatients: ActivePatient[];
  loading: boolean;
  error: string | null;
  selectedPatient: ActivePatient | null;
  fetchActivePatients: () => Promise<void>;
  setSelectedPatient: (patient: ActivePatient | null) => void;
  processDischarge: (data: DischargeData) => Promise<void>;
}

export const useDischargeStore = create<DischargeStore>((set, get) => ({
  activePatients: [],
  loading: false,
  error: null,
  selectedPatient: null,

  fetchActivePatients: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('active_admissions')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      set({ activePatients: data || [], loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  setSelectedPatient: (patient) => {
    set({ selectedPatient: patient });
  },

  processDischarge: async (data) => {
    set({ loading: true, error: null });
    try {
      const selectedPatient = get().selectedPatient;
      const currentUser = useUserStore.getState().currentUser;

      if (!selectedPatient) throw new Error('No patient selected');
      if (!currentUser) throw new Error('No user logged in');

      // Update admission status and discharge details
      const { error: updateError } = await supabase
        .from('admissions')
        .update({
          status: 'discharged',
          discharge_date: data.discharge_date,
          discharge_type: data.discharge_type,
          follow_up_required: data.follow_up_required,
          follow_up_date: data.follow_up_date || null
        })
        .eq('id', selectedPatient.id);

      if (updateError) throw updateError;

      // Add discharge note as a medical note
      const { error: noteError } = await supabase
        .from('medical_notes')
        .insert([{
          patient_id: selectedPatient.patient_id,
          doctor_id: currentUser.id, // Use the current user's ID
          note_type: 'Discharge Summary',
          content: data.discharge_note
        }]);

      if (noteError) throw noteError;

      // Refresh the active patients list
      await get().fetchActivePatients();
      set({ selectedPatient: null, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  }
}));