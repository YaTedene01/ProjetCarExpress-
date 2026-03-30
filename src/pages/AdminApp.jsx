import { useMemo, useState } from "react";
import { Topbar, BottomNav, ProfileMenuItem, Input, FormField, Select, Btn } from "../components/UI";

const S = {
  red: "#D40511",
  redSoft: "rgba(212,5,17,0.08)",
  black: "#131313",
  text: "#17130f",
  text2: "#5f5750",
  text3: "#8f877f",
  border: "rgba(24,21,18,0.1)",
  borderStrong: "rgba(24,21,18,0.16)",
  bg: "#f5efe8",
  panel: "rgba(255,255,255,0.88)",
  panelStrong: "rgba(255,255,255,0.96)",
  success: "#1a7a2e",
  successSoft: "#e6f4ea",
  amber: "#ffcc00",
  amberSoft: "rgba(255,204,0,0.18)",
  blue: "#3b82f6",
  blueSoft: "rgba(59,130,246,0.12)",
};

const agencies = [
  { name: "AutoSud SN", city: "Thies", type: "Location", status: "En attente", docs: "NINEA recu, verification KYC", revenue: "320 000 F" },
  { name: "MobileCar", city: "Dakar", type: "Vente", status: "Active", docs: "Conforme", revenue: "1,4 M F" },
  { name: "TransPlus", city: "Saint-Louis", type: "Les deux", status: "Active", docs: "Conforme", revenue: "890 000 F" },
  { name: "Dakar Auto Services", city: "Dakar", type: "Les deux", status: "Active", docs: "Conforme", revenue: "1,2 M F" },
];

const users = [
  { name: "Moussa Diallo", tel: "+221 77 123 45 67", role: "Client", status: "Actif" },
  { name: "Fatou Sow", tel: "+221 76 987 65 43", role: "Agence", status: "Actif" },
  { name: "Ibrahima Ba", tel: "+221 70 456 78 90", role: "Client", status: "Inactif" },
  { name: "Aissatou Dieng", tel: "+221 77 456 12 34", role: "Client", status: "Actif" },
  { name: "Cheikh Ndiaye", tel: "+221 76 321 54 78", role: "Agence", status: "Actif" },
];

const txTrend = [
  { label: "Jan", amount: 28 },
  { label: "Fev", amount: 34 },
  { label: "Mar", amount: 46 },
  { label: "Avr", amount: 42 },
  { label: "Mai", amount: 54 },
  { label: "Juin", amount: 62 },
];

const moderationAlerts = [
  { label: "Agences a valider", value: 3, tone: "amber" },
  { label: "Annonces a revoir", value: 5, tone: "red" },
  { label: "Paiements a verifier", value: 2, tone: "blue" },
];

export default function AdminApp({ onLogout, onRegisterAgency, agencyBranding }) {
  const [page, setPage] = useState("home");

  const navItems = [
    { key: "home", icon: "home", label: "Accueil" },
    { key: "users", icon: "users", label: "Utilisateurs" },
    { key: "agences", icon: "grid", label: "Agences" },
    { key: "systeme", icon: "settings", label: "Systeme" },
    { key: "profil", icon: "user", label: "Profil" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f7f2eb 0%, #faf7f3 46%, #f4eee7 100%)", paddingBottom: 92 }}>
      <Topbar badge={{ label: "Super admin", bg: "rgba(17,17,17,0.08)", color: "#17130f" }} right="Supervision plateforme" onLogout={onLogout} />
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px 20px 0" }}>
        {page === "home" && <AdminHome onRegisterAgency={onRegisterAgency} agencyBranding={agencyBranding} />}
        {page === "users" && <AdminUsers />}
        {page === "agences" && <AdminAgences />}
        {page === "systeme" && <AdminSysteme />}
        {page === "profil" && <AdminProfil onLogout={onLogout} />}
      </div>
      <BottomNav items={navItems} active={page} onChange={setPage} />
    </div>
  );
}

function AdminHome({ onRegisterAgency, agencyBranding }) {
  const [adminTab, setAdminTab] = useState("dashboard");

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <HeroPanel
        title="Supervisez les utilisateurs, les agences, les annonces et l'etat general de la plateforme."
        subtitle="Le tableau de bord central met en avant les chiffres globaux, les validations en attente, la sante du systeme et les actions de moderation."
      />

      <Panel noPadding>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, padding: 16 }}>
          {[
            { key: "dashboard", label: "Tableau de bord" },
            { key: "register", label: "Enregistrer agence" },
            { key: "manage", label: "Gestion" },
          ].map((tab) => (
            <FilterChip key={tab.key} active={adminTab === tab.key} onClick={() => setAdminTab(tab.key)}>
              {tab.label}
            </FilterChip>
          ))}
        </div>
      </Panel>

      {adminTab === "dashboard" && <AdminDashboard />}
      {adminTab === "register" && <RegisterAgency onRegisterAgency={onRegisterAgency} />}
      {adminTab === "manage" && <ManageAgencies />}
    </div>
  );
}

