import React, { useEffect } from 'react';
import { usePatientStore } from '../stores/usePatientStore';
import DischargeForm from '../components/Discharge/DischargeForm';
import DischargeSummary from '../components/Discharge/DischargeSummary';
import { useNavigate } from '../hooks/useNavigate';

const PatientDischarge = () => {
  const { selectedPatient } = usePatientStore();
  const { goBack } = useNavigate();

  useEffect(() => {
    // If no patient is selected or patient is not active, go back
    if (!selectedPatient || selectedPatient.admissions?.[0]?.status !== 'active') {
      goBack();
    }
  }, [selectedPatient, goBack]);

  if (!selectedPatient) {
    return null;
  }

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patient Discharge</h1>
        <p className="text-gray-600">Process patient discharge and create discharge summary</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DischargeForm />
        <DischargeSummary />
      </div>
    </div>
  );
};

export default PatientDischarge;