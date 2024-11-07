import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usePatientStore } from '../../stores/usePatientStore';

interface AdmissionTrendsProps {
  dateFilter: {
    startDate: string;
    endDate: string;
    period: string;
  };
}

const AdmissionTrends: React.FC<AdmissionTrendsProps> = ({ dateFilter }) => {
  const { patients } = usePatientStore();

  const getTrendData = () => {
    const startDate = new Date(dateFilter.startDate);
    const endDate = new Date(dateFilter.endDate);
    const data = [];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      
      const admissions = patients.filter(patient => 
        patient.admissions?.some(admission => 
          new Date(admission.admission_date).toISOString().split('T')[0] === dateStr
        )
      ).length;

      const discharges = patients.filter(patient => 
        patient.admissions?.some(admission => 
          admission.discharge_date && 
          new Date(admission.discharge_date).toISOString().split('T')[0] === dateStr
        )
      ).length;

      const readmissions = patients.filter(patient => 
        patient.admissions?.some(admission => 
          new Date(admission.admission_date).toISOString().split('T')[0] === dateStr &&
          admission.visit_number > 1
        )
      ).length;

      data.push({
        date: dateStr,
        admissions,
        discharges,
        readmissions
      });
    }

    return data;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Admission Trends</h2>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={getTrendData()}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="admissions" 
              name="New Admissions" 
              stroke="#4f46e5" 
              fill="#4f46e5" 
              fillOpacity={0.1}
            />
            <Area 
              type="monotone" 
              dataKey="discharges" 
              name="Discharges" 
              stroke="#10b981" 
              fill="#10b981" 
              fillOpacity={0.1}
            />
            <Area 
              type="monotone" 
              dataKey="readmissions" 
              name="Readmissions" 
              stroke="#f59e0b" 
              fill="#f59e0b" 
              fillOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-indigo-50 rounded-lg">
          <p className="text-sm font-medium text-indigo-600">Total Admissions</p>
          <p className="text-2xl font-bold text-indigo-900">
            {getTrendData().reduce((sum, day) => sum + day.admissions, 0)}
          </p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-sm font-medium text-green-600">Total Discharges</p>
          <p className="text-2xl font-bold text-green-900">
            {getTrendData().reduce((sum, day) => sum + day.discharges, 0)}
          </p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm font-medium text-yellow-600">Total Readmissions</p>
          <p className="text-2xl font-bold text-yellow-900">
            {getTrendData().reduce((sum, day) => sum + day.readmissions, 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdmissionTrends;