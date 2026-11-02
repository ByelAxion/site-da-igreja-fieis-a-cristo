import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown, ArrowLeft, ArrowRight, CalendarDays, Check, Clock3, Cross,
  Heart, Instagram, MapPin, Menu, MessageCircleHeart, Moon, Sun, X,
  Church, BookOpen, Sparkles, Navigation
} from 'lucide-react';
import './styles.css';

const events = [
  { day: 0, name: 'Domingo', type: 'Culto', start: '09:30', end: '11:30', icon: Church },
  { day: 2, name: 'Terça-feira', type: 'Oração', start: '09:00', end: '10:00', icon: Heart },
  { day: 3, name: 'Quarta-feira', type: 'Culto', start: '19:30', end: '21:00', icon: Church },
  { day: 6, name: 'Sábado', type: 'Oração', start: '09:00', end: '10:00', icon: Heart },
];
const photos = [
  { title: 'Comunhão e união', url: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Um lugar de fé', url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Louvor e adoração', url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Momentos de oração', url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Família da fé', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=85' },
  { title: 'Esperança renovada', url: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1200&q=85' },
];

function getNextEvent(now = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', weekday: 'short', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
  });
  const parts = Object.fromEntries(formatter.formatToParts(now).map(p => [p.type, p.value]));
  const weekdays = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const today = weekdays[parts.weekday];
  const currentMinutes = Number(parts.hour) * 60 + Number(parts.minute);
  const candidates = events.map(event => {
    let delta = (event.day - today + 7) % 7;
    const [sh, sm] = event.start.split(':').map(Number);
    const [eh, em] = event.end.split(':').map(Number);
    const start = sh * 60 + sm;
    const end = eh * 60 + em;
    if (delta === 0 && currentMinutes > end) delta = 7;
    const active = delta === 0 && currentMinutes >= start && currentMinutes <= end;
    return { ...event, delta, active, startMinutes: start };
  }).sort((a, b) => a.delta - b.delta || a.startMinutes - b.startMinutes);
  return candidates[0];
}

function App() {
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(-1);
  const [nextEvent, setNextEvent] = useState(() => getNextEvent());
  const [intro, setIntro] = useState(!sessionStorage.getItem('ifc-intro-seen'));
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIntro(false);
      setIntroDone(true);
      sessionStorage.setItem('ifc-intro-seen', '1');
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 400 : 2600);
    const interval = window.setInterval(() => setNextEvent(getNextEvent()), 30000);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, []);

  const nextLabel = nextEvent?.type === 'Culto' ? 'PRÓXIMO CULTO' : 'PRÓXIMO MOMENTO DE ORAÇÃO';
  const navLinks = [['Início', '#inicio'], ['Programação', '#programacao'], ['Galeria', '#momentos'], ['Localização', '#localizacao'], ['Mensagem', '#mensagem']];

  function openPhoto(index) { setActivePhoto(index); setGalleryOpen(true); }
  function changePhoto(direction) { setActivePhoto(i => (i + direction + photos.length) % photos.length); }

  return (
    <div className={`app ${dark ? 'theme-dark' : 'theme-light'}`}>
      {intro && !introDone && <div className="intro" aria-label="Abertura do site">
        <div className="intro-mark">
          <img
            src="/logo-igreja.png"
            alt="Logo da Igreja Fiéis a Cristo"
          />
        </div>
        <div className="intro-line" />
        <h1>Igreja Evangélica<br/><span>Fiéis a Cristo</span></h1>
        <p>Um lugar de fé, amor e acolhimento</p>
      </div>}

      <header className="topbar">
        <a className="brand-mini" href="#inicio" aria-label="Igreja Fiéis a Cristo, início">
          <img src="/logo-igreja.png" alt="Logo Igreja Evangélica Fiéis a Cristo"/>
          <span>Fiéis a Cristo<small>IGREJA EVANGÉLICA</small></span>
        </a>
        <button className="menu-toggle icon-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">{menuOpen ? <X/> : <Menu/>}</button>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          {navLinks.map(([label, href]) => <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <button className="theme-toggle icon-button" onClick={() => setDark(!dark)} aria-label="Alternar tema">{dark ? <Sun size={18}/> : <Moon size={18}/>}</button>
        </nav>
      </header>

      <main>
        <section className="hero section-wrap" id="inicio">
          <div className="hero-logo">
            <div className="logo-halo"></div>
            <img src="/logo-igreja.png" alt="Logo oficial da Igreja Evangélica Fiéis a Cristo"/>
            <span className="logo-caption">FÉ • ESPERANÇA • AMOR</span>
          </div>
          <div className="hero-copy">
            <div className="eyebrow"><span></span> SEJA BEM-VINDO À NOSSA CASA</div>
            <h1>Igreja <em>Fiéis</em><br/>a Cristo</h1>
            <div className="gold-rule"></div>
            <p className="hero-verse">Jesus ama você</p>
            <p className="hero-text">Há lugar para você aqui. Venha compartilhar momentos de fé, renovar sua esperança e caminhar conosco na presença de Deus.</p>
            <a className="button button-gold" href="#programacao">Conheça nossos cultos <ArrowDown size={16}/></a>
            <div className="hero-note"><Heart size={15}/> Você é muito bem-vindo.</div>
          </div>
          <div className="hero-decor" aria-hidden="true">✦</div>
        </section>

        <section className="schedule section-wrap" id="programacao">
          <div className="section-heading">
            <span className="eyebrow">NOSSA SEMANA</span>
            <h2>Cultos e momentos<br/><em>de oração</em></h2>
            <p>Separe um momento para estar conosco. Será uma alegria receber você.</p>
          </div>
          <div className="event-grid">
            {events.map(event => {
              const Icon = event.icon;
              const isNext = nextEvent && event.day === nextEvent.day && event.start === nextEvent.start && event.type === nextEvent.type;
              return <article className={`event-card ${isNext ? 'event-next' : ''}`} key={event.name}>
                {isNext && <div className="next-tag"><Sparkles size={12}/>{nextLabel}</div>}
                <div className="event-icon"><Icon size={21} strokeWidth={1.5}/></div>
                <span className="event-day">{event.name}</span>
                <h3>{event.type}</h3>
                <div className="event-time"><Clock3 size={15}/>{event.start.replace(':','h')}{' às '}{event.end.replace(':','h')}</div>
                <button className="text-button" onClick={() => setModal('presence')}>Confirmar presença <ArrowRight size={15}/></button>
              </article>;
            })}
          </div>
          <p className="schedule-foot"><CalendarDays size={15}/> Programação semanal • Horário de Brasília</p>
        </section>

        <section className="moments section-wrap" id="momentos">
          <div className="section-heading section-heading-row">
            <div><span className="eyebrow">NOSSA COMUNIDADE</span><h2>Momentos especiais<br/><em>em nossa igreja</em></h2></div>
            <p>Pequenos momentos, grandes bênçãos. Uma família que cresce unida na fé.</p>
          </div>
          <div className="photo-stack">
            <button className="photo-card photo-back left" onClick={() => openPhoto(1)} aria-label="Ver foto de comunhão"><img src={photos[1].url} alt={photos[1].title}/></button>
            <button className="photo-card photo-front" onClick={() => openPhoto(0)} aria-label="Ver foto principal"><img src={photos[0].url} alt={photos[0].title}/><span className="photo-caption">Juntos na presença de Deus</span></button>
            <button className="photo-card photo-back right" onClick={() => openPhoto(2)} aria-label="Ver foto de louvor"><img src={photos[2].url} alt={photos[2].title}/></button>
          </div>
          <button className="button button-outline" onClick={() => setGalleryOpen(true)}>Ver todas as fotos <ArrowRight size={16}/></button>
        </section>

        <section className="location section-wrap" id="localizacao">
          <div className="location-copy">
            <span className="eyebrow">VENHA NOS VISITAR</span>
            <h2>Será uma alegria<br/><em>receber você.</em></h2>
            <div className="address-row"><div className="small-icon"><MapPin size={19}/></div><div><strong>Nosso endereço</strong><p>Avenida Primavera de Caiena, nº 668<br/>São Paulo — SP</p></div></div>
            <p className="location-note">Estamos de portas abertas para você e sua família.</p>
            <a className="button button-gold" href="https://waze.com/ul?q=Avenida%20Primavera%20de%20Caiena%20668%2C%20S%C3%A3o%20Paulo%2C%20SP&navigate=yes" target="_blank" rel="noreferrer"><Navigation size={16}/> Como chegar</a>
          </div>
          <div className="map-frame">
            <iframe title="Mapa para a Igreja Fiéis a Cristo" loading="lazy" src="https://maps.google.com/maps?q=Avenida%20Primavera%20de%20Caiena%20668%2C%20S%C3%A3o%20Paulo%2C%20SP&t=&z=15&ie=UTF8&iwloc=&output=embed" referrerPolicy="no-referrer-when-downgrade"></iframe>
            <div className="map-label"><MapPin size={16}/><span>Igreja Evangélica Fiéis a Cristo</span></div>
          </div>
        </section>

        <section className="message-section section-wrap" id="mensagem">
          <div className="message-card">
            <div className="message-ornament"><BookOpen size={22}/></div>
            <span className="eyebrow">UMA PAUSA PARA A ALMA</span>
            <h2>Uma Palavra de Deus<br/><em>para o seu coração</em></h2>
            <p>José enfrentou a injustiça, a solidão e longos períodos de espera. Mesmo sem entender cada etapa, permaneceu firme. No tempo certo, Deus transformou sua história em uma oportunidade de salvar e perdoar. Talvez você também esteja atravessando dias difíceis, mas sua história ainda está sendo escrita.</p>
            <p>Jesus nos ensina a amar, perdoar e não perder a esperança. Continue caminhando pela fé: aquilo que hoje parece um caminho sem saída pode se tornar um testemunho de cuidado e graça. <strong>Deus não abandona você nos dias difíceis.</strong></p>
            <div className="verse-pills"><span>Gênesis 50:20</span><span>Mateus 11:28</span></div>
          </div>
        </section>

        <section className="instagram-section section-wrap">
          <div className="insta-icon"><Instagram size={23}/></div>
          <div><h3>Acompanhe nossa igreja</h3><p>Veja novidades, registros e momentos da nossa comunidade.</p></div>
          <a className="button button-outline" href="https://www.instagram.com/___igrejafieisacristo?utm_source=ig_web_button_share_sheet&exln=ZDNlZDc0MzIxNw==" target="_blank" rel="noreferrer">Visitar Instagram <ArrowRight size={15}/></a>
        </section>

        <section className="support section-wrap">
          <div className="support-icon"><MessageCircleHeart size={22}/></div>
          <div><span className="eyebrow">VOCÊ IMPORTA</span><h3>Você não está sozinho.</h3><p>Pedir ajuda é um ato de coragem. Você não precisa enfrentar momentos difíceis sem apoio.</p></div>
          <a className="cvv-link" href="tel:188"><span>Se precisar de apoio emocional, ligue</span><strong>188</strong><small>Centro de Valorização da Vida · gratuito e sigiloso</small></a>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-cross"><Cross size={18}/></div>
        <p>Page Igreja Fiéis a Cristo</p>
        <small>Site criado pela <strong>Vellmont Studios</strong></small>
        <div className="footer-line"></div>
        <span>“O Senhor te abençoe e te guarde.” — Números 6:24</span>
      </footer>

        <a
  href="https://www.instagram.com/___igrejafieisacristo?utm_source=ig_web_button_share_sheet&exln=ZDNlZDc0MzIxNw=="
  className="instagram-float"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Acompanhe a Igreja Fiéis a Cristo no Instagram"
  title="Siga nossa igreja no Instagram"
>
  <svg
    viewBox="0 0 24 24"
    width="27"
    height="27"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
</a>

      {modal === 'presence' && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={() => setModal(null)}>
        <div className="presence-modal" onClick={e => e.stopPropagation()}>
          <button className="modal-close icon-button" onClick={() => setModal(null)} aria-label="Fechar"><X size={19}/></button>
          <div className="modal-check"><Check size={25}/></div>
          <span className="eyebrow">VOCÊ É NOSSO CONVIDADO</span>
          <h2 id="modal-title">Que alegria!</h2>
          <p>Ficamos felizes que contaremos com sua presença nesse culto, te esperamos!!! Deus te abençoe.</p>
          <button className="button button-gold" onClick={() => setModal(null)}>Amém, até lá <Heart size={15}/></button>
        </div>
      </div>}

      {galleryOpen && <div className="gallery-overlay" role="dialog" aria-modal="true" aria-label="Galeria de fotos">
        <div className="gallery-panel">
          <div className="gallery-header"><div><span className="eyebrow">NOSSA COMUNIDADE</span><h2>Galeria de <em>fotos</em></h2></div><button className="icon-button" onClick={() => setGalleryOpen(false)} aria-label="Fechar galeria"><X/></button></div>
          <p className="gallery-intro">Registros de fé, comunhão e esperança. Em breve, mais momentos da nossa igreja.</p>
          <div className="gallery-grid">{photos.map((photo, index) => <button className="gallery-item" key={photo.title} onClick={() => openPhoto(index)}><img src={photo.url} alt={photo.title}/><span>{photo.title}</span></button>)}</div>
          <button className="button button-outline gallery-back" onClick={() => setGalleryOpen(false)}><ArrowLeft size={16}/> Voltar ao início</button>
        </div>
        {activePhoto >= 0 && <div className="lightbox" onClick={() => setActivePhoto(-1)}>
          <button className="icon-button lightbox-close" onClick={() => {setActivePhoto(-1);}} aria-label="Fechar imagem"><X/></button>
          <button className="icon-button lightbox-prev" onClick={e => {e.stopPropagation();changePhoto(-1);}} aria-label="Foto anterior"><ArrowLeft/></button>
          <img src={photos[activePhoto].url} alt={photos[activePhoto].title} onClick={e => e.stopPropagation()}/>
          <button className="icon-button lightbox-next" onClick={e => {e.stopPropagation();changePhoto(1);}} aria-label="Próxima foto"><ArrowRight/></button>
          <span className="lightbox-caption">{photos[activePhoto].title}</span>
        </div>}
      </div>}
    </div>
  );

}

createRoot(document.getElementById('root')).render(<App />);
