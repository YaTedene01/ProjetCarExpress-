import { useState, useEffect } from "react";
import { PageHeader, SpecGrid, ReviewCard, AgencyCard, MapPlaceholder, Btn, Input, FormField, Select } from "./UI";
import { agencyInfo, unavailablePeriods } from "../data";
import { useResponsive } from "../hooks/useResponsive";
import landcruiserImg from "../assets/landcruiser.jpg";
import mercedesImg from "../assets/mercedes sprinter.jpg";
import tucsonImg from "../assets/tucson.png";
import dusterImg from "../assets/duster.jpeg";
import hiaceImg from "../assets/toyota hiace.jpg";
import clioImg from "../assets/clio.png";
import bmwImg from "../assets/bmw-x5-30d-2019-08_1.jpg";
import kiaImg from "../assets/kia.png";
import hiluxImg from "../assets/toyotahilux.png";
import peugeot3008Img from "../assets/3008.png";

const vehicleImages = {
  'landcruiser.jpg': landcruiserImg,
  'mercedes sprinter.jpg': mercedesImg,
  'tucson.png': tucsonImg,
  'duster.jpeg': dusterImg,
  'toyota hiace.jpg': hiaceImg,
  'clio.png': clioImg,
  'bmw-x5-30d-2019-08_1.jpg': bmwImg,
  'kia.png': kiaImg,
  'toyotahilux.png': hiluxImg,
  '3008.png': peugeot3008Img,
};

const S = {
  loc:'#D40511', locLight:'#FFF0F0', locMid:'#F5C6C6',
  vnt:'#FFCC00', vntLight:'#FFFBE0', vntMid:'#FFE066', vntText:'#7A5C00',
  black:'#111111', bg2:'#fffaf6', text:'#181512', text2:'#5f5750', text3:'#8f877f',
  border:'rgba(24,21,18,0.1)', border2:'rgba(24,21,18,0.18)',
};

// ── Gallery ───────────────────────────────────────────────────────────
function Gallery({ emoji, image, accent }) {
  const { isMobile } = useResponsive();
  const [photoIdx, setPhotoIdx] = useState(0);
  const vehicleImage = image && vehicleImages[image];
  // Use vehicle image for all photo slots when available
  const photos = vehicleImage ? [vehicleImage, vehicleImage, vehicleImage, vehicleImage] : [emoji, emoji, emoji, emoji];
  const isImage = () => vehicleImage !== undefined;
  const galleryHeight = isMobile ? 220 : 280;
  const thumbWidth = isMobile ? 60 : 72;
  const thumbHeight = isMobile ? 44 : 52;
  return (
    <div style={{padding:'16px 16px 0'}}>
      <div style={{height:galleryHeight,display:'flex',alignItems:'center',justifyContent:'center',position:'relative',borderRadius:28,overflow:'hidden',background:'linear-gradient(180deg, #fffaf6 0%, #efe6dd 100%)',boxShadow:'0 26px 60px rgba(17,17,17,0.08)'}}>
        <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at top right, ${accent}22 0%, transparent 45%)`}} />
        {isImage() ? (
          <img src={photos[photoIdx]} alt="Vehicle" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
        ) : (
          <span style={{fontSize:isMobile ? 60 : 80,transition:'transform 0.3s'}}>{photos[photoIdx]}</span>
        )}
        <div style={{position:'absolute',top:14,left:14,display:'inline-flex',alignItems:'center',gap:8,padding:'8px 12px',borderRadius:999,background:'rgba(255,255,255,0.76)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,0.45)',fontSize:isMobile ? 9 : 11,fontWeight:600,color:S.text}}>
          <span style={{width:7,height:7,borderRadius:'50%',background:accent,display:'inline-block'}} />
          Car Express Selection
        </div>
        <div style={{position:'absolute',bottom:14,right:14,background:'rgba(17,17,17,0.58)',backdropFilter:'blur(10px)',color:'#fff',fontSize:isMobile ? 9 : 11,padding:'5px 10px',borderRadius:20}}>
          {photoIdx+1} / {photos.length}
        </div>
      </div>
      <div style={{display:'flex',gap:8,padding:'12px 4px 2px',overflowX:'auto'}}>
        {photos.map((p,i)=>(
          <div key={i} onClick={()=>setPhotoIdx(i)}
            style={{width:thumbWidth,height:thumbHeight,background:'#e0e0e0',borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:isMobile ? 18 : 22,flexShrink:0,border:`2px solid ${i===photoIdx?accent:'rgba(255,255,255,0.55)'}`,cursor:'pointer',overflow:'hidden',boxShadow:i===photoIdx?'0 12px 24px rgba(17,17,17,0.1)':'none'}}>
            {isImage() ? (
              <img src={p} alt="Vehicle" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            ) : (
              p
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Location Detail ───────────────────────────────────────────────────
export function LocDetail({ vehicle, onClose, onGoToSale, onOpenAgency, onNotif }) {
  const { isMobile } = useResponsive();
  const [lieu, setLieu] = useState('');
  const [depDate, setDepDate] = useState('');
  const [retDate, setRetDate] = useState('');
  const [depHeure, setDepHeure] = useState('08:00');
  const [retHeure, setRetHeure] = useState('18:00');
  const [availability, setAvailability] = useState(null); // null | 'ok' | 'unavail' | 'date-error'
  const [days, setDays] = useState(0);
  const [total, setTotal] = useState(0);
  const [showPayment, setShowPayment] = useState(false);

  const heures = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];

  useEffect(()=>{
    if(!depDate||!retDate) { setAvailability(null); return; }
    const d1=new Date(depDate), d2=new Date(retDate);
    if(d2<=d1){ setAvailability('date-error'); return; }
    const d=Math.ceil((d2-d1)/86400000);
    const unavail = unavailablePeriods.some(p=>d1<new Date(p.to)&&d2>new Date(p.from));
    if(unavail){ setAvailability('unavail'); setDays(0); setTotal(0); return; }
    setAvailability('ok');
    setDays(d);
    setTotal(vehicle.price * d);
  },[depDate,retDate,vehicle.price]);

  const ag = agencyInfo[vehicle.agency]||{address:'Dakar',stars:'★★★★☆',since:'Depuis 2022'};

  if(showPayment) return (
    <LocPayment vehicle={vehicle} lieu={lieu} depDate={depDate} retDate={retDate} days={days} total={total}
      onBack={()=>setShowPayment(false)} onClose={onClose} onNotif={onNotif}/>
  );

  return (
    <div style={{position:'fixed',inset:0,background:'linear-gradient(180deg, #f8f4ef 0%, #fbf9f6 100%)',zIndex:999,overflowY:'auto',paddingBottom:96}}>
      <PageHeader title={vehicle.name} onBack={onClose} accent={S.loc}/>
      <div style={{maxWidth:1360,margin:'0 auto',paddingBottom:24}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(360px,1fr))',gap:18,alignItems:'start',padding:'0 16px'}}>
          <div>
            <Gallery emoji={vehicle.emoji} image={vehicle.image} accent={S.loc}/>
            <div style={{margin:'12px 0 0',padding:'20px 20px',border:`1px solid ${S.border}`,borderRadius:28,display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,0.82)',backdropFilter:'blur(12px)',boxShadow:'0 20px 44px rgba(17,17,17,0.06)'}}>
              <div>
                <div style={{fontSize:isMobile ? 28 : 32,fontWeight:700,color:S.loc,fontFamily:'JetBrains Mono,monospace'}}>{vehicle.priceLabel}</div>
                <div style={{fontSize:isMobile ? 11 : 12,color:S.text3,letterSpacing:'0.12em',textTransform:'uppercase'}}>F CFA / jour</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:isMobile ? 14 : 15,color:S.loc}}>{vehicle.stars}</div>
                <div style={{fontSize:isMobile ? 10 : 11,color:S.text3,marginTop:2}}>{vehicle.rating}</div>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10,marginTop:12}}>
              <QuickStat value={vehicle.specs[0]?.val || '—'} label="Places" />
              <QuickStat value={vehicle.specs[3]?.val || '—'} label="Transmission" />
              <QuickStat value={vehicle.specs[4]?.val || '—'} label="Annee" />
            </div>
          </div>

          <div style={{paddingTop:16}}>
            <div style={{padding:'20px',border:`1px solid ${S.locMid}`,borderRadius:28,background:'linear-gradient(180deg, rgba(255,240,240,0.95), rgba(255,255,255,0.92))',boxShadow:'0 22px 46px rgba(212,5,17,0.08)'}}>
        <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.16em',color:S.loc,textTransform:'uppercase',marginBottom:14}}>Votre réservation</div>
        {/* Lieu */}
        <div style={{background:'rgba(255,255,255,0.92)',border:`1px solid ${S.border}`,borderRadius:18,padding:'12px 14px',marginBottom:12,display:'flex',alignItems:'center',gap:10}}>
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={S.loc} strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div style={{flex:1}}>
            <div style={{fontSize:10,fontWeight:500,color:S.text3,textTransform:'uppercase',letterSpacing:'0.4px',marginBottom:2}}>Lieu de prise en charge</div>
            <input placeholder="Ville, adresse, aéroport…" value={lieu} onChange={e=>setLieu(e.target.value)}
              style={{border:'none',background:'transparent',fontSize:13,color:S.text,width:'100%',outline:'none',padding:0}}/>
          </div>
        </div>
        {/* Dates */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:10}}>
          {[{label:'Départ',date:depDate,setDate:setDepDate,heure:depHeure,setHeure:setDepHeure},
            {label:"Jusqu'au",date:retDate,setDate:setRetDate,heure:retHeure,setHeure:setRetHeure}].map(({label,date,setDate,heure,setHeure})=>(
            <div key={label} style={{background:'rgba(255,255,255,0.92)',border:`1px solid ${S.border}`,borderRadius:18,padding:'12px 12px'}}>
              <div style={{fontSize:10,fontWeight:500,color:S.text3,textTransform:'uppercase',marginBottom:4}}>{label}</div>
              <input type="date" value={date} onChange={e=>setDate(e.target.value)}
                style={{border:'none',background:'transparent',fontSize:12,color:S.text,outline:'none',width:'100%',marginBottom:4}}/>
              <select value={heure} onChange={e=>setHeure(e.target.value)}
                style={{border:'none',background:'transparent',fontSize:12,color:S.text,outline:'none',width:'100%',appearance:'none'}}>
                {heures.map(h=><option key={h}>{h}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={{background:'rgba(255,255,255,0.96)',border:`1px solid ${S.locMid}`,borderRadius:20,padding:'14px 16px',boxShadow:'0 14px 28px rgba(17,17,17,0.04)'}}>
          {availability==='date-error' && <div style={{fontSize:12,color:S.loc,marginBottom:8}}>⚠️ La date de retour doit être après le départ</div>}
          {availability==='unavail' && <div style={{fontSize:12,color:S.loc,fontWeight:500,marginBottom:8}}>⛔ Véhicule indisponible sur ces dates</div>}
          {availability==='ok' && <div style={{fontSize:12,color:'#1a7a2e',fontWeight:500,marginBottom:8}}>✓ Véhicule disponible sur ces dates</div>}
          {!availability && <div style={{fontSize:12,color:S.text3,marginBottom:8}}>Choisissez vos dates pour voir le total</div>}
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
            <span style={{fontSize:13,color:S.text2}}>{days>0?`${days} jour${days>1?'s':''} × ${vehicle.price.toLocaleString('fr-FR')} F`:'—'}</span>
            <span style={{fontSize:13,color:S.text2}}>{days>0?total.toLocaleString('fr-FR')+' F':'—'}</span>
          </div>
          <div style={{borderTop:`1px dashed ${S.locMid}`,paddingTop:8,marginTop:4,display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
            <span style={{fontSize:12,fontWeight:500,color:S.text3,letterSpacing:'0.5px'}}>TOTAL</span>
            <span style={{fontSize:24,fontWeight:700,color:S.loc,fontFamily:'JetBrains Mono,monospace'}}>{total>0?total.toLocaleString('fr-FR')+' F':'—'}</span>
          </div>
        </div>

        {/* Also for sale */}
        {vehicle.alsoForSale && (
          <div style={{marginTop:12,background:'rgba(255,255,255,0.94)',border:`1px solid ${S.vntMid}`,borderRadius:18,padding:'12px 14px',display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:16}}>🏷️</span>
            <div>
              <div style={{fontSize:12,fontWeight:500,color:S.vntText}}>Ce véhicule est aussi disponible à l'achat</div>
              <div onClick={onGoToSale} style={{fontSize:12,color:S.loc,textDecoration:'underline',cursor:'pointer',marginTop:2}}>Voir l'offre d'achat →</div>
            </div>
          </div>
        )}
            </div>
          </div>
        </div>
      </div>

      {/* Specs / Motor / Equip / Desc */}
      <div style={{maxWidth:1360,margin:'0 auto'}}>
        <Section title="Caractéristiques"><SpecGrid items={vehicle.specs}/></Section>
        <Section title="Motorisation"><SpecGrid items={vehicle.motor}/></Section>
        <Section title="Équipements">
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>
            {vehicle.equip.map((e,i)=><EquipTag key={i}>{e}</EquipTag>)}
          </div>
        </Section>
        <Section title="Description"><p style={{fontSize:13,color:S.text2,lineHeight:1.7}}>{vehicle.desc}</p></Section>
        <Section title="L'agence">
          <AgencyCard vehicle={vehicle} accent={S.loc} onClick={onOpenAgency}/>
          <MapPlaceholder address={ag.address} accent={S.loc}/>
        </Section>
        <Section title="Avis clients">
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {vehicle.reviews.map((r,i)=><ReviewCard key={i} review={r}/>)}
          </div>
        </Section>
      </div>

      {/* Sticky CTA */}
      <div style={{position:'sticky',bottom:0,background:'rgba(251,249,246,0.84)',backdropFilter:'blur(14px)',borderTop:`1px solid ${S.border}`,padding:'14px 16px'}}>
        <Btn onClick={()=>{if(availability==='ok')setShowPayment(true);else if(!depDate||!retDate)onNotif({icon:'📅',title:'Dates manquantes',msg:'Veuillez sélectionner vos dates de départ et de retour.'});}} accent={S.loc}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Valider ma réservation
        </Btn>
      </div>
    </div>
  );
}

// ── Location Payment ──────────────────────────────────────────────────
function LocPayment({ vehicle, lieu, depDate, retDate, days, total, onBack, onClose, onNotif }) {
  const [cgu, setCgu] = useState(false);
  const [cga, setCga] = useState(false);
  const [payMethod, setPayMethod] = useState(null);
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [cni, setCni] = useState('');
  const [permis, setPermis] = useState('');

  const confirm = () => {
    if(!cgu||!cga){onNotif({icon:'⚠️',title:'Conditions requises',msg:"Veuillez accepter les conditions d'utilisation et celles de l'agence."});return;}
    onClose();
    setTimeout(()=>onNotif({icon:'✅',title:'Réservation confirmée !',msg:`Votre réservation pour ${vehicle.name} est enregistrée. L'agence vous contactera sous 30 minutes.`}),200);
  };

  return (
    <div style={{position:'fixed',inset:0,background:'#fff',zIndex:1000,overflowY:'auto',paddingBottom:40}}>
      <PageHeader title="Finaliser la réservation" onBack={onBack} accent={S.loc}/>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'16px'}}>
      <div style={{margin:'0 0 16px',background:S.locLight,border:`1px solid ${S.locMid}`,borderRadius:22,padding:18}}>
        <div style={{fontSize:11,fontWeight:500,letterSpacing:'0.6px',color:S.loc,textTransform:'uppercase',marginBottom:10}}>Récapitulatif</div>
        <div style={{fontSize:13,color:S.text2,lineHeight:1.8}}>
          <div>🚗 <strong>{vehicle.name}</strong> {vehicle.image && <img src={vehicleImages[vehicle.image]} alt="" style={{width:20,height:20,objectFit:'cover',marginLeft:5,borderRadius:4,verticalAlign:'middle'}}/>}</div>
          <div>📍 {lieu||'Lieu non précise'}</div>
          <div>📅 Du {depDate} au {retDate} ({days} jour{days>1?'s':''})</div>
          <div>🏢 {vehicle.agency}</div>
        </div>
        <div style={{borderTop:`1px dashed ${S.locMid}`,marginTop:10,paddingTop:10,display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
          <span style={{fontSize:12,fontWeight:500,color:S.text3}}>TOTAL À PAYER</span>
          <span style={{fontSize:22,fontWeight:600,color:S.loc,fontFamily:'DM Mono,monospace'}}>{total.toLocaleString('fr-FR')} F CFA</span>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:16}}>
      <div>
      <FormCard title="Informations complémentaires">
        <FormField label="Nom complet *"><Input placeholder="Prénom et nom" value={nom} onChange={e=>setNom(e.target.value)}/></FormField>
        <FormField label="Téléphone *"><Input type="tel" placeholder="+221 77 000 00 00" value={tel} onChange={e=>setTel(e.target.value)}/></FormField>
        <FormField label="CNI / Passeport *"><Input placeholder="Numéro de pièce d'identité" value={cni} onChange={e=>setCni(e.target.value)}/></FormField>
        <FormField label="Permis de conduire *"><Input placeholder="Numéro de permis" value={permis} onChange={e=>setPermis(e.target.value)}/></FormField>
      </FormCard>
      <FormCard title="Conditions d'utilisation">
        <CheckRow checked={cgu} onChange={setCgu} label={<>J'accepte les <u>conditions générales</u> de Car Express</>}/>
        <CheckRow checked={cga} onChange={setCga} label={<>J'accepte les <u>conditions de l'agence</u> (responsabilité, caution, état du véhicule)</>}/>
      </FormCard>
      </div>
      <div>
      <FormCard title="Mode de paiement">
        {[{key:'carte',icon:'💳',label:'Carte bancaire',sub:'Visa, Mastercard'},
          {key:'mobile',icon:'📱',label:'Mobile Money',sub:'Wave, Orange Money, Free Money'},
          {key:'cash',icon:'💵',label:'Cash sur place',sub:'Paiement à la prise en charge'}
        ].map(m=>(
          <PayOption key={m.key} {...m} selected={payMethod===m.key} onClick={()=>setPayMethod(m.key)} accent={S.loc}/>
        ))}
      </FormCard>
      <FormCard title="Etapes suivantes">
        <div style={{display:'grid',gap:10}}>
          <MiniStep>Validation de vos informations et des conditions.</MiniStep>
          <MiniStep>Choix du mode de paiement.</MiniStep>
          <MiniStep>Confirmation immediate puis rappel agence sous 30 minutes.</MiniStep>
        </div>
      </FormCard>
      </div>
      </div>
      <div style={{padding:'0 0 20px',maxWidth:420}}>
        <Btn onClick={confirm} accent={S.loc}>Confirmer et payer</Btn>
      </div>
      </div>
    </div>
  );
}

// ── Achat Detail ──────────────────────────────────────────────────────
export function VntDetail({ vehicle, onClose, onOpenAgency, onNotif }) {
  const { isMobile } = useResponsive();
  const [queue] = useState(Math.floor(Math.random()*4));
  const [lieu, setLieu] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const ag = agencyInfo[vehicle.agency]||{address:'Dakar',stars:'★★★★☆',since:'Depuis 2021',sales:0};

  if(showPayment) return (
    <VntPayment vehicle={vehicle} onBack={()=>setShowPayment(false)} onClose={onClose} onNotif={onNotif}/>
  );

  return (
    <div style={{position:'fixed',inset:0,background:'linear-gradient(180deg, #f8f4ef 0%, #fbf9f6 100%)',zIndex:999,overflowY:'auto',paddingBottom:96}}>
      <PageHeader title={vehicle.name} onBack={onClose} accent={S.vnt}/>
      <div style={{maxWidth:1360,margin:'0 auto',paddingBottom:24}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(360px,1fr))',gap:18,alignItems:'start',padding:'0 16px'}}>
      <div>
      <Gallery emoji={vehicle.emoji} image={vehicle.image} accent={S.vnt}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,minmax(0,1fr))',gap:10,marginTop:12}}>
        <QuickStat value={vehicle.specs[0]?.val || '—'} label="Places" />
        <QuickStat value={vehicle.specs[4]?.val || '—'} label="Kilometrage" />
        <QuickStat value={vehicle.specs[5]?.val || '—'} label="Classe" />
      </div>
      </div>
      <div style={{paddingTop:16}}>
      <div style={{margin:'0',padding:'20px',border:`1px solid ${S.vntMid}`,borderRadius:28,background:'linear-gradient(180deg, rgba(255,248,214,0.95), rgba(255,255,255,0.92))',boxShadow:'0 22px 48px rgba(255,204,0,0.12)'}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
          <div>
            <div style={{fontSize:isMobile ? 28 : 32,fontWeight:700,color:S.vntText,fontFamily:'JetBrains Mono,monospace'}}>{vehicle.priceLabel}</div>
            <div style={{fontSize:isMobile ? 11 : 12,color:S.text3,letterSpacing:'0.12em',textTransform:'uppercase'}}>F CFA — Prix fixe</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div style={{fontSize:isMobile ? 13 : 14,color:S.vntText}}>{vehicle.stars}</div>
            <div style={{fontSize:isMobile ? 10 : 11,color:S.text3,marginTop:2}}>{vehicle.rating}</div>
          </div>
        </div>
        {queue>0 && (
          <div style={{background:'rgba(255,255,255,0.94)',border:`1px solid ${S.vntMid}`,borderRadius:18,padding:'12px 14px',display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:20}}>⏳</span>
            <div>
              <div style={{fontSize:12,fontWeight:500,color:S.vntText}}>{queue} acheteur{queue>1?'s':''} en négociation</div>
              <div style={{fontSize:11,color:S.text3}}>Soyez réactif — ce véhicule est très demandé</div>
            </div>
          </div>
        )}
        <div style={{marginTop:12,background:'rgba(255,255,255,0.94)',border:`1px solid ${S.border}`,borderRadius:18,padding:'12px 14px',display:'flex',alignItems:'center',gap:10}}>
          <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={S.vntText} strokeWidth={2}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          <div style={{flex:1}}>
            <div style={{fontSize:10,fontWeight:500,color:S.text3,textTransform:'uppercase',marginBottom:2}}>Votre localisation (optionnel)</div>
            <input placeholder="Ville ou quartier…" value={lieu} onChange={e=>setLieu(e.target.value)}
              style={{border:'none',background:'transparent',fontSize:13,color:S.text,width:'100%',outline:'none',padding:0}}/>
          </div>
        </div>
      </div>
      </div>
      </div>
      </div>

      <div style={{maxWidth:1360,margin:'0 auto'}}>
        <Section title="Caractéristiques"><SpecGrid items={vehicle.specs}/></Section>
        <Section title="Motorisation"><SpecGrid items={vehicle.motor}/></Section>
        <Section title="Équipements">
          <div style={{display:'flex',flexWrap:'wrap',gap:7}}>{vehicle.equip.map((e,i)=><EquipTag key={i}>{e}</EquipTag>)}</div>
        </Section>
        <Section title="Description"><p style={{fontSize:13,color:S.text2,lineHeight:1.7}}>{vehicle.desc}</p></Section>
        <Section title="Le concessionnaire">
          <AgencyCard vehicle={vehicle} accent={S.vnt} onClick={onOpenAgency}/>
          <MapPlaceholder address={ag.address} accent={S.vntText}/>
        </Section>
        <Section title="Avis d'acheteurs">
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {vehicle.reviews.map((r,i)=><ReviewCard key={i} review={r}/>)}
          </div>
        </Section>
      </div>

      <div style={{position:'sticky',bottom:0,background:'rgba(251,249,246,0.84)',backdropFilter:'blur(14px)',borderTop:`1px solid ${S.border}`,padding:'14px 16px'}}>
        <Btn onClick={()=>setShowPayment(true)} accent={S.vnt} style={{color:S.vntText}}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={S.vntText} strokeWidth={2}><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Procéder à l'achat
        </Btn>
      </div>
    </div>
  );
}

// ── Achat Payment ─────────────────────────────────────────────────────
function VntPayment({ vehicle, onBack, onClose, onNotif }) {
  const [cgu, setCgu] = useState(false);
  const [fraisAck, setFraisAck] = useState(false);
  const [payMethod, setPayMethod] = useState(null);
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [cni, setCni] = useState('');

  const frais = (() => {
    let f = vehicle.price < 5000000 ? 75000 : vehicle.price < 10000000 ? 150000 : vehicle.price < 20000000 ? 250000 : 400000;
    if((vehicle.specs.find(s=>s.label==='Classe')||{}).val==='Luxe') f = Math.round(f*1.5);
    return f;
  })();

  const confirm = () => {
    if(!cgu||!fraisAck){onNotif({icon:'⚠️',title:'Conditions requises',msg:'Veuillez accepter toutes les conditions avant de procéder.'});return;}
    onClose();
    setTimeout(()=>onNotif({icon:'🎉',title:"Réservation d'achat enregistrée !",msg:`Votre dossier pour ${vehicle.name} a été transmis. Vous recevrez sous 24h les instructions pour finaliser l'achat. Les frais de service Car Express sont non remboursables.`}),200);
  };

  return (
    <div style={{position:'fixed',inset:0,background:'#fff',zIndex:1000,overflowY:'auto',paddingBottom:40}}>
      <PageHeader title="Procéder à l'achat" onBack={onBack} accent={S.vnt}/>
      <div style={{maxWidth:1200,margin:'0 auto',padding:'16px'}}>
      <div style={{margin:'0 0 16px',background:S.vntLight,border:`1px solid ${S.vntMid}`,borderRadius:22,padding:18}}>
        <div style={{fontSize:11,fontWeight:500,letterSpacing:'0.6px',color:S.vntText,textTransform:'uppercase',marginBottom:10}}>Véhicule sélectionné</div>
        <div style={{fontSize:13,color:S.text2,lineHeight:1.8}}>
          <div>🚘 <strong>{vehicle.name}</strong> {vehicle.image && <img src={vehicleImages[vehicle.image]} alt="" style={{width:20,height:20,objectFit:'cover',marginLeft:5,borderRadius:4,verticalAlign:'middle'}}/>}</div>
          <div>🏢 {vehicle.agency}</div>
        </div>
        <div style={{borderTop:`1px dashed ${S.vntMid}`,marginTop:10,paddingTop:10}}>
          <Row label="Prix du véhicule" val={vehicle.price.toLocaleString('fr-FR')+' F CFA'}/>
          <Row label="Frais de service Car Express" val={frais.toLocaleString('fr-FR')+' F CFA'} accent={S.vntText}/>
          <div style={{background:S.vntLight,border:`1px solid ${S.vntMid}`,borderRadius:8,padding:'8px 10px',margin:'8px 0',fontSize:11,color:S.vntText,lineHeight:1.5}}>
            ⚠️ Les frais de service sont <strong>non remboursables</strong> après validation.
          </div>
          <div style={{borderTop:`1px dashed ${S.vntMid}`,paddingTop:10,marginTop:6,display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
            <span style={{fontSize:12,fontWeight:500,color:S.text3}}>TOTAL PLATEFORME</span>
            <span style={{fontSize:22,fontWeight:600,color:S.vntText,fontFamily:'DM Mono,monospace'}}>{frais.toLocaleString('fr-FR')} F CFA</span>
          </div>
          <div style={{fontSize:11,color:S.text3,marginTop:4,fontStyle:'italic'}}>Le solde sera réglé directement avec le concessionnaire.</div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:16}}>
      <div>
      <FormCard title="Informations acheteur">
        <FormField label="Nom complet *"><Input placeholder="Prénom et nom" value={nom} onChange={e=>setNom(e.target.value)}/></FormField>
        <FormField label="Téléphone *"><Input type="tel" placeholder="+221 77 000 00 00" value={tel} onChange={e=>setTel(e.target.value)}/></FormField>
        <FormField label="CNI / Passeport *"><Input placeholder="Numéro de pièce d'identité" value={cni} onChange={e=>setCni(e.target.value)}/></FormField>
      </FormCard>
      <FormCard title="Conditions de vente">
        <div style={{background:S.bg2,borderRadius:8,padding:10,fontSize:12,color:S.text2,lineHeight:1.6,maxHeight:80,overflowY:'auto',marginBottom:12}}>
          Le concessionnaire s'engage à fournir un véhicule conforme à la description. L'acheteur dispose d'un délai d'inspection de 48h après prise en main.
        </div>
        <CheckRow checked={cgu} onChange={setCgu} label={<>J'accepte les <u>CGU Car Express</u> et les <u>conditions du concessionnaire</u></>}/>
        <CheckRow checked={fraisAck} onChange={setFraisAck} label={<>Je reconnais que les <strong>frais de service sont non remboursables</strong></>}/>
      </FormCard>
      </div>
      <div>
      <FormCard title="Paiement des frais de service">
        {[{key:'carte',icon:'💳',label:'Carte bancaire',sub:'Visa, Mastercard'},
          {key:'mobile',icon:'📱',label:'Mobile Money',sub:'Wave, Orange Money, Free Money'}
        ].map(m=>(
          <PayOption key={m.key} {...m} selected={payMethod===m.key} onClick={()=>setPayMethod(m.key)} accent={S.vnt} accentText={S.vntText}/>
        ))}
      </FormCard>
      <FormCard title="Apres validation">
        <div style={{display:'grid',gap:10}}>
          <MiniStep>Les frais de service sont regles dans l'application.</MiniStep>
          <MiniStep>Le dossier est transmis au concessionnaire.</MiniStep>
          <MiniStep>Le solde du vehicule est traite directement avec le vendeur.</MiniStep>
        </div>
      </FormCard>
      </div>
      </div>
      <div style={{padding:'0 0 20px',maxWidth:460}}>
        <Btn onClick={confirm} accent={S.vnt} style={{color:S.vntText}}>Confirmer la réservation d'achat</Btn>
      </div>
      </div>
    </div>
  );
}

// ── Agency Profile Page ───────────────────────────────────────────────
export function AgencyProfilePage({ vehicle, onClose }) {
  const { isMobile } = useResponsive();
  const [fleetTab, setFleetTab] = useState('loc');
  const ag = agencyInfo[vehicle?.agency] || {address:'Dakar',stars:'★★★★☆',since:'Depuis 2022',sales:0,nbLoc:0,nbVnt:0};
  const ini = (vehicle?.agency||'').split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
  const fleets = {
    loc:[
      {image:'landcruiser.jpg',name:'Toyota Prado 2021',detail:'SUV · 7 places',price:'85 000 F/jour',avail:true},
      {image:'duster.jpeg',name:'Renault Duster',detail:'SUV · 5 places',price:'55 000 F/jour',avail:true},
      {image:'mercedes sprinter.jpg',name:'Mercedes Sprinter',detail:'Van · 9 places',price:'120 000 F/jour',avail:false}
    ],
    vnt:[{image:'kia.png',name:'Kia Sportage 2019',detail:'SUV · 74 000 km',price:'7 200 000 F CFA',avail:true}],
    both:[{image:'landcruiser.jpg',name:'Toyota Land Cruiser',detail:'SUV · 2022',price:'Location & Vente',avail:true}]
  };

  const avatarSize = isMobile ? 56 : 68;
  const fleetImageWidth = isMobile ? 64 : 78;
  const fleetImageHeight = isMobile ? 46 : 56;

  return (
    <div style={{position:'fixed',inset:0,background:'linear-gradient(180deg, #f8f4ef 0%, #fbf9f6 100%)',zIndex:1500,overflowY:'auto',paddingBottom:80}}>
      <PageHeader title="Profil agence" onBack={onClose}/>
      <div style={{margin:'16px',padding:'22px 18px',border:`1px solid ${S.border}`,borderRadius:28,display:'flex',gap:14,alignItems:'center',background:'rgba(255,255,255,0.82)',backdropFilter:'blur(12px)',boxShadow:'0 20px 44px rgba(17,17,17,0.06)'}}>
        <div style={{width:avatarSize,height:avatarSize,borderRadius:20,background:S.black,display:'flex',alignItems:'center',justifyContent:'center',fontSize:isMobile ? 18 : 22,fontWeight:700,color:'#fff',boxShadow:'0 18px 30px rgba(17,17,17,0.14)'}}>{ini}</div>
        <div>
          <div style={{fontSize:isMobile ? 18 : 21,fontWeight:700}}>{vehicle?.agency}</div>
          <div style={{fontSize:isMobile ? 11 : 12,color:S.text3,marginTop:2}}>{ag.nbLoc>0&&ag.nbVnt>0?'Location & Vente':ag.nbLoc>0?'Location':'Vente'}</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:4}}>
            <span style={{fontSize:isMobile ? 12 : 13}}>{ag.stars}</span>
            <span style={{fontSize:isMobile ? 10 : 11,color:S.text3}}>{ag.address} · {ag.since}</span>
          </div>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,padding:'0 16px 16px'}}>
        {[{label:'En location',val:ag.nbLoc},{label:'En vente',val:ag.nbVnt},{label:'Vendus',val:ag.sales}].map(s=>(
          <div key={s.label} style={{background:'rgba(255,255,255,0.78)',border:`1px solid ${S.border}`,borderRadius:18,padding:14,textAlign:'center',boxShadow:'0 12px 26px rgba(17,17,17,0.04)'}}>
            <div style={{fontSize:isMobile ? 18 : 22,fontWeight:700,fontFamily:'JetBrains Mono,monospace'}}>{s.val}</div>
            <div style={{fontSize:isMobile ? 9 : 10,color:S.text3,marginTop:3}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{display:'flex',borderBottom:`1px solid ${S.border}`,padding:'0 16px'}}>
        {['loc','vnt','both'].map(t=>(
          <div key={t} onClick={()=>setFleetTab(t)}
            style={{flex:1,padding:'10px 0',textAlign:'center',fontSize:isMobile ? 12 : 13,fontWeight:500,cursor:'pointer',color:fleetTab===t?S.black:S.text3,borderBottom:`2px solid ${fleetTab===t?S.black:'transparent'}`,transition:'all 0.2s'}}>
            {t==='loc'?'Location':t==='vnt'?'Vente':'Les deux'}
          </div>
        ))}
      </div>
      <div style={{padding:16,display:'flex',flexDirection:'column',gap:12}}>
        {(fleets[fleetTab]||[]).map((f,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:12,background:'rgba(255,255,255,0.82)',border:`1px solid ${S.border}`,borderRadius:20,padding:14,boxShadow:'0 12px 28px rgba(17,17,17,0.04)'}}>
            <div style={{width:fleetImageWidth,height:fleetImageHeight,background:S.bg2,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:isMobile ? 20 : 24,overflow:'hidden',flexShrink:0}}>
              {f.image ? (
                <img src={vehicleImages[f.image]} alt={f.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
              ) : (
                f.emoji
              )}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:isMobile ? 12 : 13,fontWeight:500}}>{f.name}</div>
              <div style={{fontSize:isMobile ? 10 : 11,color:S.text3}}>{f.detail}</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:isMobile ? 11 : 12,fontWeight:600,fontFamily:'JetBrains Mono,monospace'}}>{f.price}</div>
              <div style={{fontSize:isMobile ? 9 : 10,marginTop:4,padding:'4px 8px',borderRadius:999,background:f.avail?'#e6f4ea':'#FFF0F0',color:f.avail?'#1a7a2e':S.loc}}>{f.avail?'Disponible':'Indisponible'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{padding:'16px'}}>
      <div style={{padding:'18px',border:`1px solid ${S.border}`,borderRadius:26,background:'rgba(255,255,255,0.82)',backdropFilter:'blur(10px)',boxShadow:'0 16px 32px rgba(17,17,17,0.05)'}}>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:'0.16em',color:S.text3,textTransform:'uppercase',marginBottom:14}}>{title}</div>
      {children}
      </div>
    </div>
  );
}

function EquipTag({ children }) {
  return <span style={{fontSize:12,padding:'7px 12px',borderRadius:999,border:`1px solid ${S.border2}`,color:S.text2,background:'linear-gradient(180deg, #ffffff 0%, #fff8f3 100%)',boxShadow:'0 8px 18px rgba(17,17,17,0.04)'}}>{children}</span>;
}

function FormCard({ title, children }) {
  return (
    <div style={{margin:'0 16px 16px',border:`1px solid ${S.border}`,borderRadius:24,overflow:'hidden',background:'rgba(255,255,255,0.84)',backdropFilter:'blur(10px)',boxShadow:'0 16px 36px rgba(17,17,17,0.05)'}}>
      <div style={{padding:'15px 16px',background:'linear-gradient(180deg, #fffaf6 0%, #f4ece3 100%)',borderBottom:`1px solid ${S.border}`,fontSize:13,fontWeight:700}}>{title}</div>
      <div style={{padding:16}}>{children}</div>
    </div>
  );
}

function CheckRow({ checked, onChange, label }) {
  return (
    <label style={{display:'flex',alignItems:'flex-start',gap:10,marginBottom:10,cursor:'pointer'}}>
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} style={{marginTop:2,width:15,height:15,flexShrink:0}}/>
      <span style={{fontSize:12,color:S.text2,lineHeight:1.5}}>{label}</span>
    </label>
  );
}

function PayOption({ icon, label, sub, selected, onClick, accent, accentText }) {
  return (
    <div onClick={onClick}
      style={{display:'flex',alignItems:'center',gap:12,padding:14,border:`2px solid ${selected?(accent||S.loc):S.border}`,borderRadius:18,cursor:'pointer',marginBottom:10,background:selected?(accent==='#FFCC00'?S.vntLight:S.locLight):'rgba(255,255,255,0.88)',transition:'all 0.2s',boxShadow:selected?'0 16px 30px rgba(17,17,17,0.06)':'none'}}>
      <span style={{fontSize:22,width:42,height:42,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.8)'}}>{icon}</span>
      <div>
        <div style={{fontSize:13,fontWeight:500}}>{label}</div>
        <div style={{fontSize:11,color:S.text3}}>{sub}</div>
      </div>
    </div>
  );
}

function QuickStat({ value, label }) {
  const { isMobile } = useResponsive();
  return (
    <div style={{background:'rgba(255,255,255,0.82)',border:`1px solid ${S.border}`,borderRadius:18,padding:14,boxShadow:'0 12px 26px rgba(17,17,17,0.04)'}}>
      <div style={{fontSize:isMobile ? 16 : 18,fontWeight:700,color:S.text,fontFamily:'JetBrains Mono,monospace'}}>{value}</div>
      <div style={{fontSize:isMobile ? 9 : 10,color:S.text3,marginTop:4,textTransform:'uppercase',letterSpacing:'0.12em'}}>{label}</div>
    </div>
  );
}

function MiniStep({ children }) {
  return (
    <div style={{display:'flex',gap:10,alignItems:'flex-start',padding:'10px 12px',borderRadius:14,background:'rgba(24,21,18,0.04)'}}>
      <span style={{width:18,height:18,borderRadius:'50%',background:'rgba(24,21,18,0.08)',display:'inline-flex',alignItems:'center',justifyContent:'center',fontSize:11,flexShrink:0}}>•</span>
      <span style={{fontSize:12,color:S.text2,lineHeight:1.6}}>{children}</span>
    </div>
  );
}

function Row({ label, val, accent }) {
  return (
    <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}>
      <span style={{fontSize:12,color:S.text3}}>{label}</span>
      <span style={{fontSize:13,fontWeight:500,color:accent||S.text,fontFamily:'DM Mono,monospace'}}>{val}</span>
    </div>
  );
}
