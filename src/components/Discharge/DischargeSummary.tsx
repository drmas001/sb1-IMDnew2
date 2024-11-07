import React from 'react';
import { FileText, Download, Printer } from 'lucide-react';
import { useDischargeStore } from '../../stores/useDischargeStore';

const DischargeSummary = () => {
  const { selectedPatient } = useDischargeStore();

  if (!selectedPatient) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-2" />
          <p>Select a patient to view discharge summary</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Discharge Summary</h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg">
            <Printer className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-5 w-5 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-900">Patient Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Name</p>
              <p className="font-medium text-gray-900">{selectedPatient.name}</p>
            </div>
            <div>
              <p className="text-gray-600">MRN</p>
              <p className="font-medium text-gray-900">{selectedPatient.mrn}</p>
            </div>
            <div>
              <p className="text-gray-600">Admission Date</p>
              <p className="font-medium text-gray-900">
                {new Date(selectedPatient.admission_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Department</p>
              <p className="font-medium text-gray-900">{selectedPatient.department}</p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-5 w-5 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-900">Diagnosis & Treatment</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-600">Admitting Doctor</p>
              <p className="font-medium text-gray-900">{selectedPatient.admitting_doctor}</p>
            </div>
            <div>
              <p className="text-gray-600">Primary Diagnosis</p>
              <p className="font-medium text-gray-900">{selectedPatient.diagnosis}</p>
            </div>
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-5 w-5 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-900">Discharge Plan</h3>
          </div>
          <div className="space-y-4 text-sm">
            <p className="text-gray-600">
              Complete the discharge form to generate the full discharge summary including:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Discharge medications</li>
              <li>Follow-up appointments</li>
              <li>Care instructions</li>
              <li>Emergency contact information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DischargeSummary;