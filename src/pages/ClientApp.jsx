import { useMemo, useState } from "react";
import { Topbar, BottomNav, Hero, SearchBox, CarCard, ViewToggle, SectionLabel, ProfileMenuItem, Notification, Btn } from "../components/UI";
import { FilterPanel } from "../components/FilterPanel";
import { LocDetail, VntDetail, AgencyProfilePage } from "../components/VehicleDetail";
import { VehicleService } from "../services/VehicleService";
import { COLORS } from "../utils/constants";

const S = COLORS;

const locVehicles = VehicleService.getLocationVehicles();
const vntVehicles = VehicleService.getSaleVehicles();
const allVehiclesWithId = VehicleService.getAllVehicles();

export default function ClientApp({ user, onLogout }) {
  const [page, setPage] = useState("home");
  const [clientTab, setClientTab] = useState("location");
  const [view, setView] = useState("grid");
  const [detail, setDetail] = useState(null);
  const [agencyProfile, setAgencyProfile] = useState(null);
  const [notif, setNotif] = useState(null);

  const navItems = [
    { key: "home", icon: "home", label: "Accueil" },
    { key: "search", icon: "search", label: "Recherche" },
    { key: "alertes", icon: "bell", label: "Alertes", badge: true },
    { key: "profil", icon: "user", label: "Profil" },
  ];

  const avatarInitials = user?.name
    ? user.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()
    : "CL";

  const detailVehicle = detail ? VehicleService.getVehicleById(detail) : null;
  const isLoc = detail?.startsWith("loc-");

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #f7f2ec 0%, #fcfaf7 42%, #f4eee7 100%)", paddingBottom: 92 }}>
      {detailVehicle && isLoc && (
        <LocDetail
          vehicle={detailVehicle}
          onClose={() => setDetail(null)}
          onGoToSale={() => { setDetail(null); setTimeout(() => setClientTab("vente"), 180); }}
          onOpenAgency={() => setAgencyProfile(detailVehicle)}
          onNotif={setNotif}
        />
      )}
      {detailVehicle && !isLoc && (
        <VntDetail
          vehicle={detailVehicle}
          onClose={() => setDetail(null)}
          onOpenAgency={() => setAgencyProfile(detailVehicle)}
          onNotif={setNotif}
        />
      )}
      {agencyProfile && <AgencyProfilePage vehicle={agencyProfile} onClose={() => setAgencyProfile(null)} />}
      {notif && <Notification notif={notif} onClose={() => setNotif(null)} />}

      <Topbar right="Dakar, SN" onLogout={onLogout} />

      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "20px 20px 0" }}>
        {page === "home" && <HomePage clientTab={clientTab} setClientTab={setClientTab} view={view} setView={setView} onOpenDetail={setDetail} />}
        {page === "search" && <SearchPage onOpenDetail={setDetail} />}
        {page === "alertes" && <AlertesPage />}
        {page === "profil" && <ProfilPage user={user} avatarInitials={avatarInitials} onLogout={onLogout} />}
      </div>

      <BottomNav items={navItems} active={page} onChange={setPage} />
    </div>
  );
}

