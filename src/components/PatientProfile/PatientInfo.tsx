import React from 'react';
import { User, Hash, Calendar, Stethoscope, FileText, Shield } from 'lucide-react';
import { usePatientStore } from '../../stores/usePatientStore';

const PatientInfo = () => {
  const { selectedPatient } = usePatientStore();

  const getSafetyBadgeColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'observation': return 'bg-yellow-100 text-yellow-800';
      case 'short-stay': return 'bg-green-100 text-green-800';
      default: return '';
    }
  };

  if (!selectedPatient) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="text-center text-gray-500">
          <User className="h-12 w-12 mx-auto mb-2" />
          <p>No patient selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details and Notes</h2>
      
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="text-sm font-medium text-gray-900">{selectedPatient.name}</p>
            </div>
          </div>
          {selectedPatient.admissions?.[0]?.safety_type && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              getSafetyBadgeColor(selectedPatient.admissions[0].safety_type)
            }`}>
              <Shield className="h-3 w-3 mr-1" />
              Safety - {selectedPatient.admissions[0].safety_type}
            </span>
          )}
        </div>

        <div className="flex items-start space-x-3">
          <Hash className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">MRN</p>
            <p className="text-sm font-medium text-gray-900">{selectedPatient.mrn}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="text-sm font-medium text-gray-900">
                {new Date().getFullYear() - new Date(selectedPatient.date_of_birth).getFullYear()} years
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <User className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Gender</p>
              <p className="text-sm font-medium text-gray-900 capitalize">{selectedPatient.gender}</p>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">Admission Date</p>
            <p className="text-sm font-medium text-gray-900">
              {new Date(selectedPatient.admission_date).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Stethoscope className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">Specialty</p>
            <p className="text-sm font-medium text-gray-900">{selectedPatient.department}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">Assigned Doctor</p>
            <p className="text-sm font-medium text-gray-900">{selectedPatient.doctor_name}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">Diagnosis</p>
            <p className="text-sm font-medium text-gray-900">{selectedPatient.diagnosis}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientInfo;