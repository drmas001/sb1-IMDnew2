import React from 'react';
import { Stethoscope } from 'lucide-react';
import LoginForm from '../components/LoginForm';

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left side - Hero section */}
        <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 p-12 items-center justify-center">
          <div className="max-w-md text-white">
            <div className="flex items-center space-x-3 mb-8">
              <Stethoscope className="h-10 w-10" />
              <h1 className="text-3xl font-bold">IMD-Care</h1>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Streamline Your Internal Medicine Department
            </h2>
            <p className="text-lg text-indigo-100 mb-8">
              Comprehensive patient management system designed specifically for internal medicine departments.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Efficient Patient Management</h3>
                  <p className="text-indigo-100">Track and manage patient care seamlessly</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Streamlined Workflows</h3>
                  <p className="text-indigo-100">Optimize department operations</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium">Comprehensive Reporting</h3>
                  <p className="text-indigo-100">Generate detailed insights and analytics</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Stethoscope className="h-8 w-8 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-900">IMD-Care</h1>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
              <p className="text-gray-600">
                Please sign in with your medical code
              </p>
            </div>
            
            <LoginForm onLogin={onLogin} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;