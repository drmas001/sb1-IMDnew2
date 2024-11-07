import React, { useEffect, useState } from 'react';
import { Calendar, Search, FileText } from 'lucide-react';
import { useDischargeStore } from '../../stores/useDischargeStore';
import { useUserStore } from '../../stores/useUserStore';
import { useNavigate } from '../../hooks/useNavigate';

interface DischargeFormData {
  discharge_date: string;
  discharge_type: 'regular' | 'against-medical-advice' | 'transfer';
  follow_up_required: boolean;
  follow_up_date?: string;
  discharge_note: string;
}

const DischargeForm = () => {
  const {
    activePatients,
    loading,
    error,
    selectedPatient,
    fetchActivePatients,
    setSelectedPatient,
    processDischarge
  } = useDischargeStore();

  const { currentUser } = useUserStore();
  const { goBack } = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<DischargeFormData>({
    discharge_date: new Date().toISOString().split('T')[0],
    discharge_type: 'regular',
    follow_up_required: false,
    discharge_note: ''
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivePatients();
  }, [fetchActivePatients]);

  const filteredPatients = activePatients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.mrn.includes(searchQuery)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!currentUser) {
      setFormError('You must be logged in to process a discharge');
      return;
    }

    if (!selectedPatient) {
      setFormError('Please select a patient');
      return;
    }
    
    try {
      await processDischarge({
        ...formData,
        status: 'discharged'
      });
      goBack();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error processing discharge');
      console.error('Error processing discharge:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Patient Selection</h2>
      
      {formError && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {formError}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient name or MRN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
          />
        </div>

        <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
          {filteredPatients.map((patient) => (
            <button
              key={patient.id}
              onClick={() => setSelectedPatient(patient)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedPatient?.id === patient.id
                  ? 'bg-indigo-50 border-indigo-200'
                  : 'hover:bg-gray-50 border-gray-200'
              } border`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-600">MRN: {patient.mrn}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(patient.admission_date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{patient.department}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedPatient && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="discharge_date" className="block text-sm font-medium text-gray-700 mb-1">
                Discharge Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  id="discharge_date"
                  name="discharge_date"
                  value={formData.discharge_date}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="discharge_type" className="block text-sm font-medium text-gray-700 mb-1">
                Discharge Type
              </label>
              <select
                id="discharge_type"
                name="discharge_type"
                value={formData.discharge_type}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                required
              >
                <option value="regular">Regular Discharge</option>
                <option value="against-medical-advice">Against Medical Advice</option>
                <option value="transfer">Transfer to Another Facility</option>
              </select>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="follow_up_required"
                  name="follow_up_required"
                  checked={formData.follow_up_required}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="follow_up_required" className="ml-2 block text-sm text-gray-700">
                  Follow-up Required
                </label>
              </div>
              {formData.follow_up_required && (
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="follow_up_date"
                    name="follow_up_date"
                    value={formData.follow_up_date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="discharge_note" className="block text-sm font-medium text-gray-700 mb-1">
              Discharge Note
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                id="discharge_note"
                name="discharge_note"
                value={formData.discharge_note}
                onChange={handleChange}
                rows={6}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={goBack}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Process Discharge
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DischargeForm;