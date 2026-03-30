import { EnhancedAuthForm } from "./EnhancedAuthForm";

export function ModernClientAuth({ onLogin, onBack }) {
  const handleSubmit = (data) => {
    onLogin({
      name: "Client Car Express",
      email: data.email || data.identifier || "",
      tel: data.phone || data.identifier || "",
      city: data.city || "",
      mode: data.mode,
    });
  };

  return (
    <EnhancedAuthForm
      title="Espace Client"
      subtitle="Connectez-vous pour rechercher un vehicule, consulter les details, reserver une location ou lancer une demande d'achat."
      role="client"
      onSubmit={handleSubmit}
      onBack={onBack}
    />
  );
}

export function ModernAgencyAuth({ onLogin, onBack }) {
  const handleSubmit = (data) => {
    onLogin({ company: data.company, email: data.email });
  };

  return (
    <EnhancedAuthForm
      title="Espace Agence"
      subtitle="Accedez a votre espace partenaire pour gerer vos vehicules, vos annonces et les demandes de clients."
      role="agency"
      onSubmit={handleSubmit}
      onBack={onBack}
    />
  );
}

export function ModernAdminAuth({ onLogin, onBack }) {
  const handleSubmit = () => {
    onLogin();
  };

  return (
    <EnhancedAuthForm
      title="Super Admin"
      subtitle="Connectez-vous pour superviser la plateforme Car Express, les acces et les operations globales."
      role="admin"
      onSubmit={handleSubmit}
      onBack={onBack}
    />
  );
}