function AdminDashboard() {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={autoGrid(220)}>
        <MetricCard label="Utilisateurs" value="1 240" sub="+18 aujourd'hui" accent={S.red} />
        <MetricCard label="Agences actives" value="34" sub="3 a valider" accent={S.black} />
        <MetricCard label="Annonces en ligne" value="187" sub="location et vente" accent={S.amber} />
        <MetricCard label="Volume transactions" value="48 M F" sub="sur le mois" accent={S.success} />
      </div>

      <div style={dashboardGrid()}>
        <Panel title="Evolution des transactions" subtitle="Volume mensuel des flux traites sur la plateforme">
          <TrendChart data={txTrend} />
        </Panel>

        <Panel title="Vision globale" subtitle="Lecture par pole metier">
          <SplitStats
            items={[
              { label: "Clients actifs", value: "1 018", pct: 82, color: S.red },
              { label: "Agences operationnelles", value: "34", pct: 74, color: S.black },
              { label: "Annonces conformes", value: "92%", pct: 92, color: S.success },
            ]}
          />
        </Panel>
      </div>

      <div style={dashboardGrid()}>
        <Panel title="Statuts a surveiller" subtitle="Moderation, validation et paiements">
          <div style={{ display: "grid", gap: 10 }}>
            {moderationAlerts.map((item) => (
              <StatusHighlight key={item.label} item={item} />
            ))}
          </div>
        </Panel>

        <Panel title="Agences recentes" subtitle="Dernieres structures ajoutees ou modifiees">
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 640, borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Agence", "Ville", "Type", "Statut"].map((head) => <th key={head} style={tableHeadStyle()}>{head}</th>)}
                </tr>
              </thead>
              <tbody>
                {agencies.slice(0, 4).map((agency) => (
                  <tr key={agency.name}>
                    <td style={tableCellStyle()}>
                      <div style={{ fontWeight: 600, color: S.text }}>{agency.name}</div>
                      <div style={{ fontSize: 12, color: S.text3, marginTop: 3 }}>{agency.docs}</div>
                    </td>
                    <td style={tableCellStyle()}>{agency.city}</td>
                    <td style={tableCellStyle()}><Chip tone={agency.type === "Les deux" ? "dark" : "gold"}>{agency.type}</Chip></td>
                    <td style={tableCellStyle()}><StatusPill value={agency.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function RegisterAgency({ onRegisterAgency }) {
  const [submitted, setSubmitted] = useState(false);
  const [activity, setActivity] = useState("Location");
  const [form, setForm] = useState({
    nom: "",
    ville: "Dakar",
    quartier: "",
    adresse: "",
    prenom: "",
    nomResp: "",
    tel: "",
    email: "",
    ninea: "",
    color: "#D40511",
    logoUrl: "",
  });

  const f = (key) => ({ value: form[key], onChange: (e) => setForm((prev) => ({ ...prev, [key]: e.target.value })) });
  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, logoUrl: URL.createObjectURL(file) }));
  };

  if (submitted) {
    return (
      <Panel title="Agence enregistree" subtitle="Les identifiants d'acces ont ete envoyes par SMS.">
        <div style={{ display: "grid", gap: 14, justifyItems: "start" }}>
          <div style={{ width: 66, height: 66, borderRadius: 20, background: S.successSoft, color: S.success, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>✓</div>
          <div style={{ color: S.text2, fontSize: 14, lineHeight: 1.7 }}>
            L'agence a ete creee avec succes. Le responsable recevra ses informations de connexion et pourra acceder a l'espace partenaire.
          </div>
          <Btn onClick={() => setSubmitted(false)} style={{ width: "auto", paddingInline: 22 }}>Enregistrer une autre agence</Btn>
        </div>
      </Panel>
    );
  }

  return (
    <Panel title="Enregistrer une agence" subtitle="Creation d'un nouvel espace partenaire avec ses donnees administratives">
      <div style={{ display: "grid", gap: 14 }}>
        <SectionCard title="Informations agence">
          <FormField label="Nom de l'agence *"><Input placeholder="Ex : Dakar Auto Services" {...f("nom")} /></FormField>
          <div style={formGrid()}>
            <FormField label="Ville *">
              <Select {...f("ville")}>
                {["Dakar", "Thies", "Saint-Louis", "Kaolack", "Touba", "Ziguinchor"].map((city) => <option key={city}>{city}</option>)}
              </Select>
            </FormField>
            <FormField label="Quartier"><Input placeholder="Ex : Plateau" {...f("quartier")} /></FormField>
          </div>
          <FormField label="Adresse complete"><Input placeholder="Rue, numero, point de repere" {...f("adresse")} /></FormField>
        </SectionCard>

        <SectionCard title="Identite visuelle agence">
          <div style={formGrid()}>
            <FormField label="Couleur agence">
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input type="color" value={form.color} onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))} style={{ width: 54, height: 46, border: `1px solid ${S.border}`, borderRadius: 12, background: "#fff", padding: 4 }} />
                <Input placeholder="#D40511" value={form.color} onChange={(e) => setForm((prev) => ({ ...prev, color: e.target.value }))} />
              </div>
            </FormField>
            <FormField label="Logo agence">
              <div style={{ display: "grid", gap: 10 }}>
                <label style={{ border: `1px dashed ${S.borderStrong}`, borderRadius: 16, background: "rgba(255,255,255,0.72)", padding: "14px 16px", cursor: "pointer" }}>
                  <input type="file" accept="image/*" onChange={handleLogo} style={{ display: "none" }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: S.text }}>Ajouter le logo de l'agence</span>
                </label>
                {form.logoUrl && (
                  <div style={{ width: 72, height: 72, borderRadius: 18, overflow: "hidden", border: `1px solid ${S.border}` }}>
                    <img src={form.logoUrl} alt="Logo agence" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
              </div>
            </FormField>
          </div>
        </SectionCard>

        <SectionCard title="Responsable et contact">
          <div style={formGrid()}>
            <FormField label="Prenom *"><Input placeholder="Prenom" {...f("prenom")} /></FormField>
            <FormField label="Nom *"><Input placeholder="Nom" {...f("nomResp")} /></FormField>
          </div>
          <div style={formGrid()}>
            <FormField label="Telephone *"><Input type="tel" placeholder="+221 77 000 00 00" {...f("tel")} /></FormField>
            <FormField label="Email"><Input type="email" placeholder="contact@agence.sn" {...f("email")} /></FormField>
          </div>
        </SectionCard>

        <SectionCard title="Type d'activite">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["Location", "Vente", "Location & Vente"].map((item) => (
              <FilterChip key={item} active={activity === item} onClick={() => setActivity(item)}>{item}</FilterChip>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Documents et references">
          <FormField label="NINEA / Registre de commerce"><Input placeholder="SN-2026-00123" {...f("ninea")} /></FormField>
          <div style={{ border: `1px dashed ${S.borderStrong}`, borderRadius: 20, background: "rgba(255,255,255,0.62)", padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>📄</div>
            <div style={{ fontWeight: 600, color: S.text }}>Joindre les documents justificatifs</div>
            <div style={{ color: S.text3, fontSize: 13, marginTop: 5 }}>PDF ou image, 5 Mo maximum</div>
          </div>
        </SectionCard>

        <Btn onClick={() => {
          onRegisterAgency?.({
            name: form.nom || "Nouvelle agence",
            activity,
            city: `${form.ville}${form.quartier ? ` · ${form.quartier}` : ""}`,
            color: form.color || "#D40511",
            logoUrl: form.logoUrl || "",
          });
          setSubmitted(true);
        }}>Enregistrer l'agence</Btn>
      </div>
    </Panel>
  );
}

function ManageAgencies() {
  const [rows, setRows] = useState([
    { name: "AutoSud SN", sub: "Thies · En attente", type: "Location", action: "Valider", done: false },
    { name: "MobileCar", sub: "Dakar · Active", type: "Vente", action: "Suspendre", done: false },
    { name: "TransPlus", sub: "Saint-Louis · Active", type: "Les deux", action: "Suspendre", done: false },
    { name: "Dakar Auto Services", sub: "Dakar · Active", type: "Les deux", action: "Suspendre", done: false },
  ]);

  const act = (index) => {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, done: true } : row)));
  };

  return (
    <Panel title="Gestion des agences" subtitle="Validation, suspension et suivi des statuts partenaires">
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: 760, borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Agence", "Type", "Statut", "Action"].map((head) => <th key={head} style={tableHeadStyle()}>{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.name}>
                <td style={tableCellStyle()}>
                  <div style={{ fontWeight: 600, color: S.text }}>{row.name}</div>
                  <div style={{ fontSize: 12, color: S.text3, marginTop: 3 }}>{row.sub}</div>
                </td>
                <td style={tableCellStyle()}><Chip tone={row.type === "Les deux" ? "dark" : "gold"}>{row.type}</Chip></td>
                <td style={tableCellStyle()}>
                  <StatusPill value={row.sub.includes("En attente") ? "En attente" : "Active"} />
                </td>
                <td style={tableCellStyle()}>
                  <button onClick={() => act(index)} disabled={row.done} style={actionButtonStyle(row, row.done)}>
                    {row.done ? (row.action === "Valider" ? "Validee" : "Suspendue") : row.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function AdminUsers() {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={autoGrid(210)}>
        <SoftMetric label="Utilisateurs actifs" value="1 018" sub="clients et partenaires" />
        <SoftMetric label="Comptes inactifs" value="222" sub="a relancer ou nettoyer" />
        <SoftMetric label="Agences dans la liste" value="34" sub="visibles dans la plateforme" />
      </div>

      <Panel title="Utilisateurs" subtitle="Liste simple avec nom, telephone, role et statut">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 720, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Nom", "Telephone", "Role", "Statut"].map((head) => <th key={head} style={tableHeadStyle()}>{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.name}>
                  <td style={tableCellStyle()}>{user.name}</td>
                  <td style={tableCellStyle()}>{user.tel}</td>
                  <td style={tableCellStyle()}><Chip tone={user.role === "Agence" ? "dark" : "gold"}>{user.role}</Chip></td>
                  <td style={tableCellStyle()}><StatusPill value={user.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function AdminAgences() {
  const [filter, setFilter] = useState("Tous");

  const filtered = useMemo(() => {
    if (filter === "Tous") return agencies;
    if (filter === "Actives") return agencies.filter((agency) => agency.status === "Active");
    return agencies.filter((agency) => agency.status === "En attente");
  }, [filter]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel title="Agences partenaires" subtitle="Pilotage des structures actives et en attente">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
          {["Tous", "Actives", "En attente"].map((item) => (
            <FilterChip key={item} active={filter === item} onClick={() => setFilter(item)}>{item}</FilterChip>
          ))}
        </div>

        <div style={autoGrid(200, 14)}>
          <SoftMetric label="Actives" value="31" sub="operationnelles" />
          <SoftMetric label="En attente" value="3" sub="a verifier" />
          <SoftMetric label="Volume moyen" value="1,1 M F" sub="revenu mensuel par agence" />
        </div>
      </Panel>

      <Panel title="Liste des agences" subtitle="Vue metier plus lisible avec statut, ville et volume">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 780, borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Agence", "Ville", "Type", "Statut", "Revenu", "Action"].map((head) => <th key={head} style={tableHeadStyle()}>{head}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map((agency) => (
                <tr key={agency.name}>
                  <td style={tableCellStyle()}>
                    <div style={{ fontWeight: 600, color: S.text }}>{agency.name}</div>
                    <div style={{ fontSize: 12, color: S.text3, marginTop: 3 }}>{agency.docs}</div>
                  </td>
                  <td style={tableCellStyle()}>{agency.city}</td>
                  <td style={tableCellStyle()}><Chip tone={agency.type === "Les deux" ? "dark" : "gold"}>{agency.type}</Chip></td>
                  <td style={tableCellStyle()}><StatusPill value={agency.status} /></td>
                  <td style={tableCellStyle()}>{agency.revenue}</td>
                  <td style={tableCellStyle()}><button style={ghostButtonStyle()}>Voir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function AdminSysteme() {
  const statuses = [
    { label: "Uptime", value: "99,9%", sub: "30 derniers jours", state: "ok" },
    { label: "API", value: "OK", sub: "Routes principales operationnelles", state: "ok" },
    { label: "Base de donnees", value: "OK", sub: "Latence moyenne 42 ms", state: "ok" },
    { label: "Paiements", value: "OK", sub: "Carte, mobile money et cash", state: "ok" },
  ];

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={autoGrid(220)}>
        {statuses.map((status) => (
          <MetricCard key={status.label} label={status.label} value={status.value} sub={status.sub} accent={status.state === "ok" ? S.success : S.red} />
        ))}
      </div>

      <Panel title="Etat de la plateforme" subtitle="Lecture systeme et prochaines operations">
        <div style={{ display: "grid", gap: 14 }}>
          <TimelineRow title="Derniere mise a jour" sub="15 mars 2026 · modules client et agence" />
          <TimelineRow title="Prochaine maintenance" sub="1 avril 2026 · 02:00 a 03:00" />
          <TimelineRow title="Supervision paiements" sub="Passerelles actives, aucun incident critique" />
        </div>
      </Panel>
    </div>
  );
}

function AdminProfil({ onLogout }) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel title="Profil administrateur" subtitle="Acces securite, journaux et documentation">
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 82, height: 82, borderRadius: 24, background: S.black, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>
            SA
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: S.text }}>Super Administrateur</div>
            <div style={{ marginTop: 4, color: S.text3 }}>admin@carexpress.sn</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              <Chip tone="dark">Acces complet</Chip>
              <Chip tone="success">2FA active</Chip>
              <Chip tone="gold">Derniere connexion aujourd'hui</Chip>
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Raccourcis administrateur" subtitle="Configuration, securite et supervision" noPadding>
        <div style={{ paddingTop: 8 }}>
          <ProfileMenuItem icon="shield" label="Securite et 2FA" />
          <ProfileMenuItem icon="settings" label="Parametres plateforme" />
          <ProfileMenuItem icon="file" label="Journaux d'activite" />
          <ProfileMenuItem icon="help" label="Documentation interne" />
          <ProfileMenuItem icon="logout" label="Se deconnecter" onClick={onLogout} danger />
        </div>
      </Panel>
    </div>
  );
}

function HeroPanel({ title, subtitle }) {
  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      borderRadius: 28,
      background: "linear-gradient(135deg, #171311 0%, #2a1b17 48%, #402522 100%)",
      color: "#fff",
      border: `1px solid ${S.border}`,
      boxShadow: "0 28px 60px rgba(18,18,18,0.12)",
      padding: 24,
    }}>
      <div style={{ position: "absolute", top: -90, right: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.22), transparent 68%)" }} />
      <div style={{ position: "absolute", bottom: -80, left: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(212,5,17,0.16), transparent 70%)" }} />
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(255,255,255,0.56)", marginBottom: 10 }}>Pilotage plateforme</div>
        <h1 style={{ fontSize: "clamp(2rem, 3.3vw, 3.5rem)", lineHeight: 0.98, margin: 0, maxWidth: 840 }}>{title}</h1>
        <p style={{ marginTop: 14, maxWidth: 780, color: "rgba(255,255,255,0.72)", fontSize: 15, lineHeight: 1.7 }}>{subtitle}</p>
      </div>
    </div>
  );
}

function Panel({ title, subtitle, children, noPadding }) {
  return (
    <section style={{ borderRadius: 24, border: `1px solid ${S.border}`, background: S.panel, boxShadow: "0 18px 50px rgba(24,21,18,0.06)", overflow: "hidden" }}>
      {(title || subtitle) && (
        <div style={{ padding: "18px 20px 0" }}>
          {title && <div style={{ fontSize: 20, fontWeight: 700, color: S.text }}>{title}</div>}
          {subtitle && <div style={{ marginTop: 6, color: S.text3, fontSize: 14 }}>{subtitle}</div>}
        </div>
      )}
      <div style={{ padding: noPadding ? 0 : 20 }}>{children}</div>
    </section>
  );
}

function SectionCard({ title, children }) {
  return (
    <div style={{ borderRadius: 20, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.74)", padding: 18 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: S.text, marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  );
}

function MetricCard({ label, value, sub, accent }) {
  return (
    <div style={{ padding: 18, borderRadius: 22, border: `1px solid ${S.border}`, background: S.panelStrong }}>
      <div style={{ width: 38, height: 6, borderRadius: 999, background: accent, marginBottom: 14 }} />
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: S.text3 }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 30, fontWeight: 800, color: S.text }}>{value}</div>
      <div style={{ marginTop: 4, fontSize: 13, color: S.text2 }}>{sub}</div>
    </div>
  );
}

