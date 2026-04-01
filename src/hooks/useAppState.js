import { useState } from 'react';

const initialChatThreads = [
  {
    id: 'conv-prado-moussa',
    subject: 'Toyota Prado 2021 · Location',
    agencyName: 'Dakar Auto Services',
    clientName: 'Moussa Diallo',
    vehicleName: 'Toyota Prado 2021',
    lastMessageAt: '2026-04-01T09:20:00',
    messages: [
      { id: 'm1', senderRole: 'client', senderName: 'Moussa Diallo', text: 'Bonjour, le Toyota Prado est-il disponible du 2 au 5 avril ?', sentAt: '2026-04-01T08:45:00' },
      { id: 'm2', senderRole: 'agency', senderName: 'Dakar Auto Services', text: 'Bonjour, oui il est disponible. Souhaitez-vous un retrait a l’aeroport DSS ?', sentAt: '2026-04-01T09:00:00' },
      { id: 'm3', senderRole: 'client', senderName: 'Moussa Diallo', text: 'Oui, a l’aeroport si possible vers 10h.', sentAt: '2026-04-01T09:20:00' },
    ],
  },
  {
    id: 'conv-kia-aissatou',
    subject: 'Kia Sportage 2019 · Achat',
    agencyName: 'Dakar Auto Services',
    clientName: 'Aissatou Dieng',
    vehicleName: 'Kia Sportage 2019',
    lastMessageAt: '2026-03-31T16:40:00',
    messages: [
      { id: 'm4', senderRole: 'client', senderName: 'Aissatou Dieng', text: 'Bonjour, puis-je programmer une visite pour la Kia Sportage cette semaine ?', sentAt: '2026-03-31T16:15:00' },
      { id: 'm5', senderRole: 'agency', senderName: 'Dakar Auto Services', text: 'Oui, une visite est possible jeudi apres-midi. Je peux vous confirmer le lieu.', sentAt: '2026-03-31T16:40:00' },
    ],
  },
];

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
  const [chatThreads, setChatThreads] = useState(initialChatThreads);


  const handleGetStarted = () => setScreen('select');
  const handleRoleSelect = (role) => setScreen('auth-' + role);
  const handleBack = () => setScreen('landing');
  const handleBackToSelect = () => setScreen('select');
  const handleGoToLanding = () => setScreen('landing');

  const handleClientLogin = (userData) => {
    setUser(userData);
    setScreen('app-client');
  };
  const handleAgencyLogin = () => setScreen('app-agency');
  const handleAdminLogin = () => setScreen('app-admin');

  const handleRegisterAgency = (agencyData) => {
    setAgencyBranding(agencyData);
  };

  const handleClientLogout = () => {
    setUser(null);
    setScreen('auth-client');
  };

  const handleAgencyLogout = () => {
    setUser(null);
    setScreen('auth-agency');
  };

  const handleAdminLogout = () => {
    setUser(null);
    setScreen('auth-admin');
  };

  const sendChatMessage = ({ threadId, senderRole, senderName, text }) => {
    const cleanText = text?.trim();
    if (!cleanText) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderRole,
      senderName,
      text: cleanText,
      sentAt: new Date().toISOString(),
    };

    setChatThreads((current) =>
      current.map((thread) =>
        thread.id === threadId
          ? {
              ...thread,
              lastMessageAt: newMessage.sentAt,
              messages: [...thread.messages, newMessage],
            }
          : thread
      )
    );
  };

  return {
    screen,
    setScreen,
    user,
    setUser,
    agencyBranding,
    setAgencyBranding,
    chatThreads,
    setChatThreads,
    handleGetStarted,
    handleRoleSelect,
    handleBack,
    handleBackToSelect,
    handleGoToLanding,
    handleClientLogin,
    handleAgencyLogin,
    handleAdminLogin,
    handleRegisterAgency,
    handleClientLogout,
    handleAgencyLogout,
    handleAdminLogout,
    sendChatMessage,
  };
};
