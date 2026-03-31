import { useState } from 'react';

export const useAppState = () => {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'select' | 'auth-client' | 'auth-agency' | 'auth-admin' | 'app-client' | 'app-agency' | 'app-admin'
  const [user, setUser] = useState(null);
  const [agencyBranding, setAgencyBranding] = useState({
    name: "Dakar Auto Services",
    activity: "Location et vente",
    city: "Dakar Plateau",
    color: "#D40511",
    logoUrl: "",
  });

  const handleGetStarted = () => setScreen('select');
  const handleRoleSelect = (role) => setScreen('auth-' + role);
  const handleBack = () => setScreen('landing');

  const handleClientLogin = (userData) => {
    setUser(userData);
    setScreen('app-client');
  };
  const handleAgencyLogin = () => setScreen('app-agency');
  const handleAdminLogin = () => setScreen('app-admin');

  const handleLogout = () => {
    setUser(null);
    setScreen('select');
  };

  return {
    screen,
    setScreen,
    user,
    setUser,
    agencyBranding,
    setAgencyBranding,
    handleGetStarted,
    handleRoleSelect,
    handleBack,
    handleClientLogin,
    handleAgencyLogin,
    handleAdminLogin,
    handleLogout,
  };
};