function HomePage({ clientTab, setClientTab, view, setView, onOpenDetail }) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        padding: 8,
        borderRadius: 22,
        border: `1px solid ${S.border}`,
        background: S.panel,
        boxShadow: "0 14px 34px rgba(24,21,18,0.05)",
      }}>
        {[{ key: "location", label: "Location" }, { key: "vente", label: "Achat" }].map((tab) => {
          const active = clientTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setClientTab(tab.key)}
              style={{
                flex: 1,
                minWidth: 180,
                padding: "14px 18px",
                borderRadius: 16,
                border: `1px solid ${active ? (tab.key === "location" ? S.loc : S.vnt) : "transparent"}`,
                background: active ? (tab.key === "location" ? S.loc : S.vnt) : "transparent",
                color: active ? (tab.key === "location" ? "#fff" : S.vntText) : S.text3,
                fontWeight: 700,
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {clientTab === "location"
        ? <LocationScreen view={view} setView={setView} onOpenDetail={onOpenDetail} />
        : <AchatScreen view={view} setView={setView} onOpenDetail={onOpenDetail} />}
    </div>
  );
}

function LocationScreen({ view, setView, onOpenDetail }) {
  const [lieu, setLieu] = useState("");
  const [depDate, setDepDate] = useState("");
  const [retDate, setRetDate] = useState("");
  const [depH, setDepH] = useState("08:00");
  const [retH, setRetH] = useState("18:00");
  const heures = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  const reset = () => {
    setLieu("");
    setDepDate("");
    setRetDate("");
    setDepH("08:00");
    setRetH("18:00");
  };

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Hero
        eyebrow="Client · Location"
        title="Reservez un vehicule, verifiez les dates et finalisez votre location plus simplement."
        subtitle="Choisissez votre lieu de prise en charge, vos dates et vos horaires. Consultez ensuite les vehicules disponibles avec leurs fiches detaillees."
        badge="Reservation en ligne et confirmation agence"
        accent={S.loc}
      />

      <div style={dashboardGrid()}>
        <Panel title="Planifier une location" subtitle="Lieu, dates, horaires et remise a zero du formulaire">
          <div style={{ display: "grid", gap: 12 }}>
            <Field label="Lieu de prise en charge">
              <input value={lieu} onChange={(e) => setLieu(e.target.value)} placeholder="Ville, aeroport ou adresse" style={inputStyle()} />
            </Field>
            <div style={formGrid()}>
              <Field label="Date depart">
                <input type="date" value={depDate} onChange={(e) => setDepDate(e.target.value)} style={inputStyle()} />
              </Field>
              <Field label="Heure depart">
                <select value={depH} onChange={(e) => setDepH(e.target.value)} style={inputStyle()}>
                  {heures.map((hour) => <option key={hour}>{hour}</option>)}
                </select>
              </Field>
            </div>
            <div style={formGrid()}>
              <Field label="Date retour">
                <input type="date" value={retDate} onChange={(e) => setRetDate(e.target.value)} style={inputStyle()} />
              </Field>
              <Field label="Heure retour">
                <select value={retH} onChange={(e) => setRetH(e.target.value)} style={inputStyle()}>
                  {heures.map((hour) => <option key={hour}>{hour}</option>)}
                </select>
              </Field>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn accent={S.loc}>Rechercher</Btn>
              <Btn outline accent={S.loc} onClick={reset}>Reinitialiser</Btn>
            </div>
          </div>
        </Panel>

        <Panel title="Ce que vous pouvez faire" subtitle="La fiche detail vous permet ensuite de continuer la reservation">
          <div style={{ display: "grid", gap: 10 }}>
            {[
              "Consulter la galerie, les caracteristiques techniques, les equipements et les avis.",
              "Verifier la disponibilite selon les dates choisies.",
              "Calculer automatiquement le nombre de jours et le total de location.",
              "Finaliser avec vos informations, les conditions et le mode de paiement.",
            ].map((item) => (
              <InfoRow key={item} tone="red">{item}</InfoRow>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Filtres visuels" subtitle="Marque, sieges, motorisation, transmission, categorie, classe et prix">
        <FilterPanel prefix="loc" accent={S.loc} />
      </Panel>

      <Panel
        title="Vehicules disponibles"
        subtitle="Alternez entre une vue liste et une vue grille pour parcourir les vehicules"
        right={<ViewToggle view={view} onChange={setView} count={locVehicles.length} accent={S.loc} />}
      >
        <div className="car-grid" style={carGridStyle(view)}>
          {locVehicles.map((vehicle) => (
            <CarCard key={vehicle.id} vehicle={vehicle} onClick={() => onOpenDetail(vehicle.id)} gridView={view === "grid"} accent={S.loc} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function AchatScreen({ view, setView, onOpenDetail }) {
  const [query, setQuery] = useState("");

  const recent = useMemo(() => vntVehicles.slice(0, 3), []);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Hero
        eyebrow="Client · Achat"
        title="Lancez une demande d'achat, reglez les frais de service et poursuivez avec le concessionnaire."
        subtitle="Recherchez un vehicule par marque, modele ou annee, consultez les annonces recentes puis ouvrez une fiche detaillee avant de lancer votre dossier."
        badge="Le solde du vehicule se regle directement avec le concessionnaire"
        accent={S.vnt}
      />

      <div style={dashboardGrid()}>
        <Panel title="Recherche achat" subtitle="Marque, modele ou annee">
          <div style={{ display: "grid", gap: 12 }}>
            <SearchBox placeholder="Marque, modele, annee..." value={query} onChange={setQuery} />
            <Btn outline accent={S.vnt} onClick={() => setQuery("")}>Reinitialiser</Btn>
          </div>
        </Panel>

        <Panel title="Informations dossier achat" subtitle="Fonctionnement du paiement dans l'application">
          <div style={{ display: "grid", gap: 10 }}>
            <InfoRow tone="gold">Le prix total du vehicule n'est pas encaisse par la plateforme.</InfoRow>
            <InfoRow tone="gold">Seuls les frais de service Car Express sont payes dans l'application.</InfoRow>
            <InfoRow tone="gold">Le client accepte les CGU, les conditions du concessionnaire et la clause non remboursable des frais de service.</InfoRow>
          </div>
        </Panel>
      </div>

      <Panel title="Filtres achat" subtitle="Affinez les annonces recentes et les vehicules en vente">
        <FilterPanel prefix="vnt" accent={S.vnt} />
      </Panel>

      <Panel
        title="Annonces recentes"
        subtitle="Les clients peuvent consulter les fiches detaillees, les informations techniques et les avis d'acheteurs"
        right={<ViewToggle view={view} onChange={setView} count={vntVehicles.length} accent={S.vnt} />}
      >
        <div className="car-grid" style={carGridStyle(view)}>
          {vntVehicles.map((vehicle) => (
            <CarCard key={vehicle.id} vehicle={vehicle} onClick={() => onOpenDetail(vehicle.id)} gridView={view === "grid"} accent={S.vnt} />
          ))}
        </div>
      </Panel>

      <Panel title="Selection du moment" subtitle="Quelques vehicules mis en avant pour l'achat">
        <div style={autoGrid(260)}>
          {recent.map((vehicle) => (
            <CarCard key={vehicle.id} vehicle={vehicle} onClick={() => onOpenDetail(vehicle.id)} gridView accent={S.vnt} />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function SearchPage({ onOpenDetail }) {
  const [q, setQ] = useState("");

  const recentSearches = [
    "Toyota Land Cruiser · Dakar aeroport",
    "BMW Serie 3 · achat Dakar",
    "SUV automatique · Almadies",
  ];
  const categories = ["SUV", "Berline", "Van", "Pick-up", "Luxe", "Economique"];

  const filtered = useMemo(() => {
    if (!q) return [];
    const lower = q.toLowerCase();
    return allVehiclesWithId.filter((vehicle) =>
      vehicle.name.toLowerCase().includes(lower)
      || vehicle.agency.toLowerCase().includes(lower)
      || vehicle.tags.join(" ").toLowerCase().includes(lower)
    );
  }, [q]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel title="Recherche globale" subtitle="Location et vente dans un meme moteur de recherche">
        <div style={{ display: "grid", gap: 14 }}>
          <SearchBox placeholder="Marque, modele, ville ou categorie..." value={q} onChange={setQ} />
          <div style={autoGrid(220, 12)}>
            <SoftMetric label="Recherches recentes" value="3" sub="sauvegardees pour ce client" />
            <SoftMetric label="Categories populaires" value="6" sub="acces rapide" />
            <SoftMetric label="Resultats actifs" value={String(allVehiclesWithId.length)} sub="location et achat" />
          </div>
        </div>
      </Panel>

      {q && filtered.length > 0 ? (
        <Panel title="Resultats" subtitle="Vehicules trouves selon votre recherche">
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map((vehicle) => (
              <CarCard key={vehicle.id} vehicle={vehicle} onClick={() => onOpenDetail(vehicle.id)} accent={vehicle.id.startsWith("loc-") ? S.loc : S.vnt} />
            ))}
          </div>
        </Panel>
      ) : (
        <div style={dashboardGrid()}>
          <Panel title="Recherches recentes" subtitle="Acces rapide aux dernieres intentions">
            <div style={{ display: "grid", gap: 10 }}>
              {recentSearches.map((item) => <InfoRow key={item}>{item}</InfoRow>)}
            </div>
          </Panel>

          <Panel title="Categories populaires" subtitle="Relancez une recherche en un clic">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {categories.map((category) => (
                <button key={category} onClick={() => setQ(category)} style={pillButtonStyle()}>
                  {category}
                </button>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}

function AlertesPage() {
  const notifs = [
    { read: false, title: "Reservation confirmee", sub: "Toyota Land Cruiser · 12 au 15 mars · l'agence vous rappelle sous 30 minutes", time: "Il y a 2 heures" },
    { read: false, title: "Nouveau vehicule correspondant", sub: "BMW Serie 3 · Dakar Plateau correspond a vos criteres d'achat", time: "Il y a 5 heures" },
    { read: true, title: "Mise a jour du dossier achat", sub: "Peugeot 3008 · le concessionnaire a repondu a votre demande", time: "Hier" },
    { read: true, title: "Rappel de retour vehicule", sub: "Renault Duster · restitution prevue demain a 10:00", time: "Il y a 2 jours" },
  ];

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={autoGrid(220)}>
        <SoftMetric label="Notifications non lues" value="2" sub="a consulter rapidement" />
        <SoftMetric label="Reservations confirmees" value="4" sub="sur les 30 derniers jours" />
        <SoftMetric label="Dossiers achat" value="2" sub="en cours de suivi" />
      </div>

      <Panel title="Alertes client" subtitle="Reservations, nouveaux vehicules, suivi achat et rappels">
        <div style={{ display: "grid", gap: 10 }}>
          {notifs.map((notif) => (
            <div key={notif.title} style={{
              display: "grid",
              gridTemplateColumns: "auto minmax(0,1fr) auto",
              gap: 12,
              alignItems: "start",
              padding: "14px 16px",
              borderRadius: 18,
              border: `1px solid ${S.border}`,
              background: "rgba(255,255,255,0.74)",
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: notif.read ? S.borderStrong : S.loc, marginTop: 6 }} />
              <div>
                <div style={{ fontWeight: 600, color: S.text }}>{notif.title}</div>
                <div style={{ marginTop: 4, fontSize: 13, color: S.text3, lineHeight: 1.6 }}>{notif.sub}</div>
              </div>
              <span style={{ fontSize: 11, color: S.text3 }}>{notif.time}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ProfilPage({ user, avatarInitials, onLogout }) {
  const menuItems = [
    { icon: "user", label: "Informations personnelles" },
    { icon: "calendar", label: "Mes reservations" },
    { icon: "bag", label: "Mes achats" },
    { icon: "star", label: "Mes avis" },
    { icon: "bell", label: "Notifications" },
    { icon: "lock", label: "Securite et mot de passe" },
    { icon: "help", label: "Aide et support" },
  ];

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <Panel title="Profil client" subtitle="Vos informations, vos reservations, vos achats et vos acces rapides">
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 82, height: 82, borderRadius: 24, background: S.black, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700 }}>
            {avatarInitials}
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: S.text }}>{user?.name || "Mon compte"}</div>
            <div style={{ marginTop: 4, color: S.text3 }}>{user?.tel || user?.email || ""}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              <Badge tone="red">Client verifie</Badge>
              <Badge tone="success">Notifications actives</Badge>
            </div>
          </div>
        </div>

        <div style={{ ...autoGrid(190, 14), marginTop: 18 }}>
          <SoftMetric label="Reservations" value="6" sub="location effectuees" />
          <SoftMetric label="Achats" value="2" sub="dossiers lances" />
          <SoftMetric label="Avis postes" value="4" sub="sur les agences" />
        </div>
      </Panel>

      <Panel title="Acces rapides" subtitle="Toutes les rubriques utiles du profil" noPadding>
        <div style={{ paddingTop: 8 }}>
          {menuItems.map((item) => <ProfileMenuItem key={item.label} {...item} />)}
          <ProfileMenuItem icon="logout" label="Se deconnecter" onClick={onLogout} danger />
        </div>
      </Panel>
    </div>
  );
}

function Panel({ title, subtitle, right, children, noPadding }) {
  return (
    <section style={{
      borderRadius: 24,
      border: `1px solid ${S.border}`,
      background: S.panel,
      boxShadow: "0 18px 50px rgba(24,21,18,0.06)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "18px 20px 0", display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: S.text }}>{title}</div>
          {subtitle && <div style={{ marginTop: 6, color: S.text3, fontSize: 14 }}>{subtitle}</div>}
        </div>
        {right}
      </div>
      <div style={{ padding: noPadding ? 0 : 20 }}>{children}</div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.11em", color: S.text3, marginBottom: 8 }}>{label}</div>
      {children}
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

function InfoRow({ children, tone }) {
  const colors = tone === "gold"
    ? { bg: "rgba(255,204,0,0.14)", dot: "#c39200" }
    : tone === "red"
      ? { bg: "rgba(212,5,17,0.06)", dot: S.loc }
      : { bg: "rgba(24,21,18,0.04)", dot: S.black };

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "13px 14px", borderRadius: 16, background: colors.bg }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: colors.dot, marginTop: 6, flexShrink: 0 }} />
      <div style={{ color: S.text2, fontSize: 14, lineHeight: 1.65 }}>{children}</div>
    </div>
  );
}

function Badge({ children, tone }) {
  const colors = tone === "success"
    ? { bg: S.successSoft, color: S.success }
    : { bg: S.locLight, color: S.loc };

  return <span style={{ padding: "6px 10px", borderRadius: 999, background: colors.bg, color: colors.color, fontSize: 12, fontWeight: 700 }}>{children}</span>;
}

function dashboardGrid() {
  return { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 18 };
}

function autoGrid(min, gap = 16) {
  return { display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap };
}

function formGrid() {
  return { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 };
}

function carGridStyle(view) {
  return {
    display: view === "grid" ? "grid" : "flex",
    gridTemplateColumns: view === "grid" ? "repeat(auto-fit, minmax(280px, 1fr))" : "",
    flexDirection: view === "grid" ? undefined : "column",
    gap: 12,
  };
}

function inputStyle() {
  return {
    width: "100%",
    padding: "13px 14px",
    borderRadius: 16,
    border: `1px solid ${S.borderStrong}`,
    background: "rgba(255,255,255,0.92)",
    outline: "none",
    fontSize: 14,
    color: S.text,
  };
}

function pillButtonStyle() {
  return {
    border: `1px solid ${S.borderStrong}`,
    background: "rgba(255,255,255,0.82)",
    padding: "10px 16px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    color: S.text2,
    cursor: "pointer",
  };
}
