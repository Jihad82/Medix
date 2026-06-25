import React, { useState, useEffect } from 'react';
import { 
  Calendar, Stethoscope, HeartPulse, Check, ChevronDown, Phone, 
  MapPin, Mail, Play, Volume2, ShieldAlert, BookOpen, Clock, 
  Search, CheckCircle2, ChevronRight, Sparkles, Building, Briefcase, Award, ArrowUpRight, HelpCircle, X
} from 'lucide-react';

import { Doctor, Booking } from './types';
import { doctorsData, facilitiesData, testimonialsData, corporateClientsData, faqsData } from './data';
import BookingSystem from './components/BookingSystem';
import ContactForm from './components/ContactForm';
import AdminPortal from './components/AdminPortal';

export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Interactive UI States
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  // Newsletter Sub state
  const [subEmail, setSubEmail] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);
  
  // Appointment status checker state
  const [checkId, setCheckId] = useState('');
  const [checkResult, setCheckResult] = useState<Booking | null>(null);
  const [checkError, setCheckError] = useState(false);

  // Seed default data on mount
  useEffect(() => {
    // Seed database with default listings
    const bookingsStr = localStorage.getItem('medix_bookings');
    if (!bookingsStr) {
      const defaultBookings = [
        {
          id: 'MEDIX-748293',
          doctorId: 'dr-abul-kalam',
          doctorName: 'Prof. Dr. Md. Abul Kalam',
          department: 'United KRS Aesthetic & Plastic Surgery Centre',
          patientName: 'Saiful Hasan',
          patientPhone: '+8801712345678',
          patientEmail: 'saiful.hasan@gmail.com',
          date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          timeSlot: '10:00 AM - 01:00 PM',
          status: 'Pending',
          symptoms: 'Paediatric neurology checkup assessment for skin/nerve laser mapping.',
          age: 8,
          gender: 'Male',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('medix_bookings', JSON.stringify(defaultBookings));
    }
  }, []);

  const handleOpenBooking = (doctorId: string | null = null) => {
    setSelectedDoctorId(doctorId);
    setIsBookingOpen(true);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim() || !/\S+@\S+\.\S+/.test(subEmail)) return;

    // Save subscriber
    const existingSubsStr = localStorage.getItem('medix_subscribers') || '[]';
    const existingSubs = JSON.parse(existingSubsStr);
    existingSubs.push({ email: subEmail, createdAt: new Date().toISOString() });
    localStorage.setItem('medix_subscribers', JSON.stringify(existingSubs));

    setSubSuccess(true);
    setSubEmail('');
    setTimeout(() => setSubSuccess(false), 5000);
  };

  const handleCheckStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckResult(null);
    setCheckError(false);

    if (!checkId.trim()) return;

    const bookingsStr = localStorage.getItem('medix_bookings') || '[]';
    const bookings: Booking[] = JSON.parse(bookingsStr);
    
    // Find booking by ID (case-insensitive) or by email
    const found = bookings.find(
      b => b.id.toLowerCase() === checkId.trim().toLowerCase() || 
           b.patientEmail.toLowerCase() === checkId.trim().toLowerCase()
    );

    if (found) {
      setCheckResult(found);
    } else {
      setCheckError(true);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-stone-800 antialiased selection:bg-orange-500 selection:text-white overflow-x-hidden">
      
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-100 shadow-xs" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group" id="brand-logo">
            <img 
              src="https://medixsignatureclinic.com/images/icon.ico" 
              alt="Medix Logo" 
              className="w-8 h-8 object-contain" 
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black text-stone-900 tracking-tight flex items-baseline">
                medix
                <span className="text-orange-500 font-normal text-xs ml-1 font-sans">clinic</span>
              </span>
              <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest mt-0.5">Signature Clinic</span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-xs font-bold text-stone-600 uppercase tracking-wider" id="desktop-nav">
            <a href="#" className="hover:text-orange-500 transition-colors py-2">Home</a>
            
            {/* Doctors Dropdown (Two Column layout matching the original design requested) */}
            <div className="relative group cursor-pointer py-2">
              <span className="hover:text-orange-500 flex items-center gap-1 transition-colors">
                Doctors <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-orange-500 transition-transform duration-200 group-hover:rotate-180" />
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[580px] bg-white border border-stone-100 rounded-2xl shadow-xl p-4 hidden group-hover:grid grid-cols-2 gap-x-4 gap-y-1 animate-fade-in text-stone-700 capitalize font-medium text-xs">
                <a href="doctorSpecialty.php?specialty=Aesthetic and Plastic Surgery" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Aesthetic & Plastic Surgery</a>
                <a href="doctorSpecialty.php?specialty=Dermatology and Venereology" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Dermatology & Venereology</a>
                <a href="doctorSpecialty.php?specialty=Internal Medicine" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Internal Medicine</a>
                <a href="doctorSpecialty.php?specialty=Respiratory Medicine" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Respiratory Medicine</a>
                <a href="doctorSpecialty.php?specialty=Gastroenterology and Hepatology" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Gastroenterology & Hepatology</a>
                <a href="doctorSpecialty.php?specialty=Obstetrics and Gynaecology" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Obstetrics & Gynaecology</a>
                <a href="doctorSpecialty.php?specialty=General and Hepatobiliary Surgery" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">General & Hepatobiliary Surgery</a>
                <a href="doctorSpecialty.php?specialty=Diabetes and Endocrinology" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Diabetes & Endocrinology</a>
                <a href="doctorSpecialty.php?specialty=Nutrition and Dietetics" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Dietetics & Nutritions</a>
                <a href="doctorSpecialty.php?specialty=Dentistry" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Dentistry</a>
                <a href="doctorSpecialty.php?specialty=Nephrology" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Nephrology</a>
                <a href="doctorSpecialty.php?specialty=Neurology" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Neurology</a>
                <a href="doctorSpecialty.php?specialty=Pediatric Neurology" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Pediatric Neurology</a>
                <a href="doctorSpecialty.php?specialty=Cardiology" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Cardiology</a>
                <a href="doctorSpecialty.php?specialty=ENT and Head Neck Surgery" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">ENT & Head Neck Surgery</a>
                <a href="doctorSpecialty.php?specialty=Physiotherapy" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Physiotherapy</a>
                <a href="doctorSpecialty.php?specialty=Orthopaedics and Trauma" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Orthopaedics & Trauma</a>
                <a href="doctorSpecialty.php?specialty=Pediatrics and Neunatology" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Pediatrics & Neunatology</a>
                <a href="doctorSpecialty.php?specialty=Gynae Oncology, Obstetrics and Gynaecology" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Oncology</a>
                <a href="doctorSpecialty.php?specialty=Urology" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Urology</a>
                <a href="doctorSpecialty.php?specialty=Anesthesia Analgesia ICU" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors col-span-2 text-center border-t border-stone-50 mt-1 pt-1.5">Anesthesia Analgesia ICU</a>
              </div>
            </div>
            
            {/* Services Dropdown */}
            <div className="relative group cursor-pointer py-2">
              <span className="hover:text-orange-500 flex items-center gap-1 transition-colors">
                Services <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-orange-500 transition-transform duration-200 group-hover:rotate-180" />
              </span>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[640px] bg-white border border-stone-100 rounded-2xl shadow-xl p-4 hidden group-hover:grid grid-cols-2 gap-x-6 gap-y-1 animate-fade-in text-stone-700 font-medium text-xs">
                
                {/* Left col of services */}
                <div className="space-y-1">
                  <a href="consultations.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Consultations</a>
                  <a href="diagnostics.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Diagnostics</a>
                  
                  {/* IPD sub-list nested beautifully in the panel */}
                  <div className="border border-stone-100 bg-stone-50/50 p-2 rounded-xl mt-1 space-y-1">
                    <span className="block px-2 text-[10px] font-extrabold uppercase text-stone-400 tracking-wider">In-Patient Department (IPD)</span>
                    <div className="grid grid-cols-2 gap-1 pl-1">
                      <a href="ipdCabin.php" className="block px-2 py-1 hover:bg-white hover:text-orange-600 rounded-md text-[11px] transition-colors">Cabin</a>
                      <a href="ipdDeluxePOD.php" className="block px-2 py-1 hover:bg-white hover:text-orange-600 rounded-md text-[11px] transition-colors">Deluxe POD</a>
                      <a href="ipdPOD.php" className="block px-2 py-1 hover:bg-white hover:text-orange-600 rounded-md text-[11px] transition-colors font-semibold text-stone-800">POD Suite</a>
                      <a href="ipdRecovery.php" className="block px-2 py-1 hover:bg-white hover:text-orange-600 rounded-md text-[11px] transition-colors">Recovery</a>
                      <a href="ipdModularOT.php" className="block px-2 py-1 hover:bg-white hover:text-orange-600 rounded-md text-[11px] transition-colors col-span-2">Modular OT</a>
                    </div>
                  </div>
                  
                  <a href="krs.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">United KRS</a>
                  <a href="dermatologyNlaser.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors truncate">Aesthetic Dermatology & Laser</a>
                  <a href="hairTransplant.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Hair Transplant</a>
                  <a href="minimallyInvasiveSurgeryCenter.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Minimally Invasive Surgery</a>
                </div>
                
                {/* Right col of services */}
                <div className="space-y-1">
                  <a href="gynaeObsInfertility.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Gynae, Obs & Infertility</a>
                  <a href="gastroenterology.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Gastroenterology Centre</a>
                  <a href="dialysisCenter.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Dialysis Centre</a>
                  <a href="dentistry.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Dentistry</a>
                  <a href="physiotherapy.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Physiotherapy</a>
                  <a href="anesthesia.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors truncate">Anesthesia, ICU & Pain Care</a>
                  <a href="vaccination.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Vaccination</a>
                  <a href="ambulance.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Ambulance</a>
                  <a href="emergency.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors text-red-600 font-bold">24/7 Emergency</a>
                  <a href="pharmacy.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors text-emerald-600 font-bold">24/7 Pharmacy</a>
                  <a href="homeSampleCollection.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors text-blue-600">Home Sample Collection</a>
                </div>
                
              </div>
            </div>
            
            {/* Media & Events Dropdown */}
            <div className="relative group cursor-pointer py-2">
              <span className="hover:text-orange-500 flex items-center gap-1 transition-colors">
                Media & Events <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-orange-500 transition-transform duration-200 group-hover:rotate-180" />
              </span>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-stone-100 rounded-xl shadow-lg p-2.5 hidden group-hover:block animate-fade-in text-stone-700 font-medium text-xs space-y-1">
                <a href="latestNews.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Events</a>
                <a href="media.php" className="block px-3 py-1.5 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors">Podcasts & Talkshows</a>
              </div>
            </div>
            
            <a href="about.php" className="hover:text-orange-500 transition-colors py-2">About Us</a>
          </nav>

          {/* Action buttons on Header Right */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpenBooking()}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all shadow-md shadow-orange-100 cursor-pointer"
              id="header-book-btn"
            >
              Book Appointment
            </button>
            
            {/* UHSL branding */}
            <div className="hidden lg:flex flex-col items-end leading-none border-l border-stone-200 pl-4">
              <span className="text-[8px] font-black uppercase text-stone-400 tracking-wider">a brand of</span>
              <span className="text-xs font-black text-emerald-600 flex items-center gap-1 tracking-tight mt-0.5">
                United<span className="text-blue-600 font-semibold">HEALTHCARE</span>
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section 
        className="relative bg-cover bg-stone-50 py-8 md:py-12 lg:py-16 overflow-hidden min-h-[360px] md:min-h-[480px] flex items-center" 
        style={{ backgroundImage: `url('https://medixsignatureclinic.com/images/cover5.jpg')`, backgroundPosition: 'left center' }}
        id="hero-section"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left Column (md:col-span-5): Left empty to keep the clinic building image fully visible without any overlap */}
            <div className="hidden md:block md:col-span-5 lg:col-span-6 h-full pointer-events-none" />

            {/* Right Column (md:col-span-7): Custom styled text block perfectly overlaying the clear light-blue sky */}
            <div className="md:col-span-7 lg:col-span-6 space-y-4 md:space-y-5 bg-white/70 md:bg-transparent backdrop-blur-md md:backdrop-none p-6 md:p-0 rounded-3xl md:rounded-none border border-white/20 md:border-none shadow-xs md:shadow-none">
              
              {/* Title Header: Medix Signature Clinic */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-[#e07b22] leading-none" style={{ fontFamily: 'var(--font-sans)' }}>
                Medix Signature Clinic
              </h2>
              
              {/* Subtitles */}
              <div className="space-y-1">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-stone-800 tracking-tight leading-tight" id="hero-title">
                  Country's First Ever <span className="text-[#e07b22]">Boutique Hospital</span>
                </h1>
                <p className="text-base md:text-lg font-bold text-stone-700" id="hero-subtitle">
                  By United Healthcare
                </p>
              </div>

              {/* Bullet checklist with orange checkmarks ✓ */}
              <div className="space-y-2 pt-1" id="hero-checklist">
                {[
                  'Personalized and Patient - Centered Care',
                  'Exclusive & Limited Patient Volume',
                  'Premium Facilities and Amenitites',
                  'Multi-Specialized Services'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-stone-800 text-sm md:text-base font-bold">
                    <span className="text-[#e07b22] font-black text-lg leading-none flex-shrink-0">✓</span>
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>

              {/* Action booking CTA triggers */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleOpenBooking()}
                  className="px-6 py-3 bg-[#e07b22] hover:bg-[#c96c1b] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  id="hero-cta-booking"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Consult Appointment</span>
                </button>
                <a
                  href="#facilities"
                  className="px-6 py-3 border-2 border-stone-800/40 hover:border-[#e07b22] hover:bg-orange-50/10 text-stone-800 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Explore Facilities</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* QUICKBAR (DOCTOR APPOINTMENT, FIND DOCTOR, HEALTH PACKAGES) */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-1 relative z-10" id="quickbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20">
            
            <button 
              onClick={() => handleOpenBooking()}
              className="py-4 px-6 hover:bg-white/10 text-left transition-all flex items-center gap-4 cursor-pointer"
              id="quickbar-appointment"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-tight">Doctor Appointment</h4>
                <p className="text-[11px] text-orange-100 mt-0.5 font-medium">Instantly book slot with specialized consultant</p>
              </div>
            </button>

            <a 
              href="#consultants"
              className="py-4 px-6 hover:bg-white/10 text-left transition-all flex items-center gap-4"
              id="quickbar-find-doctor"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white flex-shrink-0">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-tight">Find Your Doctor</h4>
                <p className="text-[11px] text-orange-100 mt-0.5 font-medium">Browse aesthetics, dermatology, & plastic surgeons</p>
              </div>
            </a>

            <button 
              onClick={() => handleOpenBooking()}
              className="py-4 px-6 hover:bg-white/10 text-left transition-all flex items-center gap-4 cursor-pointer"
              id="quickbar-packages"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white flex-shrink-0">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-tight">Health Packages</h4>
                <p className="text-[11px] text-orange-100 mt-0.5 font-medium">Comprehensive checkups with boutique hospitality</p>
              </div>
            </button>

          </div>
        </div>
      </section>

      {/* WHY MEDIX CLONE SECTIONS (Care That Respects You, Doctors Collaborate, Beyond Chaos) */}
      <section className="py-20 space-y-24 bg-white" id="why-medix">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-orange-500 text-xs font-bold tracking-widest uppercase block mb-1">Boutique Healthcare</span>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">Why Medix Signature Clinic?</h2>
            <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full" />
          </div>

          {/* Block 1: Care That Respects You */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="overflow-hidden rounded-2xl shadow-xl border border-stone-100">
              <img 
                src="https://medixsignatureclinic.com/images/homePage1.jpg" 
                alt="Doctor explaining diagnosis to patient" 
                className="w-full h-[300px] object-cover hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-4 md:pl-6">
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Why Medix Signature Clinic?</span>
              <h3 className="text-2xl font-black text-stone-900 tracking-tight leading-tight">Care That Respects You</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Our doctors take time to explain your diagnosis and treatment options clearly. You can ask questions without feeling rushed. Your treatment plan considers your lifestyle and concerns, ensuring you receive personalized medical attention tailored strictly to your schedule.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => handleOpenBooking()}
                  className="text-orange-600 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1 hover:text-orange-700 cursor-pointer"
                >
                  Schedule an appointment <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Block 2: Doctors Who Collaborate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2 overflow-hidden rounded-2xl shadow-xl border border-stone-100">
              <img 
                src="https://medixsignatureclinic.com/images/homePage2.jpg" 
                alt="Medical consultants collaborating" 
                className="w-full h-[300px] object-cover hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-4 md:pr-6">
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Why Medix Signature Clinic?</span>
              <h3 className="text-2xl font-black text-stone-900 tracking-tight leading-tight">Doctors Who Collaborate</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Your specialists work in the same facility and can easily consult each other. Better coordination, less repetition, and smoother care. At United KRS center, your aesthetic surgeries, laser operations, and post-op nursing are handled in unison under one team.
              </p>
              <div className="pt-2">
                <a 
                  href="#consultants"
                  className="text-orange-600 font-extrabold text-xs uppercase tracking-wider flex items-center gap-1 hover:text-orange-700"
                >
                  Meet our consultants <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Block 3: Beyond Hospital Chaos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="overflow-hidden rounded-2xl shadow-xl border border-stone-100">
              <img 
                src="https://medixsignatureclinic.com/images/homePage3.jpg" 
                alt="Quiet and luxurious clinic lobby" 
                className="w-full h-[300px] object-cover hover:scale-102 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-4 md:pl-6">
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Why Medix Signature Clinic?</span>
              <h3 className="text-2xl font-black text-stone-900 tracking-tight leading-tight">Beyond Hospital Chaos</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                All the medical expertise you need in one calm, boutique facility. No crowds, no long waits. Hospital-quality care with personal attention. Enjoy cozy in-patient chambers, state-of-the-art diagnostics, and 24/7 dedicated support away from busy central institutions.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleOpenBooking()}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg tracking-wider transition-all cursor-pointer shadow"
                >
                  Reserve Boutique Care
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* OUR FACILITY SECTION (with interactive virtual tour) */}
      <section className="py-20 bg-stone-50 border-t border-stone-100" id="facilities">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Facility List Details */}
            <div className="space-y-6">
              <div>
                <span className="text-orange-500 text-xs font-bold tracking-widest uppercase block mb-1">State of the Art</span>
                <h2 className="text-3xl font-black text-stone-900 tracking-tight">Our Facility</h2>
                <p className="text-stone-500 text-xs mt-1">Welcome to Medix Signature Clinic—a 38,000 sq. ft. boutique healthcare destination designed to combine world-class medical excellence with exceptional comfort.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="facilities-grid">
                {facilitiesData.map((fac, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-stone-200/60 shadow-xs">
                    <div className="w-5 h-5 bg-orange-100 rounded-md flex items-center justify-center text-orange-600 flex-shrink-0">
                      <Check className="w-3 h-3 stroke-[3.5]" />
                    </div>
                    <span className="text-xs font-bold text-stone-700 truncate">{fac}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Facility Video Tour Player */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-video bg-stone-900 group">
              <iframe 
                src="https://www.youtube.com/embed/TLaxV3pUAYo?autoplay=1&mute=1&loop=1&playlist=TLaxV3pUAYo" 
                title="Our Facility Video Tour"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                referrerPolicy="no-referrer"
              ></iframe>
              <div className="hidden">
                <div className="absolute inset-0 bg-stone-950/90 z-10 flex flex-col p-6 justify-between animate-fade-in" id="virtual-tour-screen">
                  <div className="flex justify-between items-center text-white border-b border-stone-800 pb-2">
                    <h4 className="text-xs font-black tracking-wider uppercase text-orange-400">Medix Walkthrough Slideshow</h4>
                  </div>
                  
                  {/* Virtual slides */}
                  <div className="flex-1 flex flex-col justify-center items-center text-center py-4 space-y-2">
                    <div className="w-full max-w-xs h-32 rounded-lg bg-stone-900 border border-stone-800 overflow-hidden relative">
                      <div className="absolute inset-0 bg-orange-600/10 flex items-center justify-center text-orange-400 font-mono text-xs font-bold">
                        VIRTUAL PANORAMA
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-xs text-white">OPD Suites & Laser Theatres</p>
                      <p className="text-[10px] text-stone-500">Equipped with state-of-the-art FDA approved laser chambers.</p>
                    </div>
                  </div>

                  <div className="flex justify-between text-[10px] text-stone-500">
                    <span>Press Exit to return to site</span>
                    <span className="text-orange-500 font-bold">● LIVE STREAM</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONSULTANTS Roster */}
      <section className="py-20 bg-white" id="consultants">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-orange-500 text-xs font-bold tracking-widest uppercase block mb-1">Our Experts</span>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">Our Consultants</h2>
            <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full" />
            <p className="text-stone-500 text-xs mt-2.5">Highly certified consultants from United KRS Aesthetic & Plastic Surgery center.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="doctors-listing">
            {doctorsData.map((doc) => (
              <div 
                key={doc.id}
                className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden shadow-xs hover:shadow-lg hover:border-orange-200 transition-all flex flex-col group"
              >
                {/* Photo */}
                <div className="relative overflow-hidden aspect-h-4 aspect-w-3 bg-stone-100">
                  <img 
                    src={doc.imageUrl} 
                    alt={doc.name} 
                    className="w-full h-72 object-cover group-hover:scale-102 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white text-[10px] font-mono leading-tight">{doc.education}</p>
                  </div>
                </div>

                {/* Profile detail */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-stone-900 text-sm leading-tight tracking-tight group-hover:text-orange-600 transition-colors">{doc.name}</h3>
                    <p className="text-orange-600 text-xs font-semibold">{doc.title}</p>
                    <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed">{doc.department}</p>
                  </div>

                  <div className="pt-4 border-t border-stone-100 mt-4 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-500 bg-stone-50 px-2 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <span className="font-medium truncate">{doc.availability.days.join(', ')}</span>
                    </div>
                    
                    <button
                      onClick={() => handleOpenBooking(doc.id)}
                      className="w-full py-2 bg-stone-900 hover:bg-orange-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>Book Appointment</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CORPORATE CLIENTS */}
      <section className="py-12 bg-stone-50 border-t border-b border-stone-200/50" id="corporate">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-stone-400 text-xs font-bold tracking-widest uppercase mb-6">Our Corporate Partners & Clients</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3" id="corporate-partners">
            {corporateClientsData.map((client, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-white border border-stone-200/70 rounded-xl shadow-xs flex flex-col items-center justify-center h-16 hover:border-orange-300 hover:shadow-sm transition-all"
                title={client.description}
              >
                <span className="font-mono text-xs font-black tracking-widest text-stone-500 group-hover:text-stone-900">{client.logoText}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-20 bg-white" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-orange-500 text-xs font-bold tracking-widest uppercase block mb-1">Feedback</span>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">Few of Our Patients</h2>
            <div className="w-12 h-1 bg-orange-500 mx-auto mt-3 rounded-full" />
          </div>

          <div className="max-w-2xl mx-auto" id="testimonials-block">
            {/* Active Testimonial Card */}
            <div className="p-8 bg-amber-500 rounded-3xl text-white shadow-xl relative overflow-hidden transition-all duration-500 min-h-[220px] flex flex-col justify-between">
              {/* Background styling elements */}
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/5 rounded-full blur-xl" />
              
              <div className="space-y-4">
                <p className="text-base sm:text-lg leading-relaxed font-medium italic">
                  "{testimonialsData[activeTestimonial].content}"
                </p>
              </div>

              <div className="pt-6 border-t border-white/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                    {testimonialsData[activeTestimonial].avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{testimonialsData[activeTestimonial].name}</h4>
                    <p className="text-orange-100 text-[11px] font-medium">{testimonialsData[activeTestimonial].role}</p>
                  </div>
                </div>

                <div className="flex gap-1.5">
                  {testimonialsData.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                        activeTestimonial === idx ? 'bg-white w-6' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION Accordion */}
      <section className="py-16 bg-stone-50 border-t border-b border-stone-100" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-stone-900 tracking-tight flex items-center justify-center gap-1.5">
              <HelpCircle className="w-6 h-6 text-orange-500" />
              Frequently Asked Questions
            </h2>
            <p className="text-stone-500 text-xs mt-1">Get answers to standard questions about Medix Boutique Hospital.</p>
          </div>

          <div className="space-y-3" id="faq-accordions">
            {faqsData.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left font-bold text-xs sm:text-sm text-stone-800 hover:text-orange-600 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${activeFaq === idx ? 'transform rotate-180 text-orange-500' : ''}`} />
                </button>
                
                {activeFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-stone-500 leading-relaxed border-t border-stone-50 pt-3 bg-stone-50/50 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* BOOKING STATUS CHECKER & CONTACT SECTION (split-grid) */}
      <section className="py-20 bg-white" id="booking-checker-contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Col (8 spans): Contact form and address info */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-orange-500 text-xs font-bold tracking-widest uppercase block mb-1">Get In Touch</span>
                <h2 className="text-3xl font-black text-stone-900 tracking-tight">Contact Medix</h2>
                <p className="text-stone-500 text-xs mt-1">Have any questions about treatments, consultants, or packages? Send us a direct message below.</p>
              </div>

              {/* Form Component */}
              <ContactForm />
            </div>

            {/* Right Col (5 spans): Live booking status checker */}
            <div className="lg:col-span-5 bg-gradient-to-br from-stone-900 to-stone-950 text-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6" id="appointment-checker-card">
              <div>
                <span className="text-orange-400 text-[10px] font-black tracking-widest uppercase block">Patient Hub</span>
                <h3 className="text-xl font-bold text-white tracking-tight mt-1">Live Appointment Checker</h3>
                <p className="text-stone-400 text-xs mt-1">Check the status of your clinic booking (Pending, Approved, or Cancelled) using your booking ID or email address.</p>
              </div>

              <form onSubmit={handleCheckStatus} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">Enter Booking ID or Email</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. MEDIX-748293 or saiful@gmail.com"
                      value={checkId}
                      onChange={(e) => setCheckId(e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-lg text-xs outline-none focus:border-orange-500 text-white"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                    >
                      Check
                    </button>
                  </div>
                </div>
              </form>

              {/* Status display result */}
              {checkResult && (
                <div className="p-4 bg-stone-900 border border-stone-800 rounded-xl space-y-3.5 animate-scale-up" id="checker-success-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-bold text-orange-400">{checkResult.id}</span>
                      <p className="font-extrabold text-sm text-white mt-1">{checkResult.patientName}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full tracking-wider uppercase border ${
                      checkResult.status === 'Confirmed' 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : checkResult.status === 'Pending'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {checkResult.status}
                    </span>
                  </div>

                  <div className="border-t border-stone-800 pt-3 text-[11px] space-y-1.5 text-stone-300">
                    <p>Consultant: <strong className="text-white">{checkResult.doctorName}</strong></p>
                    <p>Department: <span className="text-orange-400 font-medium">{checkResult.department}</span></p>
                    <div className="grid grid-cols-2 gap-2 mt-2 bg-stone-950 p-2.5 rounded-lg text-[10px]">
                      <div>
                        <span className="text-stone-500 font-bold block uppercase text-[8px]">Appointment Date</span>
                        <span className="font-bold text-white mt-0.5 inline-block">{checkResult.date}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 font-bold block uppercase text-[8px]">Scheduled Slot</span>
                        <span className="font-semibold text-white mt-0.5 inline-block">{checkResult.timeSlot}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {checkError && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2 animate-shake" id="checker-error-card">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <p>No medical record matching that ID or Email exists in local database.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER BAR WITH CONTACT DETS */}
      <footer className="bg-stone-950 text-stone-400 text-xs divide-y divide-stone-900" id="main-footer">
        
        {/* Top details bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-600/15 border border-orange-500/20 flex items-center justify-center text-orange-500 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Find us</p>
                <p className="font-extrabold text-stone-200 mt-0.5">62 Satmasjid Road, Dhanmondi, Dhaka</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-600/15 border border-orange-500/20 flex items-center justify-center text-orange-500 flex-shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Contact Us</p>
                <p className="font-extrabold text-stone-200 mt-0.5">+8801847-413462</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-orange-600/15 border border-orange-500/20 flex items-center justify-center text-orange-500 flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Mail Us</p>
                <p className="font-extrabold text-stone-200 mt-0.5">medix@uhslbd.com</p>
              </div>
            </div>

          </div>
        </div>

        {/* Middle footer elements */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Logo/description (4 cols) */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <img 
                  src="https://medixsignatureclinic.com/images/icon.ico" 
                  alt="Medix Logo" 
                  className="w-6 h-6 object-contain" 
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col leading-none">
                  <span className="text-sm font-black text-white tracking-tight">medix signature clinic</span>
                  <span className="text-[7px] text-stone-500 font-bold uppercase tracking-widest mt-0.5">boutique hospital</span>
                </div>
              </div>
              <p className="text-stone-500 text-[11px] leading-relaxed pr-6">
                We offer collaborative, respectful, and personalized medical care in a single, calm, boutique facility. A subsidiary healthcare asset of United Group UHSL.
              </p>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Follow us</p>
                <div className="flex gap-2.5">
                  {['Facebook', 'Twitter', 'Google+'].map((p, idx) => (
                    <a key={idx} href="#" className="text-xs hover:text-white transition-colors">{p}</a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick links (4 cols) */}
            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white font-extrabold text-xs uppercase tracking-widest mb-3.5 border-l-2 border-orange-500 pl-2">Quick Links</h4>
                <ul className="space-y-2 text-[11px] font-medium">
                  <li><button onClick={() => handleOpenBooking()} className="hover:text-white cursor-pointer transition-colors text-left">Book Appointment</button></li>
                  <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                  <li><a href="#facilities" className="hover:text-white transition-colors">Clinic Facilities</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-extrabold text-xs uppercase tracking-widest mb-3.5 border-l-2 border-orange-500 pl-2">Sectors</h4>
                <ul className="space-y-2 text-[11px] font-medium">
                  <li><a href="#consultants" className="hover:text-white transition-colors">Our Doctors</a></li>
                  <li><a href="#corporate" className="hover:text-white transition-colors">Corporate Care</a></li>
                  <li><button onClick={() => setIsAdminOpen(true)} className="hover:text-orange-500 font-bold transition-all text-left">Operator Portal (Staff)</button></li>
                </ul>
              </div>
            </div>

            {/* Newsletter Subscription (4 cols) */}
            <div className="md:col-span-4 space-y-3.5">
              <h4 className="text-white font-extrabold text-xs uppercase tracking-widest border-l-2 border-orange-500 pl-2">Subscribe</h4>
              <p className="text-stone-500 text-[11px] leading-relaxed">Don't miss to subscribe to our new feeds, kindly fill the form below.</p>
              
              {subSuccess ? (
                <p className="text-emerald-400 font-bold text-[11px] bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                  Subscribed successfully! Email added to roster.
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-1 bg-stone-900 p-1.5 rounded-lg border border-stone-800">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    className="flex-1 bg-transparent px-2.5 py-1 text-xs outline-none text-white focus:placeholder-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

        {/* Legal copyright footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-stone-600 text-[10px]">
          <p>© 2026 Medix Signature Clinic. All Rights Reserved. Managed under United Healthcare Group.</p>
          <button 
            onClick={() => setIsAdminOpen(true)}
            className="mt-1.5 hover:text-orange-500 transition-colors font-bold cursor-pointer"
          >
            Access Clinician Admin Dashboard
          </button>
        </div>

      </footer>

      {/* FLOATING ACTION TRIGGER */}
      <button
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-4 right-4 z-30 p-3 bg-stone-900 hover:bg-orange-600 text-stone-300 hover:text-white rounded-full transition-all shadow-xl border border-stone-800/80 flex items-center justify-center cursor-pointer group"
        title="Open Clinician Staff Panel"
        id="floating-operator-btn"
      >
        <Building className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all font-bold text-[10px] uppercase tracking-widest leading-none pl-0 group-hover:pl-2">Staff Portal</span>
      </button>

      {/* BOOKING MODAL COMPONENT */}
      <BookingSystem 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialDoctorId={selectedDoctorId}
      />

      {/* ADMIN CONSOLE PORTAL OVERLAY */}
      {isAdminOpen && (
        <AdminPortal 
          onClose={() => {
            setIsAdminOpen(false);
            // Refresh data in main application after closing admin console (in case updates occurred)
            setCheckResult(null);
            setCheckError(false);
            setCheckId('');
          }}
        />
      )}

    </div>
  );
}