function SoftMetric({ label, value, sub }) {
  return (
    <div style={{ padding: 16, borderRadius: 18, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.72)" }}>
      <div style={{ fontSize: 11, color: S.text3, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700, color: S.text }}>{value}</div>
      <div style={{ marginTop: 3, color: S.text3, fontSize: 12 }}>{sub}</div>
    </div>
  );
}

function TrendChart({ data }) {
  const width = 520;
  const height = 220;
  const max = Math.max(...data.map((item) => item.amount));
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - (item.amount / max) * 170 - 20;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: 240 }}>
        <defs>
          <linearGradient id="admin-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(212,5,17,0.28)" />
            <stop offset="100%" stopColor="rgba(212,5,17,0)" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((row) => (
          <line key={row} x1="0" x2={width} y1={20 + row * 50} y2={20 + row * 50} stroke="rgba(24,21,18,0.08)" />
        ))}
        <polyline fill="none" stroke={S.red} strokeWidth="4" points={points} strokeLinejoin="round" strokeLinecap="round" />
        <polygon fill="url(#admin-line)" points={`0,${height} ${points} ${width},${height}`} />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * width;
          const y = height - (item.amount / max) * 170 - 20;
          return <circle key={item.label} cx={x} cy={y} r="6" fill="#fff" stroke={S.red} strokeWidth="3" />;
        })}
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        {data.map((item) => (
          <div key={item.label} style={{ display: "grid", gap: 4 }}>
            <span style={{ fontSize: 12, color: S.text3 }}>{item.label}</span>
            <strong style={{ color: S.text }}>{item.amount} M F</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function SplitStats({ items }) {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      {items.map((item) => (
        <div key={item.label} style={{ display: "grid", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 14 }}>
            <span style={{ color: S.text }}>{item.label}</span>
            <strong style={{ color: S.text }}>{item.value}</strong>
          </div>
          <div style={{ height: 12, borderRadius: 999, background: "rgba(24,21,18,0.06)", overflow: "hidden" }}>
            <div style={{ width: `${item.pct}%`, height: "100%", background: item.color, borderRadius: 999 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusHighlight({ item }) {
  const tone = item.tone === "amber"
    ? { bg: S.amberSoft, color: "#7b5a00" }
    : item.tone === "blue"
      ? { bg: S.blueSoft, color: S.blue }
      : { bg: S.redSoft, color: S.red };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", padding: "14px 16px", borderRadius: 18, border: `1px solid ${S.border}`, background: "rgba(255,255,255,0.76)" }}>
      <div>
        <div style={{ fontWeight: 600, color: S.text }}>{item.label}</div>
        <div style={{ marginTop: 3, fontSize: 13, color: S.text3 }}>Element necessitant une action de controle</div>
      </div>
      <span style={{ padding: "7px 12px", borderRadius: 999, background: tone.bg, color: tone.color, fontWeight: 700 }}>{item.value}</span>
    </div>
  );
}

function TimelineRow({ title, sub }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: S.black, marginTop: 6 }} />
      <div>
        <div style={{ fontWeight: 600, color: S.text }}>{title}</div>
        <div style={{ marginTop: 4, color: S.text3, fontSize: 14 }}>{sub}</div>
      </div>
    </div>
  );
}

function StatusPill({ value }) {
  const map = {
    Active: { bg: S.successSoft, color: S.success },
    Actif: { bg: S.successSoft, color: S.success },
    "En attente": { bg: S.amberSoft, color: "#7b5a00" },
    Inactif: { bg: "rgba(24,21,18,0.06)", color: S.text3 },
  };
  const tone = map[value] || { bg: "rgba(24,21,18,0.06)", color: S.text2 };
  return <span style={{ padding: "6px 10px", borderRadius: 999, background: tone.bg, color: tone.color, fontSize: 12, fontWeight: 600 }}>{value}</span>;
}

function Chip({ children, tone }) {
  const tones = {
    dark: { bg: S.black, color: "#fff" },
    gold: { bg: S.amberSoft, color: "#7b5a00" },
    success: { bg: S.successSoft, color: S.success },
  };
  const style = tones[tone] || { bg: "rgba(24,21,18,0.06)", color: S.text2 };
  return <span style={{ padding: "6px 10px", borderRadius: 999, background: style.bg, color: style.color, fontSize: 12, fontWeight: 600 }}>{children}</span>;
}

function FilterChip({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${active ? S.black : S.borderStrong}`,
        background: active ? S.black : "rgba(255,255,255,0.7)",
        color: active ? "#fff" : S.text2,
        padding: "10px 16px",
        borderRadius: 999,
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function autoGrid(min, gap = 16) {
  return { display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap };
}

function dashboardGrid() {
  return { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 18 };
}

function tableHeadStyle() {
  return {
    textAlign: "left",
    padding: "12px 14px",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: S.text3,
    borderBottom: `1px solid ${S.border}`,
  };
}

function tableCellStyle() {
  return {
    padding: "14px",
    borderBottom: `1px solid ${S.border}`,
    fontSize: 13,
    color: S.text2,
    verticalAlign: "top",
  };
}

function formGrid() {
  return { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 };
}

function ghostButtonStyle() {
  return {
    border: `1px solid ${S.borderStrong}`,
    background: "rgba(255,255,255,0.72)",
    color: S.text,
    padding: "8px 12px",
    borderRadius: 12,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
  };
}

function actionButtonStyle(row, done) {
  return {
    border: `1px solid ${done ? S.borderStrong : row.action === "Valider" ? S.black : S.borderStrong}`,
    background: done ? "rgba(24,21,18,0.04)" : row.action === "Valider" ? S.black : "rgba(255,255,255,0.74)",
    color: done ? S.text3 : row.action === "Valider" ? "#fff" : S.text,
    padding: "9px 12px",
    borderRadius: 12,
    cursor: done ? "default" : "pointer",
    fontSize: 12,
    fontWeight: 700,
  };
}
