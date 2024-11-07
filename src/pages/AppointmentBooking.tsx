import React from 'react';
import ClinicAppointmentForm from '../components/Appointments/ClinicAppointmentForm';

const AppointmentBooking: React.FC = () => {
  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Book Clinic Appointment</h1>
        <p className="text-gray-600">Schedule a consultation with our specialists</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <ClinicAppointmentForm />
      </div>
    </div>
  );
};

export default AppointmentBooking;