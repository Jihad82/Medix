import React, { useState, useEffect } from 'react';
import { 
  X, Calendar as CalendarIcon, Clock, User, Phone, Mail, FileText, 
  CheckCircle, ChevronRight, ChevronLeft, Award, Sparkles, Activity, ShieldAlert
} from 'lucide-react';
import { Doctor, Booking } from '../types';
import { doctorsData } from '../data';

interface BookingSystemProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoctorId?: string | null;
}

export default function BookingSystem({ isOpen, onClose, initialDoctorId }: BookingSystemProps) {
  const [step, setStep] = useState(1);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  
  // Patient details form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: 'Male',
    symptoms: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  // Set initial doctor if provided
  useEffect(() => {
    if (initialDoctorId) {
      const doc = doctorsData.find(d => d.id === initialDoctorId);
      if (doc) {
        setSelectedDoctor(doc);
        setSelectedDept(doc.department);
        setStep(3); // skip department and doctor selection
      }
    } else {
      setStep(1);
      setSelectedDept('');
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedSlot('');
    }
  }, [initialDoctorId, isOpen]);

  if (!isOpen) return null;

  // Get unique departments
  const departments = Array.from(new Set(doctorsData.map(doc => doc.department)));

  // Filter doctors by selected department
  const filteredDoctors = selectedDept 
    ? doctorsData.filter(doc => doc.department === selectedDept)
    : doctorsData;

  const handleNextStep = () => {
    if (step === 1 && !selectedDept) {
      setErrors({ dept: 'Please select a clinic department' });
      return;
    }
    if (step === 2 && !selectedDoctor) {
      setErrors({ doctor: 'Please select a consultant specialist' });
      return;
    }
    if (step === 3) {
      if (!selectedDate) {
        setErrors({ date: 'Please choose a convenient date' });
        return;
      }
      if (!selectedSlot) {
        setErrors({ slot: 'Please choose an available time slot' });
        return;
      }
    }
    setErrors({});
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setErrors({});
    setStep(prev => prev - 1);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Patient name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Contact number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.age.trim() || isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = 'Please enter a valid age';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const bookingId = 'MEDIX-' + Math.floor(100000 + Math.random() * 900000);
    const newBooking: Booking = {
      id: bookingId,
      doctorId: selectedDoctor?.id || 'general',
      doctorName: selectedDoctor?.name || 'General OPD Doctor',
      department: selectedDept || selectedDoctor?.department || 'General Medicine',
      patientName: formData.name,
      patientPhone: formData.phone,
      patientEmail: formData.email,
      date: selectedDate,
      timeSlot: selectedSlot,
      status: 'Confirmed', // Automatically confirm in our client-side demo, but editable in admin panel!
      symptoms: formData.symptoms,
      age: Number(formData.age),
      gender: formData.gender,
      notes: formData.notes,
      createdAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingBookingsStr = localStorage.getItem('medix_bookings');
    const existingBookings: Booking[] = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
    existingBookings.unshift(newBooking);
    localStorage.setItem('medix_bookings', JSON.stringify(existingBookings));

    setCreatedBooking(newBooking);
    setStep(5); // Final success step
  };

  const handlePrint = () => {
    window.print();
  };

  // Generate date options (next 10 days, excluding days the doctor isn't available if doctor has availability)
  const getDateOptions = () => {
    const dates = [];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    for (let i = 1; i <= 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dayName = daysOfWeek[d.getDay()];
      
      // If doctor is selected, verify doctor works on this day
      if (selectedDoctor && !selectedDoctor.availability.days.includes(dayName)) {
        continue;
      }
      
      // Also ignore Fridays (clinic is closed on Fridays)
      if (d.getDay() === 5) continue;

      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dates.push({ dateStr, label, dayName });
    }
    return dates;
  };

  const availableDates = getDateOptions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="booking-system-modal">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 animate-pulse" />
            <h2 className="text-xl font-bold tracking-tight">Medix Signature Booking</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
            id="close-booking-btn"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Multi-step progress bar */}
        {step < 5 && (
          <div className="px-6 py-3 bg-stone-50 border-b border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-500">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-orange-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-stone-200'}`}>1</span>
              <span>Specialty</span>
            </div>
            <ChevronRight className="w-3 text-stone-300" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-orange-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-stone-200'}`}>2</span>
              <span>Consultant</span>
            </div>
            <ChevronRight className="w-3 text-stone-300" />
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-orange-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-orange-600 text-white' : 'bg-stone-200'}`}>3</span>
              <span>Date & Time</span>
            </div>
            <ChevronRight className="w-3 text-stone-300" />
            <div className={`flex items-center gap-1.5 ${step >= 4 ? 'text-orange-600' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 4 ? 'bg-orange-600 text-white' : 'bg-stone-200'}`}>4</span>
              <span>Patient Details</span>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {/* Step 1: Select Department */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto mb-6">
                <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">Step 1</span>
                <h3 className="text-xl font-bold text-stone-900 mt-1">Select Specialty Department</h3>
                <p className="text-stone-500 text-sm mt-1">Select the specialized department designed to provide coordinated and customized boutique treatment.</p>
              </div>

              {errors.dept && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  {errors.dept}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="specialty-grid">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => {
                      setSelectedDept(dept);
                      setSelectedDoctor(null); // Reset doctor if dept changes
                      setErrors({});
                    }}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between h-32 ${
                      selectedDept === dept 
                        ? 'border-orange-500 bg-orange-50/50 shadow-md shadow-orange-100/50' 
                        : 'border-stone-200 hover:border-orange-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-800 text-sm leading-tight">{dept}</h4>
                      <p className="text-xs text-stone-500 mt-1">Specialized patient care and advanced facilities.</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Specialist */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto mb-6">
                <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">Step 2</span>
                <h3 className="text-xl font-bold text-stone-900 mt-1">Choose Specialist Consultant</h3>
                <p className="text-stone-500 text-sm mt-1">Our highly certified consultants work in collaboration to treat your condition comprehensively.</p>
              </div>

              {errors.doctor && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  {errors.doctor}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="consultants-selection-grid">
                {filteredDoctors.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setErrors({});
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex gap-4 items-center ${
                      selectedDoctor?.id === doc.id 
                        ? 'border-orange-500 bg-orange-50/30' 
                        : 'border-stone-200 hover:border-orange-200 hover:bg-stone-50'
                    }`}
                  >
                    <img 
                      src={doc.imageUrl} 
                      alt={doc.name} 
                      className="w-16 h-16 rounded-lg object-cover border border-stone-200"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-stone-900 text-sm truncate">{doc.name}</h4>
                      <p className="text-xs text-orange-600 font-medium truncate">{doc.title}</p>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">{doc.education}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded-md w-fit">
                        <Award className="w-3 h-3 text-orange-500" />
                        <span>{doc.availability.days.join(', ')}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Choose Date and Time */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto mb-6">
                <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">Step 3</span>
                <h3 className="text-xl font-bold text-stone-900 mt-1">Appointment Schedule</h3>
                <p className="text-stone-500 text-sm mt-1">Selected Doctor: <strong className="text-stone-800">{selectedDoctor?.name}</strong></p>
              </div>

              {errors.date && (
                <div className="p-2.5 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  {errors.date}
                </div>
              )}
              {errors.slot && (
                <div className="p-2.5 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  {errors.slot}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">1. Select Appointment Date</label>
                {availableDates.length === 0 ? (
                  <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    No matching dates in the next 14 days. This specialist might be away, or has a specific schedule.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" id="available-dates-grid">
                    {availableDates.map(({ dateStr, label, dayName }) => (
                      <button
                        type="button"
                        key={dateStr}
                        onClick={() => {
                          setSelectedDate(dateStr);
                          setSelectedSlot(''); // Reset slot when date changes
                          setErrors({});
                        }}
                        className={`p-2.5 rounded-lg border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                          selectedDate === dateStr 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-stone-200 hover:border-orange-200 hover:bg-stone-50'
                        }`}
                      >
                        <CalendarIcon className="w-4 h-4 text-orange-500 mb-0.5" />
                        <span className="text-xs font-bold text-stone-800">{label}</span>
                        <span className="text-[10px] text-stone-400 font-medium">{dayName}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedDate && (
                <div className="pt-2 animate-fade-in">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">2. Choose Available Time Slot</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="available-slots-grid">
                    {selectedDoctor?.availability.slots.map((slot) => (
                      <button
                        type="button"
                        key={slot}
                        onClick={() => {
                          setSelectedSlot(slot);
                          setErrors({});
                        }}
                        className={`p-3 rounded-lg border-2 text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                          selectedSlot === slot 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-stone-200 hover:border-orange-200 hover:bg-stone-50'
                        }`}
                      >
                        <Clock className={`w-4 h-4 ${selectedSlot === slot ? 'text-orange-500' : 'text-stone-400'}`} />
                        <span className="text-xs font-bold text-stone-800">{slot}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Patient Information Intake Form */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center max-w-md mx-auto mb-4">
                <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">Step 4</span>
                <h3 className="text-xl font-bold text-stone-900 mt-1">Patient Registration Form</h3>
                <p className="text-stone-500 text-sm mt-1">Please provide accurate personal information to register the appointment slot.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Patient Full Name*</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-stone-50 outline-none transition-all ${
                        errors.name ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-100' : 'border-stone-200 focus:border-orange-500 focus:bg-white'
                      }`}
                      required
                    />
                  </div>
                  {errors.name && <p className="text-red-500 text-[10px] mt-0.5">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Contact Mobile Number*</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      placeholder="+880 1847-XXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-stone-50 outline-none transition-all ${
                        errors.phone ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-100' : 'border-stone-200 focus:border-orange-500 focus:bg-white'
                      }`}
                      required
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-[10px] mt-0.5">{errors.phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Email Address*</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm bg-stone-50 outline-none transition-all ${
                        errors.email ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-100' : 'border-stone-200 focus:border-orange-500 focus:bg-white'
                      }`}
                      required
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Age*</label>
                    <input
                      type="number"
                      placeholder="28"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg text-sm bg-stone-50 outline-none transition-all ${
                        errors.age ? 'border-red-400 focus:border-red-500' : 'border-stone-200 focus:border-orange-500 focus:bg-white'
                      }`}
                      required
                    />
                    {errors.age && <p className="text-red-500 text-[10px] mt-0.5">{errors.age}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-2 py-2 border border-stone-200 bg-stone-50 rounded-lg text-sm outline-none focus:border-orange-500 focus:bg-white transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Symptoms or Treatment Desired</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 w-4 h-4 text-stone-400" />
                  <textarea
                    rows={2}
                    placeholder="Briefly state symptoms or aesthetic consultation desires (e.g. skin therapy consultation, laser assessment)"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-stone-200 rounded-lg text-sm bg-stone-50 outline-none focus:border-orange-500 focus:bg-white transition-all resize-none"
                  />
                </div>
              </div>
            </form>
          )}

          {/* Step 5: Success & Booking Confirmation Pass */}
          {step === 5 && createdBooking && (
            <div className="space-y-6 text-center py-4 print:p-0 animate-scale-up" id="booking-success-card">
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-2 border border-emerald-100">
                  <CheckCircle className="w-10 h-10 animate-bounce" />
                </div>
                <h3 className="text-2xl font-black text-stone-900 tracking-tight">Booking Confirmed!</h3>
                <p className="text-stone-500 text-sm max-w-md">Your signature clinical consultation slot is secured. A digital pass and details have been recorded below.</p>
              </div>

              {/* Printable clinical pass ticket */}
              <div className="max-w-md mx-auto bg-stone-50 border border-stone-200 rounded-2xl overflow-hidden shadow-inner print:border-none print:shadow-none">
                <div className="px-4 py-2.5 bg-gradient-to-r from-stone-800 to-stone-900 text-white text-xs font-mono tracking-wider flex justify-between items-center">
                  <span>MEDIX BOUTIQUE HEALTH PASS</span>
                  <span className="text-orange-400 font-bold">{createdBooking.id}</span>
                </div>
                
                <div className="p-5 space-y-4 text-left font-sans text-xs">
                  <div className="flex justify-between border-b border-stone-200/60 pb-2">
                    <div>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Patient Name</p>
                      <p className="font-bold text-stone-800 text-sm mt-0.5">{createdBooking.patientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Age & Gender</p>
                      <p className="font-semibold text-stone-700 mt-0.5">{createdBooking.age} yrs / {createdBooking.gender}</p>
                    </div>
                  </div>

                  <div className="space-y-2 border-b border-stone-200/60 pb-3">
                    <div>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Consultant Specialist</p>
                      <p className="font-extrabold text-stone-900 text-sm mt-0.5">{createdBooking.doctorName}</p>
                      <p className="text-orange-600 font-medium text-[10px]">{createdBooking.department}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Appointment Date</p>
                      <div className="flex items-center gap-1.5 mt-1 font-bold text-stone-800">
                        <CalendarIcon className="w-3.5 h-3.5 text-orange-500" />
                        <span>{new Date(createdBooking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Allocated Time Slot</p>
                      <div className="flex items-center gap-1.5 mt-1 font-bold text-stone-800">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        <span>{createdBooking.timeSlot}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dashed border-stone-200 mt-2 text-center text-[10px] text-stone-400 font-mono">
                    Please present this booking code at the reception desk 15 minutes before your slot.
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-center max-w-xs mx-auto print:hidden">
                <button
                  onClick={handlePrint}
                  className="flex-1 px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Print Slip
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Close Panel
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions for step process */}
        {step < 5 && (
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex justify-between items-center print:hidden">
            <div>
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
            </div>
            
            <div>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-lg transition-all cursor-pointer shadow-md shadow-orange-100 flex items-center gap-1"
                >
                  Confirm Appointment
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
