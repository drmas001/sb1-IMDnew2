import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { usePatientStore } from '../../stores/usePatientStore';

interface SafetyAdmissionStatsProps {
  dateFilter: {
    startDate: string;
    endDate: string;
    period: string;
  };
}

const SafetyAdmissionStats: React.FC<SafetyAdmissionStatsProps> = ({ dateFilter }) => {
  const { patients } = usePatientStore();

  const getSafetyData = () => {
    const filtered = patients.filter(patient =>
      patient.admissions?.some(admission =>
        admission.safety_type &&
        new Date(admission.admission_date) >= new Date(dateFilter.startDate) &&
        new Date(admission.admission_date) <= new Date(dateFilter.endDate)
      )
    );

    const counts = {
      emergency: 0,
      observation: 0,
      'short-stay': 0
    };

    filtered.forEach(patient => {
      const safetyType = patient.admissions?.[0]?.safety_type;
      if (safetyType) {
        counts[safetyType as keyof typeof counts]++;
      }
    });

    return Object.entries(counts).map(([key, value]) => ({
      type: key.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      count: value,
      color: key === 'emergency' ? '#ef4444' : key === 'observation' ? '#f59e0b' : '#10b981'
    }));
  };

  const getTotalSafetyAdmissions = () => {
    return patients.filter(patient =>
      patient.admissions?.some(admission =>
        admission.safety_type &&
        new Date(admission.admission_date) >= new Date(dateFilter.startDate) &&
        new Date(admission.admission_date) <= new Date(dateFilter.endDate)
      )
    ).length;
  };

  const data = getSafetyData();
  const total = getTotalSafetyAdmissions();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Safety Admission Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Distribution by Type</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ type, count }) => `${type}: ${count}`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-4">Summary</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Safety Admissions</p>
              <p className="text-2xl font-bold text-gray-900">{total}</p>
            </div>
          </div>

          <div className="space-y-4">
            {data.map(({ type, count, color }) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm text-gray-600">{type}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyAdmissionStats;