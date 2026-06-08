import { useState, FormEvent } from "react";
import { supabase } from "./supabaseClient";
import { 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  FileCheck, 
  BarChart, 
  Compass, 
  Clock, 
  Menu, 
  X, 
  ArrowRight, 
  ChevronDown, 
  ExternalLink,
  Percent,
  Briefcase,
  Building,
  Rocket
} from "lucide-react";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeSituation, setActiveSituation] = useState<string | null>(null);
  const [supabaseLoading, setSupabaseLoading] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [copysuccess, setCopySuccess] = useState(false);

  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    telefoon: "",
    type_ondernemer: "Ik ben zzp’er",
    bericht: ""
  });


  const sqlSetupCode = `create table contact_requests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  naam text not null,
  email text not null,
  telefoon text,
  type_ondernemer text,
  bericht text
);

-- Activeer Row Level Security (RLS)
alter table contact_requests enable row level security;

-- Sta openbare (anonieme) inserts toe
create policy "Allow anonymous inserts" 
on contact_requests 
for insert 
to anon 
with check (true);`;

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSupabaseLoading(true);
    setSupabaseError(null);

    try {
      // Insertion into the contact_requests table in Supabase
      const { error } = await supabase
        .from("contact_requests")
        .insert([
          {
            naam: formData.naam,
            email: formData.email,
            telefoon: formData.telefoon,
            type_ondernemer: formData.type_ondernemer,
            bericht: formData.bericht,
          }
        ]);

      if (error) {
        console.error("Supabase Error detail:", error);
        // Catch 42P01 (relation does not exist) or other common missing table errors
        if (
          error.code === "42P01" || 
          error.message?.includes("relation") || 
          error.message?.includes("does not exist") ||
          (error as any).status === 404
        ) {
          setSupabaseError("De tabel 'contact_requests' bestaat nog niet in je Supabase database. Geen zorgen! Klik hieronder om de SQL-code te bekijken die je direct in Supabase kunt plakken.");
          setShowSqlGuide(true);
        } else {
          setSupabaseError(`Supabase Foutbericht: ${error.message} (${error.code || 'Geen code'})`);
        }
      } else {
        // Successful insert
        setFormSubmitted(true);
        setFormData({
          naam: "",
          email: "",
          telefoon: "",
          type_ondernemer: "Ik ben zzp’er",
          bericht: ""
        });
      }
    } catch (err: any) {
      console.error("Unexpected error submitting to Supabase:", err);
      setSupabaseError(`Er is een onverwachte fout opgetreden: ${err?.message || err}`);
    } finally {
      setSupabaseLoading(false);
    }
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(sqlSetupCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };


  return (
    <div className="min-h-screen flex flex-col font-sans antialiased text-corporate-dark bg-white selection:bg-primary-blue/10 selection:text-primary-blue">
      
      {/* 1. TOP BAR */}
      <div className="bg-primary-blue text-white text-[13px] py-2.5 relative z-50 border-b border-white/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 text-white/95 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Boekhouding, administratie en fiscaal advies voor ondernemers
          </div>
          <div className="flex items-center gap-4 text-white/90">
            <a href="tel:0100000000" className="flex items-center gap-1.5 hover:text-white transition-colors duration-150">
              <Phone className="w-3.5 h-3.5 text-accent-orange" />
              <span>Bel ons: 010 000 00 00</span>
            </a>
            <span className="text-white/20">|</span>
            <a href="mailto:info@sacarsimsekfinance.nl" className="flex items-center gap-1.5 hover:text-white transition-colors duration-150">
              <Mail className="w-3.5 h-3.5 text-accent-orange" />
              <span>info@sacarsimsekfinance.nl</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. HEADER & NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-[0_2px_15px_-4px_rgba(15,23,42,0.04)] backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 nav flex h-20 items-center justify-between gap-4">
          <a href="/" className="logo group flex flex-col justify-center select-none" id="logo-top">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary-blue group-hover:opacity-95 transition-all duration-200 uppercase">
              SACAR SIMSEK <span className="text-corporate-dark">FINANCE</span>
            </span>
            <span className="text-[11px] tracking-wider uppercase text-slate-grey group-hover:text-primary-blue transition-colors duration-200 mt-0.5 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-orange"></span>
              Administratie en fiscaal advies
            </span>
          </a>

          {/* Crawlable Desktop Nav */}
          <nav className="menu hidden md:flex items-center gap-7 text-[14px] font-semibold text-slate-grey">
            <a href="#diensten" className="hover:text-primary-blue transition-all py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-blue hover:after:w-full after:transition-all after:duration-200">Diensten</a>
            <a href="#werkwijze" className="hover:text-primary-blue transition-all py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-blue hover:after:w-full after:transition-all after:duration-200">Werkwijze</a>
            <a href="#tarieven" className="hover:text-primary-blue transition-all py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-blue hover:after:w-full after:transition-all after:duration-200">Tarieven</a>
            <a href="#faq" className="hover:text-primary-blue transition-all py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-blue hover:after:w-full after:transition-all after:duration-200">FAQ</a>
            <a href="#contact" className="hover:text-primary-blue transition-all py-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-blue hover:after:w-full after:transition-all after:duration-200">Contact</a>
          </nav>

          {/* Primary Action Call with orange color as requested strictly for CTAs */}
          <div className="hidden md:flex items-center">
            <a 
              href="#contact" 
              className="px-6 py-3 bg-accent-orange text-white hover:bg-[#e0893a] transition-all duration-200 rounded-[4px] font-semibold text-[14px] shadow-[0_4px_12px_rgba(242,153,74,0.25)] hover:shadow-[0_6px_16px_rgba(242,153,74,0.35)] active:translate-y-px inline-flex items-center justify-center min-h-[48px] tracking-wide"
            >
              Plan kennismaking
            </a>
          </div>

          {/* Toggle Menu Mobile */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-corporate-dark hover:text-primary-blue transition-colors focus:outline-none min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white/98 backdrop-blur-md absolute top-full left-0 w-full shadow-lg py-4 px-6 animate-fadeIn">
            <div className="flex flex-col gap-4">
              <a 
                href="#diensten" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-2.5 font-semibold text-base text-corporate-dark border-b border-slate-50 hover:text-primary-blue transition-colors"
              >
                Diensten
              </a>
              <a 
                href="#werkwijze" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-2.5 font-semibold text-base text-corporate-dark border-b border-slate-50 hover:text-primary-blue transition-colors"
              >
                Werkwijze
              </a>
              <a 
                href="#tarieven" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-2.5 font-semibold text-base text-corporate-dark border-b border-slate-50 hover:text-primary-blue transition-colors"
              >
                Tarieven
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-2.5 font-semibold text-base text-corporate-dark border-b border-slate-50 hover:text-primary-blue transition-colors"
              >
                FAQ
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)} 
                className="py-2.5 font-semibold text-base text-corporate-dark border-b border-slate-50 hover:text-primary-blue transition-colors"
              >
                Contact
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)} 
                className="w-full text-center py-3.5 bg-accent-orange text-white hover:bg-[#e0893a] transition-all rounded-[4px] font-bold text-[15px] min-h-[48px] flex items-center justify-center mt-2 shadow-sm"
              >
                Plan kennismaking
              </a>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">

        {/* 3. HERO SECTION */}
        <section className="relative text-white md:py-24 py-16 overflow-hidden flex items-center" style={{ minHeight: "640px" }}>
          {/* Circular glow background matching Sleek theme */}
          <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,transparent_70%)]"></div>
          
          {/* Background Visual Stack overlaying high density Unsplash image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80" 
              alt="Boekhouder kantoor achtergrond" 
              className="w-full h-full object-cover object-center scale-105 filter brightness-100"
              referrerPolicy="no-referrer"
            />
            {/* Elegant multi-directional Sleek Gradient Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-corporate-dark via-[#080d54] to-primary-blue opacity-95"></div>
            {/* Subtle grid elements representing financial grids */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 hero_grid grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Hero Main Pitch */}
            <div className="lg:col-span-7 select-none">
              <span className="eyebrow bg-white/10 border border-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-[4px] text-xs font-bold tracking-wide text-white uppercase inline-block mb-5">
                Boekhouder voor zzp’ers, starters en mkb bedrijven
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.1] sm:leading-[1.12]">
                Grip op je administratie en meer rust in je onderneming
              </h1>
              <p className="text-lg sm:text-xl text-slate-100/90 leading-relaxed max-w-2xl mb-8">
                Sacar Simsek Finance helpt ondernemers met duidelijke administratie,
                fiscaal advies en financieel inzicht. Zo weet je precies waar je staat
                en welke keuzes slim zijn voor jouw bedrijf.
              </p>

              <div className="hero_actions flex flex-col sm:flex-row gap-4 mb-8">
                <a 
                  href="#contact" 
                  className="w-full sm:w-auto px-8 py-4 bg-accent-orange text-white hover:bg-[#e0893a] text-center transition-all duration-200 rounded-[4px] font-extrabold text-[15px] uppercase tracking-wider shadow-[0_4px_12px_rgba(242,153,74,0.25)] hover:shadow-[0_6px_16px_rgba(242,153,74,0.35)] active:translate-y-0.5 min-h-[48px] inline-flex items-center justify-center"
                >
                  Plan kennismaking
                </a>
                <a 
                  href="#tarieven" 
                  className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border-2 border-white/30 hover:border-white hover:bg-white/10 text-center transition-all duration-200 rounded-[4px] font-extrabold text-[15px] uppercase tracking-wider min-h-[48px] inline-flex items-center justify-center btn_outline"
                >
                  Bekijk tarieven
                </a>
              </div>
              
              {/* Sleek Design Trust elements displayed inside hero left side */}
              <div className="flex flex-wrap items-center gap-8 text-white/90 text-[13px] border-t border-white/10 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-white/20 bg-white/5 backdrop-blur-md rounded-[4px] flex items-center justify-center text-accent-orange font-extrabold text-lg">
                    +
                  </div>
                  <div className="text-[13px] text-white/80">
                    <strong className="block text-white text-[15px] font-bold">15+ Jaar</strong>
                    Ervaring
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-white/20 bg-white/5 backdrop-blur-md rounded-[4px] flex items-center justify-center text-accent-orange font-extrabold text-lg">
                    ★
                  </div>
                  <div className="text-[13px] text-white/80">
                    <strong className="block text-white text-[15px] font-bold">9.8/10</strong>
                    Klantwaardering
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Card: Profile/Interactive situations selector */}
            <div className="lg:col-span-5 w-full">
              <div className="hero_card bg-white text-corporate-dark p-8 rounded-[6px] border border-slate-100/80 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)] relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-blue/5 rounded-bl-full pointer-events-none -mr-[1px] -mt-[1px]"></div>
                
                <h3 className="text-xl sm:text-2xl font-bold text-corporate-dark tracking-tight mb-6 relative border-l-4 border-primary-blue pl-4">
                  Kies uw profiel
                </h3>

                <div className="profile_grid flex flex-col gap-3">
                  <a 
                    href="#zzp" 
                    onMouseEnter={() => setActiveSituation("zzp")}
                    onMouseLeave={() => setActiveSituation(null)}
                    className={`profile_card flex justify-between items-center px-5 py-4 border rounded-[4px] transition-all duration-200 min-h-[50px] ${
                      activeSituation === "zzp" 
                        ? "border-primary-blue bg-primary-blue/5 shadow-sm" 
                        : "border-slate-200 bg-white text-corporate-dark hover:border-primary-blue hover:bg-primary-blue/2"
                    }`}
                  >
                    <div className="profile-option-text select-none">
                      <h4 className="font-semibold text-[15px] text-corporate-dark">ZZP & Freelancer</h4>
                      <p className="text-[12px] text-slate-grey mt-0.5">Eenvoudig, transparant en betaalbaar.</p>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-primary-blue transition-transform duration-200 ${activeSituation === "zzp" ? "translate-x-1" : ""}`} />
                  </a>

                  <a 
                    href="#mkb" 
                    onMouseEnter={() => setActiveSituation("mkb")}
                    onMouseLeave={() => setActiveSituation(null)}
                    className={`profile_card flex justify-between items-center px-5 py-4 border rounded-[4px] transition-all duration-200 min-h-[50px] ${
                      activeSituation === "mkb" 
                        ? "border-primary-blue bg-primary-blue/5 shadow-sm" 
                        : "border-slate-200 bg-white text-corporate-dark hover:border-primary-blue hover:bg-primary-blue/2"
                    }`}
                  >
                    <div className="profile-option-text select-none">
                      <h4 className="font-semibold text-[15px] text-corporate-dark">MKB Ondernemer</h4>
                      <p className="text-[12px] text-slate-grey mt-0.5">Groeigerichte administratie & advies.</p>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-primary-blue transition-transform duration-200 ${activeSituation === "mkb" ? "translate-x-1" : ""}`} />
                  </a>

                  <a 
                    href="#starter" 
                    onMouseEnter={() => setActiveSituation("starter")}
                    onMouseLeave={() => setActiveSituation(null)}
                    className={`profile_card flex justify-between items-center px-5 py-4 border rounded-[4px] transition-all duration-200 min-h-[50px] ${
                      activeSituation === "starter" 
                        ? "border-primary-blue bg-primary-blue/5 shadow-sm" 
                        : "border-slate-200 bg-white text-corporate-dark hover:border-primary-blue hover:bg-primary-blue/2"
                    }`}
                  >
                    <div className="profile-option-text select-none">
                      <h4 className="font-semibold text-[15px] text-corporate-dark">Startende Ondernemer</h4>
                      <p className="text-[12px] text-slate-grey mt-0.5">De juiste start voor uw onderneming.</p>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-primary-blue transition-transform duration-200 ${activeSituation === "starter" ? "translate-x-1" : ""}`} />
                  </a>
                </div>

                <div className="mt-8 border-t border-slate-100 pt-6 text-center select-none">
                  <p className="text-[13px] text-slate-grey mb-4">Twijfelt u? We bellen u graag terug.</p>
                  <a 
                    href="#contact" 
                    className="w-full py-3 bg-accent-orange text-white hover:bg-[#e0893a] transition-all duration-200 rounded-[4px] font-semibold text-[14px] shadow-[0_4px_12px_rgba(242,153,74,0.25)] hover:shadow-[0_6px_16px_rgba(242,153,74,0.35)] active:translate-y-px inline-flex items-center justify-center min-h-[48px]"
                  >
                    Ontdek uw voordeel
                  </a>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* TRUST BAR */}
        <section className="bg-white border-b border-slate-100/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.02)] py-8 relative z-20 overflow-hidden select-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-bg-light border border-slate-100 rounded-[4px] flex items-center justify-center text-primary-blue font-extrabold text-lg shrink-0">
                ✓
              </div>
              <div className="text-[13px] text-slate-grey leading-tight">
                <strong className="block text-corporate-dark text-[14px] font-bold">Vast tarief</strong>
                Geen verrassingen achteraf.
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-bg-light border border-slate-100 rounded-[4px] flex items-center justify-center text-primary-blue font-extrabold text-lg shrink-0">
                ⚡
              </div>
              <div className="text-[13px] text-slate-grey leading-tight">
                <strong className="block text-corporate-dark text-[14px] font-bold">Snel contact</strong>
                Binnen 24 uur antwoord.
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-bg-light border border-slate-100 rounded-[4px] flex items-center justify-center text-primary-blue font-extrabold text-lg shrink-0">
                🔒
              </div>
              <div className="text-[13px] text-slate-grey leading-tight">
                <strong className="block text-corporate-dark text-[14px] font-bold">100% Digitaal</strong>
                Efficiënt en toekomstbestendig.
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 bg-bg-light border border-slate-100 rounded-[4px] flex items-center justify-center text-primary-blue font-extrabold text-lg shrink-0">
                ⚖
              </div>
              <div className="text-[13px] text-slate-grey leading-tight">
                <strong className="block text-corporate-dark text-[14px] font-bold">Fiscaal Advies</strong>
                Maximaliseer uw voordelen.
              </div>
            </div>

          </div>
        </section>

        {/* 4. DIENSTEN SECTION */}
        <section id="diensten" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="section_intro center text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-primary-blue bg-blue-50 px-3 py-1.5 rounded-[4px] inline-block mb-4">
              Onze Dienstverlening
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-blue leading-tight mb-4">
              Drie pijlers voor financiële rust en groei
            </h2>
            <div className="w-12 h-1 bg-primary-blue mx-auto mb-5 rounded-full"></div>
            <p className="text-lg text-slate-grey leading-relaxed">
              Geen ingewikkelde taal, maar duidelijke ondersteuning waarmee jij betere
              keuzes kunt maken voor je bedrijf.
            </p>
          </div>

          <div className="pillars grid md:grid-cols-3 gap-8">
            
            {/* Pillar 1: Administratie */}
            <article className="pillar bg-white border border-slate-100 p-8 rounded-[6px] shadow-subtle hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="icon_box w-12 h-12 bg-blue-50 text-primary-blue flex items-center justify-center rounded-[4px] font-bold text-xl mb-6 shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-corporate-dark tracking-tight mb-4">
                  Administratie
                </h3>
                <p className="text-slate-grey leading-relaxed mb-6 text-[15px]">
                  Wij zorgen dat je administratie netjes, actueel en overzichtelijk blijft.
                  Van boekingen tot btw aangifte en maandelijkse controle.
                </p>
              </div>
              <a 
                href="#contact" 
                className="link text-primary-blue font-bold text-sm inline-flex items-center gap-1 hover:text-primary-blue/80 transition-colors duration-150 min-h-[44px]"
              >
                <span>Meer over administratie</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>
            </article>

            {/* Pillar 2: Fiscaal advies */}
            <article className="pillar bg-white border border-slate-100 p-8 rounded-[6px] shadow-subtle hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="icon_box w-12 h-12 bg-blue-50 text-primary-blue flex items-center justify-center rounded-[4px] font-bold text-xl mb-6 shadow-sm">
                  <Percent className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-corporate-dark tracking-tight mb-4">
                  Fiscaal advies
                </h3>
                <p className="text-slate-grey leading-relaxed mb-6 text-[15px]">
                  Wij kijken verder dan alleen cijfers verwerken. Je krijgt advies om fiscale
                  kansen beter te benutten en verrassingen te voorkomen.
                </p>
              </div>
              <a 
                href="#contact" 
                className="link text-primary-blue font-bold text-sm inline-flex items-center gap-1 hover:text-primary-blue/80 transition-colors duration-150 min-h-[44px]"
              >
                <span>Meer over advies</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>
            </article>

            {/* Pillar 3: Financieel inzicht */}
            <article className="pillar bg-white border border-slate-100 p-8 rounded-[6px] shadow-subtle hover:shadow-premium hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="icon_box w-12 h-12 bg-blue-50 text-primary-blue flex items-center justify-center rounded-[4px] font-bold text-xl mb-6 shadow-sm">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-corporate-dark tracking-tight mb-4">
                  Financieel inzicht
                </h3>
                <p className="text-slate-grey leading-relaxed mb-6 text-[15px]">
                  Je krijgt meer inzicht in winst, kosten, cashflow en groei. Zo kun je sturen
                  op cijfers in plaats van achteraf reageren.
                </p>
              </div>
              <a 
                href="#contact" 
                className="link text-primary-blue font-bold text-sm inline-flex items-center gap-1 hover:text-primary-blue/80 transition-colors duration-150 min-h-[44px]"
              >
                <span>Meer over inzicht</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </a>
            </article>

          </div>
        </div>
      </section>

      {/* 5. SPLIT ADVANTAGE SECTION */}
      <section className="py-20 split_section bg-bg-light border-y border-slate-100" id="mkb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 split_grid grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left panel: Simulated Live Dashboard Preview containing financial counters */}
          <div className="lg:col-span-5 w-full">
            <div className="relative rounded-[6px] overflow-hidden shadow-premium bg-slate-900 text-white border border-slate-800 p-6 md:p-8 min-h-[440px] flex flex-col justify-between select-none">
              
              {/* Image backup styled behind content inside image panel */}
              <div className="absolute inset-0 z-0 opacity-15">
                <img 
                  src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1100&q=80" 
                  alt="Financiële analyse sfeer" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="relative z-10 flex flex-col gap-6 w-full">
                {/* Simulated App Header */}
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    <span className="text-xs tracking-wider uppercase text-slate-400 font-bold">MKB Portal Preview</span>
                  </div>
                  <span className="text-[11px] bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 px-2 py-0.5 rounded">Sacar Simsek</span>
                </div>

                {/* Simulated Metric Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-[4px] backdrop-blur-md">
                    <span className="text-[11px] text-slate-400 block mb-1">Jaaromzet</span>
                    <span className="text-lg md:text-xl font-extrabold text-[#F2994A]">€ 314.500</span>
                    <span className="text-[9px] text-emerald-400 font-medium block mt-1">↑ 12% vs vorig jr</span>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 p-4 rounded-[4px] backdrop-blur-md">
                    <span className="text-[11px] text-slate-400 block mb-1">Te betalen Btw (Q2)</span>
                    <span className="text-lg md:text-xl font-extrabold text-white">€ 8.410</span>
                    <span className="text-[9px] text-slate-400 block mt-1">Gereed voor indienen</span>
                  </div>
                </div>

                {/* Progress bar and insight item */}
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[4px] flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Fiscale Kansen Benut</span>
                    <span className="text-emerald-400 font-bold">85%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full w-[85%]"></div>
                  </div>
                  <span className="text-[10px] text-slate-400">Proactieve tip: Fiscale investeringsaftrek geactiveerd.</span>
                </div>
              </div>

              {/* Secure partner seal badge */}
              <div className="relative z-10 border-t border-white/10 pt-4 flex items-center justify-between text-xs text-slate-400 mt-6">
                <span className="flex items-center gap-1.5"><FileCheck className="w-4 h-4 text-emerald-400" /> Gecontroleerd & Gecertificeerd</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">Secure Audit</span>
              </div>
            </div>
          </div>

          {/* Right text box */}
          <div className="lg:col-span-7">
            <div className="section_intro mb-8 select-none">
              <span className="text-[11px] font-extrabold tracking-widest uppercase text-primary-blue bg-blue-50 px-3 py-1.5 rounded-[4px] inline-block mb-4">
                Waarom Kiezen Voor Ons
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-blue leading-tight mb-4">
                Een financiële partner die met je meedenkt
              </h2>
              <div className="w-12 h-1 bg-primary-blue mb-5 rounded-full"></div>
              <p className="text-lg text-slate-grey leading-relaxed">
                Als ondernemer wil je geen stapel cijfers zonder uitleg. Je wilt weten wat
                goed gaat, waar risico’s zitten en welke keuzes verstandig zijn.
              </p>
            </div>

            <div className="check_list grid sm:grid-cols-2 gap-4">
              <div className="check_item flex items-center gap-3 bg-white p-4 border-l-4 border-primary-blue rounded-sm shadow-subtle text-[15px] font-bold text-corporate-dark">
                <CheckCircle className="w-5 h-5 text-primary-blue shrink-0" />
                <span>Duidelijke maandelijkse administratie</span>
              </div>
              <div className="check_item flex items-center gap-3 bg-white p-4 border-l-4 border-primary-blue rounded-sm shadow-subtle text-[15px] font-bold text-corporate-dark">
                <CheckCircle className="w-5 h-5 text-primary-blue shrink-0" />
                <span>Proactief fiscaal advies</span>
              </div>
              <div className="check_item flex items-center gap-3 bg-white p-4 border-l-4 border-primary-blue rounded-sm shadow-subtle text-[15px] font-bold text-corporate-dark">
                <CheckCircle className="w-5 h-5 text-primary-blue shrink-0" />
                <span>Overzichtelijke rapportages</span>
              </div>
              <div className="check_item flex items-center gap-3 bg-white p-4 border-l-4 border-primary-blue rounded-sm shadow-subtle text-[15px] font-bold text-corporate-dark">
                <CheckCircle className="w-5 h-5 text-primary-blue shrink-0" />
                <span>Persoonlijk contact zonder onnodig jargon</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. WERKWĲZE SECTION */}
      <section id="werkwijze" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="section_intro center text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-primary-blue bg-blue-50 px-3 py-1.5 rounded-[4px] inline-block mb-4">
              Onze Aanpak
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-blue leading-tight mb-4">
              Zo werken wij samen
            </h2>
            <div className="w-12 h-1 bg-primary-blue mx-auto mb-5 rounded-full"></div>
            <p className="text-lg text-slate-grey leading-relaxed">
              Een helder proces zonder gedoe. Jij weet vanaf het begin waar je aan toe bent.
            </p>
          </div>

          <div className="steps grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Visual connecting line for extra corporate polish in background */}
            <div className="absolute top-[52px] left-12 right-12 h-[2px] bg-slate-100 hidden lg:block z-0"></div>

            {/* Step 1 */}
            <div className="step bg-white border border-slate-100 p-6 rounded-[6px] shadow-subtle hover:border-primary-blue transition-all duration-200 z-10 flex flex-col justify-start">
              <div className="step_number text-white bg-primary-blue w-10 h-10 flex items-center justify-center rounded-[4px] font-bold text-base mb-5 shadow-sm">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-corporate-dark tracking-tight mb-2.5">
                Kennismaking
              </h3>
              <p className="text-slate-grey leading-relaxed text-[14px]">
                We bespreken jouw situatie, onderneming en wensen.
              </p>
            </div>

            {/* Step 2 */}
            <div className="step bg-white border border-slate-100 p-6 rounded-[6px] shadow-subtle hover:border-primary-blue transition-all duration-200 z-10 flex flex-col justify-start">
              <div className="step_number text-white bg-primary-blue w-10 h-10 flex items-center justify-center rounded-[4px] font-bold text-base mb-5 shadow-sm">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-corporate-dark tracking-tight mb-2.5">
                Analyse
              </h3>
              <p className="text-slate-grey leading-relaxed text-[14px]">
                We bekijken je administratie, risico’s en verbeterkansen.
              </p>
            </div>

            {/* Step 3 */}
            <div className="step bg-white border border-slate-100 p-6 rounded-[6px] shadow-subtle hover:border-primary-blue transition-all duration-200 z-10 flex flex-col justify-start">
              <div className="step_number text-white bg-primary-blue w-10 h-10 flex items-center justify-center rounded-[4px] font-bold text-base mb-5 shadow-sm">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-corporate-dark tracking-tight mb-2.5">
                Structuur
              </h3>
              <p className="text-slate-grey leading-relaxed text-[14px]">
                We richten een duidelijke werkwijze in die bij jouw bedrijf past.
              </p>
            </div>

            {/* Step 4 */}
            <div className="step bg-white border border-slate-100 p-6 rounded-[6px] shadow-subtle hover:border-primary-blue transition-all duration-200 z-10 flex flex-col justify-start">
              <div className="step_number text-white bg-primary-blue w-10 h-10 flex items-center justify-center rounded-[4px] font-bold text-base mb-5 shadow-sm">
                4
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-corporate-dark tracking-tight mb-2.5">
                Advies
              </h3>
              <p className="text-slate-grey leading-relaxed text-[14px]">
                Je krijgt doorlopend inzicht en praktisch advies.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 7. PRICING & PACKAGES SECTION */}
      <section className="pricing py-20 bg-bg-light border-y border-slate-100" id="tarieven">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="section_intro center text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-primary-blue bg-blue-50 px-3 py-1.5 rounded-[4px] inline-block mb-4">
              Investeringsplannen
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-blue leading-tight mb-4">
              Transparante pakketten voor iedere ondernemer
            </h2>
            <div className="w-12 h-1 bg-primary-blue mx-auto mb-5 rounded-full"></div>
            <p className="text-lg text-slate-grey leading-relaxed">
              Kies een pakket dat past bij jouw fase. De exacte prijs kan worden afgestemd
              op je administratie en aantal transacties.
            </p>
          </div>

          <div className="pricing_grid grid lg:grid-cols-3 gap-8 items-start">
            
            {/* Starter Plan */}
            <article className="price_card bg-white border border-slate-200 p-8 rounded-[6px] shadow-subtle hover:shadow-premium transition-all duration-200 flex flex-col h-full justify-between" id="starter">
              <div>
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-800 bg-sky-50 px-2.5 py-1 rounded-[4px] inline-block mb-4">Focus</span>
                <h3 className="text-xl sm:text-2xl font-bold text-primary-blue tracking-tight mb-2">
                  Starter
                </h3>
                <p className="text-slate-grey leading-relaxed text-[14px] mb-6">
                  Voor ondernemers die net beginnen.
                </p>
                <div className="price flex items-baseline gap-1 text-corporate-dark mb-6 py-4 border-y border-slate-50">
                  <span className="text-sm font-bold text-slate-400 self-start mt-1">vanaf</span>
                  <span className="text-3xl md:text-4xl font-extrabold tracking-tight">€99</span>
                  <span className="text-sm font-medium text-slate-grey">per maand</span>
                </div>
                <ul className="space-y-3.5 mb-8 text-[14px] text-corporate-dark/90">
                  <li className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs shrink-0">✓</span>
                    <span>Basis administratie</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs shrink-0">✓</span>
                    <span>Btw aangifte</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs shrink-0">✓</span>
                    <span>Korte maandcontrole</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs shrink-0">✓</span>
                    <span>Startadvies</span>
                  </li>
                </ul>
              </div>
              <a 
                href="#contact" 
                className="w-full text-center py-3 bg-primary-blue hover:bg-primary-blue/90 text-white rounded-[4px] font-bold text-[14px] uppercase tracking-wide transition-all min-h-[48px] flex items-center justify-center shadow-sm"
              >
                Vraag advies aan
              </a>
            </article>

            {/* ZZP Plan (Featured, Orange CTA button) */}
            <article className="price_card bg-white border-2 border-primary-blue p-8 rounded-[6px] shadow-[0_20px_50px_rgba(17,27,72,0.06)] hover:shadow-[0_25px_60px_rgba(17,27,72,0.1)] transition-all duration-200 flex flex-col h-full justify-between relative" id="zzp">
              <div className="badge absolute -top-[14px] left-1/2 -translate-x-1/2 bg-primary-blue text-white text-[10px] tracking-widest uppercase font-extrabold px-3 py-1 rounded-[4px]">
                Populair
              </div>
              <div>
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-800 bg-sky-50 px-2.5 py-1 rounded-[4px] inline-block mb-4 mt-2">Scale</span>
                <h3 className="text-xl sm:text-2xl font-bold text-primary-blue tracking-tight mb-2">
                  ZZP
                </h3>
                <p className="text-slate-grey leading-relaxed text-[14px] mb-6">
                  Voor zelfstandige ondernemers.
                </p>
                <div className="price flex items-baseline gap-1 text-corporate-dark mb-6 py-4 border-y border-slate-50">
                  <span className="text-sm font-bold text-slate-400 self-start mt-1">vanaf</span>
                  <span className="text-3xl md:text-4xl font-extrabold tracking-tight">€149</span>
                  <span className="text-sm font-medium text-slate-grey">per maand</span>
                </div>
                <ul className="space-y-3.5 mb-8 text-[14px] text-corporate-dark/90">
                  <li className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs shrink-0">✓</span>
                    <span>Volledige administratie</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs shrink-0">✓</span>
                    <span>Btw aangifte</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs shrink-0">✓</span>
                    <span>Inkomstenbelasting voorbereiding</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs shrink-0">✓</span>
                    <span>Fiscaal advies</span>
                  </li>
                </ul>
              </div>
              {/* Primary orange button exclusive to this featured package */}
              <a 
                href="#contact" 
                className="w-full text-center py-3.5 bg-accent-orange hover:bg-[#e0893a] text-white rounded-[4px] font-extrabold text-[14px] uppercase tracking-wide transition-all min-h-[48px] flex items-center justify-center shadow-md shadow-orange-500/10"
              >
                Plan kennismaking
              </a>
            </article>

            {/* MKB Plan */}
            <article className="price_card bg-white border border-slate-200 p-8 rounded-[6px] shadow-subtle hover:shadow-premium transition-all duration-200 flex flex-col h-full justify-between">
              <div>
                <span className="text-[11px] font-extrabold tracking-wider uppercase text-blue-800 bg-sky-50 px-2.5 py-1 rounded-[4px] inline-block mb-4">Enterprise</span>
                <h3 className="text-xl sm:text-2xl font-bold text-primary-blue tracking-tight mb-2">
                  MKB
                </h3>
                <p className="text-slate-grey leading-relaxed text-[14px] mb-6">
                  Voor groeiende ondernemingen.
                </p>
                <div className="price flex items-baseline gap-1 text-corporate-dark mb-6 py-4 border-y border-slate-50">
                  <span className="text-3xl md:text-4xl font-extrabold tracking-tight">op maat</span>
                  <span className="text-sm font-medium text-slate-grey ml-1">per maand</span>
                </div>
                <ul className="space-y-3.5 mb-8 text-[14px] text-corporate-dark/90">
                  <li className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs shrink-0">✓</span>
                    <span>Uitgebreide administratie</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs shrink-0">✓</span>
                    <span>Management inzicht</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs shrink-0">✓</span>
                    <span>Winstoptimalisatie</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs shrink-0">✓</span>
                    <span>Strategisch advies</span>
                  </li>
                </ul>
              </div>
              <a 
                href="#contact" 
                className="w-full text-center py-3 bg-primary-blue hover:bg-primary-blue/90 text-white rounded-[4px] font-bold text-[14px] uppercase tracking-wide transition-all min-h-[48px] flex items-center justify-center shadow-sm"
              >
                Bespreek je bedrijf
              </a>
            </article>

          </div>
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="section_intro center text-center max-w-3xl mx-auto mb-16">
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-primary-blue bg-blue-50 px-3 py-1.5 rounded-[4px] inline-block mb-4">
              Informatie & Antwoorden
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary-blue leading-tight mb-4">
              Veelgestelde vragen
            </h2>
            <div className="w-12 h-1 bg-primary-blue mx-auto mb-5 rounded-full"></div>
            <p className="text-lg text-slate-grey leading-relaxed">
              Antwoorden op vragen die ondernemers vaak stellen voordat ze overstappen.
            </p>
          </div>

          <div className="faq_grid flex flex-col gap-4 max-w-3xl mx-auto">
            
            {/* FAQ Item 1 */}
            <details className="border border-slate-200 rounded-[6px] p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-150 group">
              <summary className="cursor-pointer font-bold text-[17px] sm:text-[18px] text-corporate-dark hover:text-primary-blue transition-colors duration-150 flex justify-between items-center select-none min-h-[44px]">
                <span>Kan ik makkelijk overstappen van mijn huidige boekhouder?</span>
                <span className="p-1 text-slate-400 group-hover:text-primary-blue transition-transform duration-200"><ChevronDown className="w-5 h-5 shrink-0 transition-transform duration-200 group-open:rotate-180" /></span>
              </summary>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-grey border-t border-slate-100 pt-4">
                Ja, wij helpen je met de overstap en bekijken welke gegevens nodig zijn om goed te starten.
              </p>
            </details>

            {/* FAQ Item 2 */}
            <details className="border border-slate-200 rounded-[6px] p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-150 group">
              <summary className="cursor-pointer font-bold text-[17px] sm:text-[18px] text-corporate-dark hover:text-primary-blue transition-colors duration-150 flex justify-between items-center select-none min-h-[44px]">
                <span>Doen jullie ook btw aangifte?</span>
                <span className="p-1 text-slate-400 group-hover:text-primary-blue transition-transform duration-200"><ChevronDown className="w-5 h-5 shrink-0 transition-transform duration-200 group-open:rotate-180" /></span>
              </summary>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-grey border-t border-slate-100 pt-4">
                Ja, btw aangifte kan onderdeel zijn van het administratiepakket.
              </p>
            </details>

            {/* FAQ Item 3 */}
            <details className="border border-slate-200 rounded-[6px] p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-150 group">
              <summary className="cursor-pointer font-bold text-[17px] sm:text-[18px] text-corporate-dark hover:text-primary-blue transition-colors duration-150 flex justify-between items-center select-none min-h-[44px]">
                <span>Is fiscaal advies inbegrepen?</span>
                <span className="p-1 text-slate-400 group-hover:text-primary-blue transition-transform duration-200"><ChevronDown className="w-5 h-5 shrink-0 transition-transform duration-200 group-open:rotate-180" /></span>
              </summary>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-grey border-t border-slate-100 pt-4">
                Dat hangt af van het pakket. Bij zzp en mkb pakketten kan fiscaal advies worden meegenomen.
              </p>
            </details>

            {/* FAQ Item 4 */}
            <details className="border border-slate-200 rounded-[6px] p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-150 group">
              <summary className="cursor-pointer font-bold text-[17px] sm:text-[18px] text-corporate-dark hover:text-primary-blue transition-colors duration-150 flex justify-between items-center select-none min-h-[44px]">
                <span>Kan ik eerst vrijblijvend kennismaken?</span>
                <span className="p-1 text-slate-400 group-hover:text-primary-blue transition-transform duration-200"><ChevronDown className="w-5 h-5 shrink-0 transition-transform duration-200 group-open:rotate-180" /></span>
              </summary>
              <p className="mt-4 text-[15px] leading-relaxed text-slate-grey border-t border-slate-100 pt-4">
                Ja, je kunt een kennismaking plannen om jouw situatie te bespreken.
              </p>
            </details>

          </div>
        </div>
      </section>

      {/* 9. CONTACT SECTION */}
      <section className="contact py-20 bg-primary-blue text-white relative overflow-hidden" id="contact">
        {/* Decorative background vectors representing safety margins and precision lines */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-orange/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 contact_grid grid lg:grid-cols-12 gap-12 items-start relative z-10">
          
          {/* Left panel */}
          <div className="lg:col-span-5 select-none">
            <span className="text-[11px] font-extrabold tracking-widest uppercase text-white bg-white/10 px-3.5 py-1.5 rounded-[4px] inline-block mb-4">
              Direct Contact
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight mb-5">
              Plan een kennismaking
            </h2>
            <p className="text-lg text-slate-100/90 leading-relaxed max-w-xl mb-8">
              Wil je weten wat Sacar Simsek Finance voor jouw onderneming kan betekenen?
              Vul het formulier in en wij nemen contact met je op.
            </p>

            <div className="contact_info grid gap-4">
              
              <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-[4px] p-5">
                <span className="p-2.5 bg-white/10 rounded-[4px] text-accent-orange shrink-0"><Phone className="w-5 h-5" /></span>
                <div>
                  <span className="text-[11px] tracking-wide uppercase text-slate-300 block mb-1">Telefoon</span>
                  <a href="tel:0100000000" className="text-base font-bold whitespace-nowrap hover:text-accent-orange transition-colors duration-150">010 000 00 00</a>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-[4px] p-5">
                <span className="p-2.5 bg-white/10 rounded-[4px] text-accent-orange shrink-0"><Mail className="w-5 h-5" /></span>
                <div>
                  <span className="text-[11px] tracking-wide uppercase text-slate-300 block mb-1">E mail</span>
                  <a href="mailto:info@sacarsimsekfinance.nl" className="text-base font-bold hover:text-accent-orange transition-colors duration-150">info@sacarsimsekfinance.nl</a>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-[4px] p-5">
                <span className="p-2.5 bg-white/10 rounded-[4px] text-accent-orange shrink-0"><MapPin className="w-5 h-5" /></span>
                <div>
                  <span className="text-[11px] tracking-wide uppercase text-slate-300 block mb-1">Adres</span>
                  <span className="text-base font-bold">Vul hier het kantooradres in</span>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/5 border border-white/10 rounded-[4px] p-5">
                <span className="p-2.5 bg-white/10 rounded-[4px] text-accent-orange shrink-0"><Award className="w-5 h-5" /></span>
                <div>
                  <span className="text-[11px] tracking-wide uppercase text-slate-300 block mb-1">KvK</span>
                  <span className="text-base font-bold">Vul hier het KvK nummer in</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Form: Premium with success notification loop */}
          <div className="lg:col-span-7 w-full bg-white text-corporate-dark p-8 rounded-[6px] shadow-premium border border-slate-100/50 relative">
            {formSubmitted ? (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4 animate-scaleUp">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-primary-blue mb-3">Aanvraag succesvol ontvangen!</h3>
                <p className="text-slate-grey max-w-md leading-relaxed text-[15px] mb-6">
                  Bedankt voor je aanvraag. Wij nemen binnen 24 uur contact met je op om een vrijblijvende afspraak in te plannen.
                </p>
                <button 
                  onClick={() => setFormSubmitted(false)}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all rounded-[4px] font-bold text-sm min-h-[44px]"
                >
                  Nieuw bericht sturen
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 select-none">
                <h3 className="text-lg font-bold text-primary-blue border-b border-slate-100 pb-3 mb-1">
                  Vrijblijvend adviesgesprek aanvragen
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="naam" className="text-xs font-extrabold tracking-wider uppercase text-slate-500">Naam *</label>
                    <input 
                      type="text" 
                      id="naam"
                      name="naam" 
                      placeholder="Naam" 
                      required 
                      value={formData.naam}
                      onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
                      className="w-full p-3.5 border border-slate-200 rounded-[4px] text-base focus:outline-none min-h-[48px]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-extrabold tracking-wider uppercase text-slate-500">E mailadres *</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email" 
                      placeholder="E mailadres" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-3.5 border border-slate-200 rounded-[4px] text-base focus:outline-none min-h-[48px]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="telefoon" className="text-xs font-extrabold tracking-wider uppercase text-slate-500">Telefoonnummer</label>
                    <input 
                      type="tel" 
                      id="telefoon"
                      name="telefoon" 
                      placeholder="Telefoonnummer" 
                      value={formData.telefoon}
                      onChange={(e) => setFormData({ ...formData, telefoon: e.target.value })}
                      className="w-full p-3.5 border border-slate-200 rounded-[4px] text-base focus:outline-none min-h-[48px]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="type_ondernemer" className="text-xs font-extrabold tracking-wider uppercase text-slate-500">Type ondernemer</label>
                    <div className="relative">
                      <select 
                        id="type_ondernemer"
                        name="type_ondernemer"
                        value={formData.type_ondernemer}
                        onChange={(e) => setFormData({ ...formData, type_ondernemer: e.target.value })}
                        className="w-full p-3.5 border border-slate-200 rounded-[4px] text-base focus:outline-none appearance-none min-h-[48px] bg-white pr-10 font-bold text-slate-700"
                      >
                        <option>Ik ben zzp’er</option>
                        <option>Ik ben mkb ondernemer</option>
                        <option>Ik ben starter</option>
                      </select>
                      <span className="absolute inset-y-0 right-0 p-3.5 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown className="w-5 h-5" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="bericht" className="text-xs font-extrabold tracking-wider uppercase text-slate-500">Waar kunnen wij je mee helpen?</label>
                  <textarea 
                    id="bericht"
                    name="bericht" 
                    placeholder="Waar kunnen wij je mee helpen?"
                    value={formData.bericht}
                    onChange={(e) => setFormData({ ...formData, bericht: e.target.value })}
                    className="w-full p-4 border border-slate-200 rounded-[4px] text-base focus:outline-none min-h-[120px] resize-vertical"
                  ></textarea>
                </div>

                {/* Supabase connection guide and error management */}
                {supabaseError && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-[4px] text-amber-800 text-sm flex flex-col gap-2">
                    <p className="font-semibold flex items-center gap-1.5 text-[14px]">
                      <span>⚠️ {supabaseError}</span>
                    </p>
                    <div className="flex flex-wrap gap-4 mt-1 border-t border-amber-200/55 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setShowSqlGuide(!showSqlGuide)} 
                        className="text-primary-blue hover:underline text-xs font-extrabold uppercase tracking-wider"
                      >
                        {showSqlGuide ? "Verberg SQL" : "Toon SQL Setup Instructies"}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setFormSubmitted(true);
                          setFormData({ naam: "", email: "", telefoon: "", type_ondernemer: "Ik ben zzp’er", bericht: "" });
                          setSupabaseError(null);
                        }}
                        className="text-emerald-700 hover:underline text-xs font-extrabold uppercase tracking-wider ml-auto"
                      >
                        Bypass en Test Success UI
                      </button>
                    </div>
                  </div>
                )}

                {showSqlGuide && (
                  <div className="p-4 bg-slate-900 text-slate-100 rounded-[4px] text-xs font-mono relative overflow-hidden flex flex-col gap-3">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest border-b border-light-slate pb-2">
                      <span>Plak dit in de Supabase SQL Editor</span>
                      <button 
                        type="button" 
                        onClick={copySqlToClipboard}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded transition-colors text-[10px] font-bold"
                      >
                        {copysuccess ? "Gekopieerd! ✔" : "Kopieer SQL"}
                      </button>
                    </div>
                    <pre className="overflow-x-auto max-h-[160px] whitespace-pre p-2 bg-slate-950/80 rounded leading-normal text-[11px] text-slate-300">
                      {sqlSetupCode}
                    </pre>
                  </div>
                )}

                {/* Submit action in full accent-orange conversion-focused palette */}
                <button 
                  type="submit" 
                  disabled={supabaseLoading}
                  className={`w-full py-4 bg-accent-orange text-white hover:bg-[#e0893a] transition-all duration-200 rounded-[4px] font-extrabold text-[15px] uppercase tracking-wider shadow-md hover:shadow-lg active:translate-y-0.5 cursor-pointer form_btn min-h-[48px] flex items-center justify-center gap-2 ${supabaseLoading ? "cursor-not-allowed opacity-80" : ""}`}
                >
                  {supabaseLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verwerken naar Supabase...
                    </>
                  ) : "Verstuur aanvraag"}
                </button>

                {/* Beautiful active Supabase link notice */}
                <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-100 text-[11px] text-slate-400 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Geïntegreerd met Supabase (ID: <code className="bg-slate-50 px-1 py-0.5 rounded font-mono text-[10px]">jghvkukr...</code>)
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowSqlGuide(!showSqlGuide)} 
                    className="text-primary-blue hover:underline font-semibold"
                  >
                    SQL Setup Code
                  </button>
                </div>
              </form>

            )}
          </div>

        </div>
      </section>

    </main>

    {/* 10. PREMIUM FOOTER */}
    <footer className="bg-[#070B2F] text-white/90 py-12 border-t border-white/5 relative z-10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="footer_grid flex flex-col md:flex-row justify-between items-start md:items-center gap-8 text-[14px]">
          
          <div className="flex flex-col gap-2">
            <span className="text-lg font-bold tracking-tight text-white">Sacar Simsek Finance</span>
            <span className="text-white/60 leading-relaxed max-w-sm">
              Administratie, fiscaal advies en financieel inzicht voor ambitieuze ondernemers.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
            <div className="flex flex-col gap-2">
              <span className="font-bold text-white text-[11px] tracking-wider uppercase">Contact Link</span>
              <a href="mailto:info@sacarsimsekfinance.nl" className="text-slate-300 hover:text-white transition-colors duration-150">info@sacarsimsekfinance.nl</a>
              <span className="text-slate-400">sacarsimsekfinance.nl</span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-bold text-white text-[11px] tracking-wider uppercase">Quick Jump</span>
              <a href="#logo-top" className="text-slate-300 hover:text-white transition-colors duration-150 inline-flex items-center gap-1">
                <span>Terug naar boven</span>
                <ArrowRight className="w-3.5 h-3.5 -rotate-90" />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 mt-10 pt-8 flex flex-col sm:flex-row justify-between text-xs text-white/40">
          <span>&copy; {new Date().getFullYear()} Sacar Simsek Finance. Alle rechten voorbehouden.</span>
          <span className="flex items-center gap-1 mt-2 sm:mt-0">
            <Clock className="w-3 h-3 text-accent-orange" /> Futureproof Finvora Layout 2026
          </span>
        </div>

      </div>
    </footer>

    </div>
  );
}
