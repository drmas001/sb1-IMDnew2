import React, { useEffect, useState } from 'react';
import { usePatientStore } from '../stores/usePatientStore';
import { useConsultationStore } from '../stores/useConsultationStore';
import { User, Calendar, Stethoscope, Shield, RefreshCw } from 'lucide-react';

interface SpecialtiesProps {
  onNavigateToPatient: () => void;
}

const Specialties: React.FC<SpecialtiesProps> = ({ onNavigateToPatient }) => {
  const { patients, loading: loadingPatients, error: patientError, fetchPatients, setSelectedPatient } = usePatientStore();
  const { consultations, loading: loadingConsultations, error: consultationError, fetchConsultations } = useConsultationStore();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [viewType, setViewType] = useState<'all' | 'patients' | 'consultations'>('all');

  const specialties = [
    'Internal Medicine',
    'Pulmonology',
    'Neurology',
    'Gastroenterology',
    'Rheumatology',
    'Endocrinology',
    'Hematology',
    'Infectious Disease',
    'Thrombosis Medicine',
    'Immunology & Allergy',
    'Safety Admission'
  ];

  useEffect(() => {
    fetchPatients();
    fetchConsultations();
  }, [fetchPatients, fetchConsultations]);

  const getActivePatientsBySpecialty = (specialty: string) => {
    return patients.filter(patient => 
      patient.admissions?.some(admission => 
        admission.department === specialty && 
        admission.status === 'active'
      )
    );
  };

  const getActiveConsultationsBySpecialty = (specialty: string) => {
    return consultations.filter(consultation => 
      consultation.consultation_specialty === specialty && 
      consultation.status === 'active'
    );
  };

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient);
    onNavigateToPatient();
  };

  const handleConsultationClick = (consultation: any) => {
    const patient = patients.find(p => p.mrn === consultation.mrn);
    if (patient) {
      setSelectedPatient(patient);
      onNavigateToPatient();
    }
  };

  const getSafetyBadgeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'observation': return 'bg-yellow-100 text-yellow-800';
      case 'short-stay': return 'bg-green-100 text-green-800';
      default: return '';
    }
  };

  if (loadingPatients || loadingConsultations) {
    return (
      <div className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (patientError || consultationError) {
    return (
      <div className="flex-1 p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Error loading data: {patientError || consultationError}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Specialties</h1>
        <p className="text-gray-600">View patients and consultations by specialty</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Filter View</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewType('all')}
              className={`px-4 py-2 text-sm rounded-lg ${
                viewType === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setViewType('patients')}
              className={`px-4 py-2 text-sm rounded-lg ${
                viewType === 'patients'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Patients
            </button>
            <button
              onClick={() => setViewType('consultations')}
              className={`px-4 py-2 text-sm rounded-lg ${
                viewType === 'consultations'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Consultations
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {specialties.map((specialty) => {
          const activePatients = getActivePatientsBySpecialty(specialty);
          const activeConsultations = getActiveConsultationsBySpecialty(specialty);

          if (
            (viewType === 'patients' && activePatients.length === 0) ||
            (viewType === 'consultations' && activeConsultations.length === 0) ||
            (viewType === 'all' && activePatients.length === 0 && activeConsultations.length === 0)
          ) {
            return null;
          }

          return (
            <div key={specialty} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{specialty}</h2>
                <div className="mt-2 flex space-x-4">
                  <span className="text-sm text-gray-600">
                    {activePatients.length} Active {activePatients.length === 1 ? 'Patient' : 'Patients'}
                  </span>
                  <span className="text-sm text-gray-600">
                    {activeConsultations.length} Pending {activeConsultations.length === 1 ? 'Consultation' : 'Consultations'}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {(viewType === 'all' || viewType === 'patients') && activePatients.map((patient) => {
                  const activeAdmission = patient.admissions?.find(a => a.status === 'active');
                  if (!activeAdmission) return null;

                  return (
                    <div
                      key={`patient-${patient.id}-${activeAdmission.visit_number}`}
                      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(patient)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 bg-indigo-50 rounded-lg">
                            <User className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{patient.name}</h3>
                            <p className="text-sm text-gray-600">MRN: {patient.mrn}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(activeAdmission.admission_date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Stethoscope className="h-4 w-4 mr-1" />
                                {activeAdmission.users?.name}
                              </div>
                              {activeAdmission.visit_number > 1 && (
                                <div className="flex items-center text-sm text-purple-600">
                                  <RefreshCw className="h-4 w-4 mr-1" />
                                  Visit #{activeAdmission.visit_number}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Inpatient
                          </span>
                          {activeAdmission.safety_type && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              getSafetyBadgeColor(activeAdmission.safety_type)
                            }`}>
                              <Shield className="h-3 w-3 mr-1" />
                              Safety - {activeAdmission.safety_type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {(viewType === 'all' || viewType === 'consultations') && activeConsultations.map((consultation) => (
                  <div
                    key={`consultation-${consultation.id}`}
                    className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleConsultationClick(consultation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Stethoscope className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{consultation.patient_name}</h3>
                          <p className="text-sm text-gray-600">MRN: {consultation.mrn}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(consultation.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="h-4 w-4 mr-1" />
                              {consultation.requesting_department}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Consultation
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          consultation.urgency === 'emergency'
                            ? 'bg-red-100 text-red-800'
                            : consultation.urgency === 'urgent'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {consultation.urgency}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Reason:</span> {consultation.reason}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Specialties;