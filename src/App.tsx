import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import SpecialtiesGrid from './components/SpecialtiesGrid';
import NewAdmission from './pages/NewAdmission';
import PatientProfile from './pages/PatientProfile';
import ConsultationRegistration from './pages/ConsultationRegistration';
import Reports from './pages/Reports';
import PatientDischarge from './pages/PatientDischarge';
import Specialties from './pages/Specialties';
import LandingPage from './pages/LandingPage';
import EmployeeManagement from './components/Administration/EmployeeManagement';
import AppointmentBooking from './pages/AppointmentBooking';
import DashboardStats from './components/Dashboard/DashboardStats';
import Profile from './pages/Profile';
import { useSupabase } from './hooks/useSupabase';
import { useUserStore } from './stores/useUserStore';
import { Page, isValidPage } from './types/navigation';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [notifications, setNotifications] = useState(2);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoading, error } = useSupabase();
  const { currentUser, logout } = useUserStore();

  useEffect(() => {
    if (currentUser?.role === 'administrator') {
      setCurrentPage('employees');
    }
  }, [currentUser]);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.slice(1) || 'dashboard';
      if (isValidPage(path)) {
        setCurrentPage(path);
      }
    };

    const handleNavigate = (event: Event) => {
      const page = (event as CustomEvent).detail;
      if (isValidPage(page)) {
        setCurrentPage(page);
        window.history.pushState({}, '', `/${page}`);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('navigate', handleNavigate);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('navigate', handleNavigate);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    logout();
  };

  const handleNotificationClick = () => {
    setNotifications(0);
    setIsMobileMenuOpen(false);
  };

  const handleUserMenuClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page}`);
    setIsMobileMenuOpen(false);
  };

  const handleSpecialtyClick = (specialty: string) => {
    setCurrentPage('specialties');
    window.history.pushState({}, '', '/specialties');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading application</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <main className="flex-1 p-4 md:p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Overview of all departments and patients</p>
            </div>
            <DashboardStats />
            <SpecialtiesGrid onSpecialtyClick={handleSpecialtyClick} />
          </main>
        );
      case 'admission':
        return <NewAdmission />;
      case 'patient':
        return <PatientProfile />;
      case 'consultation':
        return <ConsultationRegistration />;
      case 'reports':
        return <Reports />;
      case 'discharge':
        return <PatientDischarge />;
      case 'specialties':
        return <Specialties onNavigateToPatient={() => handlePageChange('patient')} />;
      case 'appointments':
        return <AppointmentBooking />;
      case 'employees':
        return currentUser?.role === 'administrator' ? <EmployeeManagement /> : null;
      case 'profile':
        return <Profile />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={handlePageChange}
        onLogout={handleLogout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      <div className="flex-1 flex flex-col">
        <DashboardHeader 
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          isUserMenuOpen={isUserMenuOpen}
          onUserMenuClick={handleUserMenuClick}
          onLogout={handleLogout}
          onProfileClick={() => handlePageChange('profile')}
          onMobileMenuClick={() => setIsMobileMenuOpen(true)}
        />
        <div className="flex-1 overflow-y-auto">
          {renderPage()}
        </div>
      </div>
    </div>
  );
};

export default App;