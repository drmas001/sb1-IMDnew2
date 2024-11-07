import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Patient = Database['public']['Tables']['patients']['Row'] & {
  doctor_name?: string;
  department?: string;
  diagnosis?: string;
  admission_date?: string;
  admissions?: Array<{
    status: 'active' | 'discharged' | 'transferred';
    admission_date: string;
    discharge_date: string | null;
    department: string;
    diagnosis: string;
    visit_number: number;
    users?: {
      name: string;
    };
  }>;
};

interface PatientStore {
  patients: Patient[];
  selectedPatient: Patient | null;
  loading: boolean;
  error: string | null;
  fetchPatients: () => Promise<void>;
  addPatient: (patientData: any) => Promise<void>;
  updatePatient: (id: number, updates: Partial<Patient>) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
  setSelectedPatient: (patient: Patient | null) => void;
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  patients: [],
  selectedPatient: null,
  loading: false,
  error: null,

  setSelectedPatient: (patient) => {
    set({ selectedPatient: patient });
  },

  fetchPatients: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          admissions (
            admission_date,
            discharge_date,
            department,
            diagnosis,
            status,
            visit_number,
            users (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const patientsWithDetails = data?.map(patient => ({
        ...patient,
        doctor_name: patient.admissions?.[0]?.users?.name,
        department: patient.admissions?.[0]?.department,
        diagnosis: patient.admissions?.[0]?.diagnosis,
        admission_date: patient.admissions?.[0]?.admission_date,
        admissions: patient.admissions?.sort((a, b) => 
          new Date(b.admission_date).getTime() - new Date(a.admission_date).getTime()
        )
      })) || [];

      set({ patients: patientsWithDetails, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addPatient: async (patientData) => {
    set({ loading: true, error: null });
    try {
      // Check if patient with MRN already exists
      const { data: existingPatient } = await supabase
        .from('patients')
        .select('id, mrn')
        .eq('mrn', patientData.mrn)
        .single();

      let patientId;

      if (existingPatient) {
        // If patient exists, get the latest visit number
        const { data: latestVisit } = await supabase
          .from('admissions')
          .select('visit_number')
          .eq('patient_id', existingPatient.id)
          .order('visit_number', { ascending: false })
          .limit(1)
          .single();

        const nextVisitNumber = (latestVisit?.visit_number || 0) + 1;

        // Create new admission for existing patient
        const { error: admissionError } = await supabase
          .from('admissions')
          .insert([{
            patient_id: existingPatient.id,
            visit_number: nextVisitNumber,
            ...patientData.admission,
            status: 'active'
          }]);

        if (admissionError) throw admissionError;
        patientId = existingPatient.id;
      } else {
        // Create new patient if doesn't exist
        const { data: newPatient, error: patientError } = await supabase
          .from('patients')
          .insert([{
            mrn: patientData.mrn,
            name: patientData.name,
            date_of_birth: patientData.date_of_birth,
            gender: patientData.gender
          }])
          .select()
          .single();

        if (patientError) throw patientError;

        // Create first admission for new patient
        const { error: admissionError } = await supabase
          .from('admissions')
          .insert([{
            patient_id: newPatient.id,
            visit_number: 1,
            ...patientData.admission,
            status: 'active'
          }]);

        if (admissionError) throw admissionError;
        patientId = newPatient.id;
      }

      await get().fetchPatients();
      set({ loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  updatePatient: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      set(state => ({
        patients: state.patients.map(p => p.id === id ? { ...p, ...data } : p),
        selectedPatient: state.selectedPatient?.id === id ? { ...state.selectedPatient, ...data } : state.selectedPatient,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  deletePatient: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set(state => ({
        patients: state.patients.filter(p => p.id !== id),
        selectedPatient: state.selectedPatient?.id === id ? null : state.selectedPatient,
        loading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  }
}));