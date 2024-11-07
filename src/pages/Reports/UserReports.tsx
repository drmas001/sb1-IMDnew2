import React, { useState } from 'react';
import { Calendar, Download, Filter, Printer } from 'lucide-react';
import { usePatientStore } from '../../stores/usePatientStore';
import { useConsultationStore } from '../../stores/useConsultationStore';
import { useAppointmentStore } from '../../stores/useAppointmentStore';
import { exportToPDF } from '../../utils/pdfExport';

type TabType = 'all' | 'admissions' | 'consultations' | 'appointments';

const UserReports: React.FC = () => {
  const { patients } = usePatientStore();
  const { consultations } = useConsultationStore();
  const { appointments } = useAppointmentStore();
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [specialty, setSpecialty] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const handleExport = () => {
    try {
      exportToPDF({
        patients: getFilteredAdmissions(),
        consultations: getFilteredConsultations(),
        appointments: getFilteredAppointments(),
        activeTab,
        dateFilter: {
          startDate: dateFilter.startDate,
          endDate: dateFilter.endDate,
          period: 'custom'
        }
      });
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export report. Please try again.');
    }
  };

  const getFilteredAdmissions = () => {
    return patients.filter(patient => {
      const activeAdmission = patient.admissions?.find(a => a.status === 'active');
      if (!activeAdmission) return false;

      const matchesDate = new Date(activeAdmission.admission_date) >= new Date(dateFilter.startDate) &&
                         new Date(activeAdmission.admission_date) <= new Date(dateFilter.endDate);
      const matchesSpecialty = specialty === 'all' || activeAdmission.department === specialty;

      return matchesDate && matchesSpecialty;
    });
  };

  const getFilteredConsultations = () => {
    return consultations.filter(consultation => {
      const matchesDate = new Date(consultation.created_at) >= new Date(dateFilter.startDate) &&
                         new Date(consultation.created_at) <= new Date(dateFilter.endDate);
      const matchesSpecialty = specialty === 'all' || consultation.consultation_specialty === specialty;

      return matchesDate && matchesSpecialty;
    });
  };

  const getFilteredAppointments = () => {
    return appointments.filter(appointment => {
      const matchesDate = new Date(appointment.createdAt) >= new Date(dateFilter.startDate) &&
                         new Date(appointment.createdAt) <= new Date(dateFilter.endDate);
      const matchesSpecialty = specialty === 'all' || appointment.specialty === specialty;

      return matchesDate && matchesSpecialty;
    });
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">View and filter department activities</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden md:inline">Print</span>
            </button>
            <button 
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="hidden md:inline">Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={dateFilter.startDate}
                onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={dateFilter.endDate}
                onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specialty
            </label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              >
                <option value="all">All Specialties</option>
                <option value="Internal Medicine">Internal Medicine</option>
                <option value="Pulmonology">Pulmonology</option>
                <option value="Neurology">Neurology</option>
                <option value="Gastroenterology">Gastroenterology</option>
                <option value="Rheumatology">Rheumatology</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Hematology">Hematology</option>
                <option value="Infectious Disease">Infectious Disease</option>
                <option value="Thrombosis Medicine">Thrombosis Medicine</option>
                <option value="Immunology & Allergy">Immunology & Allergy</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'all'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Reports
            </button>
            <button
              onClick={() => setActiveTab('admissions')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'admissions'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Admissions
            </button>
            <button
              onClick={() => setActiveTab('consultations')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'consultations'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Medical Consultations
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'appointments'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clinic Appointments
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Active Admissions */}
          {(activeTab === 'all' || activeTab === 'admissions') && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Admissions</h3>
              <div className="space-y-4">
                {getFilteredAdmissions().map((patient) => {
                  const activeAdmission = patient.admissions?.find(a => a.status === 'active');
                  return (
                    <div key={patient.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Patient Name</p>
                          <p className="font-medium">{patient.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">MRN</p>
                          <p className="font-medium">{patient.mrn}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Department</p>
                          <p className="font-medium">{activeAdmission?.department}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Admission Date</p>
                          <p className="font-medium">
                            {new Date(activeAdmission?.admission_date || '').toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Shift Type</p>
                          <p className="font-medium capitalize">{activeAdmission?.shift_type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Assigned Doctor</p>
                          <p className="font-medium">{activeAdmission?.users?.name || 'Not assigned'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-gray-600">Diagnosis</p>
                          <p className="font-medium">{activeAdmission?.diagnosis}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Medical Consultations */}
          {(activeTab === 'all' || activeTab === 'consultations') && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Consultations</h3>
              <div className="space-y-4">
                {getFilteredConsultations().map((consultation) => (
                  <div key={consultation.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Patient Name</p>
                        <p className="font-medium">{consultation.patient_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">MRN</p>
                        <p className="font-medium">{consultation.mrn}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Specialty</p>
                        <p className="font-medium">{consultation.consultation_specialty}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">
                          {new Date(consultation.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Shift Type</p>
                        <p className="font-medium capitalize">{consultation.shift_type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Urgency</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          consultation.urgency === 'emergency'
                            ? 'bg-red-100 text-red-800'
                            : consultation.urgency === 'urgent'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {consultation.urgency.toUpperCase()}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Reason</p>
                        <p className="font-medium">{consultation.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinic Appointments */}
          {(activeTab === 'all' || activeTab === 'appointments') && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinic Appointments</h3>
              <div className="space-y-4">
                {getFilteredAppointments().map((appointment) => (
                  <div key={appointment.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Patient Name</p>
                        <p className="font-medium">{appointment.patientName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Medical Number</p>
                        <p className="font-medium">{appointment.medicalNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Specialty</p>
                        <p className="font-medium">{appointment.specialty}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">
                          {new Date(appointment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          appointment.appointmentType === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {appointment.appointmentType.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <p className="font-medium capitalize">{appointment.status}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-600">Notes</p>
                        <p className="font-medium">{appointment.notes || 'No notes'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReports;