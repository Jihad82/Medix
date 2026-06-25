import React, { useState, useEffect } from 'react';
import { 
  Check, X, Search, ShieldCheck, Mail, Calendar, Users, 
  MessageSquare, FileEdit, ArrowRight, RotateCcw, ThumbsUp, Activity, BellRing
} from 'lucide-react';
import { Booking, ContactMessage, Doctor } from '../types';
import { doctorsData } from '../data';

// Initial seed data to populate local storage if empty
const seedDatabase = () => {
  const currentBookings = localStorage.getItem('medix_bookings');
  if (!currentBookings) {
    const mockBookings: Booking[] = [
      {
        id: 'MEDIX-748293',
        doctorId: 'dr-abul-kalam',
        doctorName: 'Prof. Dr. Md. Abul Kalam',
        department: 'United KRS Aesthetic & Plastic Surgery Centre',
        patientName: 'Saiful Hasan',
        patientPhone: '+8801712345678',
        patientEmail: 'saiful.hasan@gmail.com',
        date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
        timeSlot: '10:00 AM - 01:00 PM',
        status: 'Pending',
        symptoms: 'Paediatric neurology checkup assessment for skin/nerve laser mapping.',
        age: 8,
        gender: 'Male',
        createdAt: new Date().toISOString()
      },
      {
        id: 'MEDIX-194058',
        doctorId: 'dr-rayhana-awwal',
        doctorName: 'Prof. Dr. Rayhana Awwal',
        department: 'United KRS Aesthetic & Plastic Surgery Centre',
        patientName: 'Mrs. Nusrat Jahan',
        patientPhone: '+8801988776655',
        patientEmail: 'nusrat.jahan@yahoo.com',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
        timeSlot: '11:00 AM - 02:00 PM',
        status: 'Confirmed',
        symptoms: 'Laser therapy consultation for hyperpigmentation.',
        age: 34,
        gender: 'Female',
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: 'MEDIX-390291',
        doctorId: 'dr-sazzad-khondoker',
        doctorName: 'Prof. Dr. Md. Sazzad Khondoker',
        department: 'Plastic, Aesthetic & Reconstructive Surgery',
        patientName: 'Mohd. Morshed Choudhury',
        patientPhone: '+8801555444333',
        patientEmail: 'morshed.choudhury@outlook.com',
        date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
        timeSlot: '02:00 PM - 05:00 PM',
        status: 'Confirmed',
        symptoms: 'Followup consultation for plastic surgical scar assessment.',
        age: 45,
        gender: 'Male',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ];
    localStorage.setItem('medix_bookings', JSON.stringify(mockBookings));
  }

  const currentMessages = localStorage.getItem('medix_messages');
  if (!currentMessages) {
    const mockMessages: ContactMessage[] = [
      {
        id: 'MSG-829302',
        name: 'M.A.R. Tanzil',
        email: 'mar.tanzil@gmail.com',
        phone: '+8801811223344',
        subject: 'Aesthetic Consultations',
        message: 'Could you please let me know if Prof. Rayhana is available for acne laser treatments on Wednesday evenings? Thank you.',
        status: 'Unread',
        createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        id: 'MSG-392019',
        name: 'Farhana Ahmed',
        email: 'farhana.ahmed@live.com',
        phone: '+8801722334455',
        subject: 'Corporate Packages',
        message: 'We are a technology firm of 120 employees near Satmasjid road. We would like to inquire about corporate executive health packages at Medix.',
        status: 'Replied',
        replyText: 'Dear Farhana, thank you for reaching out. A corporate representative from UHSL is preparing a tailored proposal for your team and will call you tomorrow morning.',
        createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
      }
    ];
    localStorage.setItem('medix_messages', JSON.stringify(mockMessages));
  }
};

interface AdminPortalProps {
  onClose: () => void;
}

export default function AdminPortal({ onClose }: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'bookings' | 'messages' | 'analytics'>('bookings');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<string[]>([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingFilter, setBookingFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Cancelled'>('All');
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  useEffect(() => {
    seedDatabase();
    loadData();
  }, []);

  const loadData = () => {
    const bookingsStr = localStorage.getItem('medix_bookings') || '[]';
    const messagesStr = localStorage.getItem('medix_messages') || '[]';
    const subsStr = localStorage.getItem('medix_subscribers') || '[]';
    
    setBookings(JSON.parse(bookingsStr));
    setMessages(JSON.parse(messagesStr));
    
    const parsedSubs = JSON.parse(subsStr);
    const subEmails = parsedSubs.map((s: any) => s.email || s);
    setSubscribers(subEmails);
  };

  const updateBookingStatus = (id: string, status: 'Confirmed' | 'Cancelled') => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        return { ...b, status };
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem('medix_bookings', JSON.stringify(updated));
  };

  const handleSendReply = (messageId: string) => {
    if (!replyText.trim()) return;
    
    const updated = messages.map(m => {
      if (m.id === messageId) {
        return { ...m, status: 'Replied' as const, replyText };
      }
      return m;
    });
    setMessages(updated);
    localStorage.setItem('medix_messages', JSON.stringify(updated));
    setReplyText('');
    setActiveReplyId(null);
  };

  const resetAllDemoData = () => {
    if (confirm('Are you sure you want to restore default demo records? Your custom bookings will be replaced.')) {
      localStorage.removeItem('medix_bookings');
      localStorage.removeItem('medix_messages');
      seedDatabase();
      loadData();
    }
  };

  // Filter Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = bookingFilter === 'All' || b.status === bookingFilter;
    return matchesSearch && matchesFilter;
  });

  // Filter Messages
  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const unreadMessages = messages.filter(m => m.status === 'Unread').length;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/95 backdrop-blur-md overflow-hidden flex flex-col font-sans text-stone-100" id="admin-portal-overlay">
      
      {/* Top Banner */}
      <div className="px-6 py-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
              Medix Signature Staff Panel
              <span className="text-[10px] px-2 py-0.5 bg-orange-500/20 text-orange-400 font-bold tracking-widest rounded-full uppercase border border-orange-500/30">OPERATOR</span>
            </h2>
            <p className="text-xs text-stone-400">Manage real-time bookings, patient intake forms, and inquiries from United Healthcare UHSL portal.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 print:hidden">
          <button 
            onClick={resetAllDemoData}
            title="Reset to initial data"
            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-orange-600 text-stone-300 hover:text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
          >
            Exit Staff Portal
          </button>
        </div>
      </div>

      {/* KPI Stats widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-stone-950/60 border-b border-stone-800">
        <div className="p-4 bg-stone-900 rounded-xl border border-stone-800">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total Bookings</p>
          <p className="text-2xl font-black text-white mt-1">{bookings.length}</p>
          <p className="text-[10px] text-stone-500 mt-1">From internet portal</p>
        </div>
        <div className="p-4 bg-stone-900 rounded-xl border border-stone-800">
          <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pending Approvals</p>
          <p className="text-2xl font-black text-amber-500 mt-1 flex items-center gap-2">
            {pendingCount}
            {pendingCount > 0 && <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />}
          </p>
          <p className="text-[10px] text-stone-500 mt-1">Require screening</p>
        </div>
        <div className="p-4 bg-stone-900 rounded-xl border border-stone-800">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Confirmed Slots</p>
          <p className="text-2xl font-black text-emerald-500 mt-1">{confirmedCount}</p>
          <p className="text-[10px] text-stone-500 mt-1">Scheduled appointments</p>
        </div>
        <div className="p-4 bg-stone-900 rounded-xl border border-stone-800">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Unread Inquiries</p>
          <p className="text-2xl font-black text-blue-500 mt-1 flex items-center gap-2">
            {unreadMessages}
            {unreadMessages > 0 && <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />}
          </p>
          <p className="text-[10px] text-stone-500 mt-1">Pending response</p>
        </div>
      </div>

      {/* Main workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left menu navigation bar */}
        <div className="w-48 border-r border-stone-800 bg-stone-950 p-4 flex flex-col gap-1.5">
          <button 
            onClick={() => { setActiveTab('bookings'); setSearchQuery(''); }}
            className={`w-full p-2.5 rounded-lg text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'bookings' ? 'bg-orange-600 text-white' : 'hover:bg-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Consultations</span>
          </button>
          <button 
            onClick={() => { setActiveTab('messages'); setSearchQuery(''); }}
            className={`w-full p-2.5 rounded-lg text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'messages' ? 'bg-orange-600 text-white' : 'hover:bg-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Patient Inquiries</span>
            {unreadMessages > 0 && (
              <span className="ml-auto px-1.5 py-0.5 bg-amber-500 text-stone-950 text-[9px] font-black rounded-full leading-none">
                {unreadMessages}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full p-2.5 rounded-lg text-left text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics' ? 'bg-orange-600 text-white' : 'hover:bg-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Newsletter Subs</span>
          </button>
        </div>

        {/* Workspace details */}
        <div className="flex-1 flex flex-col bg-stone-900 overflow-hidden">
          
          {/* Filtering and search row */}
          {activeTab !== 'analytics' && (
            <div className="p-4 border-b border-stone-800 bg-stone-950/40 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  placeholder={activeTab === 'bookings' ? "Search patient or Booking ID..." : "Search messages..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 pl-9 pr-4 py-2 rounded-lg text-xs outline-none focus:border-stone-700 focus:bg-stone-950/50"
                />
              </div>

              {activeTab === 'bookings' && (
                <div className="flex gap-1.5 bg-stone-900/80 p-1 rounded-lg border border-stone-800">
                  {(['All', 'Pending', 'Confirmed', 'Cancelled'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setBookingFilter(f)}
                      className={`px-3 py-1 text-[10px] font-black rounded-md tracking-wider uppercase transition-all cursor-pointer ${
                        bookingFilter === f ? 'bg-stone-800 text-white shadow-sm' : 'text-stone-500 hover:text-stone-300'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab contents */}
          <div className="flex-1 overflow-y-auto p-6">
            
            {/* 1. BOOKINGS LISTING */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                  <div className="p-12 text-center text-stone-500 max-w-sm mx-auto">
                    <Calendar className="w-12 h-12 text-stone-700 mx-auto mb-3" />
                    <h4 className="font-bold text-white text-sm">No matching bookings found</h4>
                    <p className="text-xs mt-1">Please try clearing your search query or adjusting your filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredBookings.map((b) => (
                      <div 
                        key={b.id} 
                        className="p-5 bg-stone-950 rounded-xl border border-stone-800 shadow-sm flex flex-col justify-between"
                      >
                        <div>
                          {/* Booking Badge & status */}
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className="font-mono text-xs font-bold text-orange-500">{b.id}</span>
                              <p className="text-[10px] text-stone-500 mt-0.5">Created on {new Date(b.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-2.5 py-0.5 text-[9px] font-bold rounded-full tracking-wider uppercase border ${
                              b.status === 'Confirmed' 
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                                : b.status === 'Pending'
                                ? 'bg-amber-500/15 text-amber-400 border-amber-500/25'
                                : 'bg-red-500/15 text-red-400 border-red-500/25'
                            }`}>
                              {b.status}
                            </span>
                          </div>

                          {/* Patient profile */}
                          <div className="border-t border-b border-stone-900 py-3 mb-3 space-y-1.5 text-xs text-stone-300">
                            <div className="flex justify-between font-bold text-white">
                              <span>Patient: {b.patientName}</span>
                              <span className="text-stone-400 text-[11px] font-normal">{b.age} yrs / {b.gender}</span>
                            </div>
                            <p className="text-stone-400 text-[11px]">Contact: <strong className="text-stone-300">{b.phone}</strong> | Email: <strong className="text-stone-300">{b.patientEmail}</strong></p>
                            {b.symptoms && (
                              <p className="bg-stone-900/50 p-2 rounded text-[11px] text-stone-400 leading-normal border-l-2 border-stone-700">
                                <span className="font-bold text-stone-300 text-[10px] uppercase block mb-0.5">Reason for visit:</span>
                                {b.symptoms}
                              </p>
                            )}
                          </div>

                          {/* Doctor allocation */}
                          <div className="text-xs space-y-1 text-stone-400">
                            <p>Consultant: <strong className="text-stone-200">{b.doctorName}</strong></p>
                            <p className="text-[10px] text-orange-500/80">{b.department}</p>
                            <div className="mt-2 p-2 bg-stone-900 rounded flex items-center justify-between text-stone-300">
                              <span className="flex items-center gap-1 font-bold"><Calendar className="w-3.5 h-3.5 text-orange-500" /> {b.date}</span>
                              <span className="flex items-center gap-1 font-semibold"><Activity className="w-3.5 h-3.5 text-orange-500" /> {b.timeSlot}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions for operator */}
                        {b.status === 'Pending' && (
                          <div className="mt-4 pt-3 border-t border-stone-900 flex gap-2">
                            <button
                              onClick={() => updateBookingStatus(b.id, 'Confirmed')}
                              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve Consultation
                            </button>
                            <button
                              onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                              className="px-3 py-1.5 border border-stone-800 hover:bg-red-950 hover:border-red-500/40 text-stone-400 hover:text-red-400 font-medium text-[11px] rounded-lg transition-all cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        )}

                        {b.status === 'Confirmed' && (
                          <div className="mt-4 pt-3 border-t border-stone-900 flex justify-end">
                            <button
                              onClick={() => updateBookingStatus(b.id, 'Cancelled')}
                              className="py-1.5 px-3 border border-stone-800 hover:bg-stone-800 text-stone-400 hover:text-stone-200 font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer"
                            >
                              Cancel Appointment
                            </button>
                          </div>
                        )}

                        {b.status === 'Cancelled' && (
                          <div className="mt-4 pt-3 border-t border-stone-900 flex justify-end text-[10px] text-stone-500 font-semibold italic">
                            Cancelled clinical slot.
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. MESSAGES LISTING */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                {filteredMessages.length === 0 ? (
                  <div className="p-12 text-center text-stone-500 max-w-sm mx-auto">
                    <MessageSquare className="w-12 h-12 text-stone-700 mx-auto mb-3" />
                    <h4 className="font-bold text-white text-sm">No incoming inquiries</h4>
                    <p className="text-xs mt-1">Patients will trigger requests via the public contact forms.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMessages.map((msg) => (
                      <div 
                        key={msg.id}
                        className="p-5 bg-stone-950 rounded-xl border border-stone-800 shadow-sm space-y-4"
                      >
                        {/* Header details */}
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] bg-stone-900 border border-stone-800 px-2 py-0.5 rounded text-stone-400 font-mono">{msg.id}</span>
                            <h4 className="font-bold text-white mt-1.5 text-sm">{msg.name}</h4>
                            <p className="text-[11px] text-stone-400">Email: {msg.email} | Contact: {msg.phone}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-stone-500">{new Date(msg.createdAt).toLocaleString()}</span>
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                              msg.status === 'Unread' 
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/25 animate-pulse'
                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                            }`}>
                              {msg.status}
                            </span>
                          </div>
                        </div>

                        {/* Subject & content message body */}
                        <div className="bg-stone-900/60 p-3 rounded-lg border border-stone-800/50">
                          <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider mb-1">Subject: {msg.subject}</p>
                          <p className="text-xs text-stone-300 leading-relaxed font-sans">{msg.message}</p>
                        </div>

                        {/* Display reply if exists */}
                        {msg.status === 'Replied' && msg.replyText && (
                          <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg space-y-1">
                            <p className="text-[10px] text-emerald-400 font-black flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" /> STAFF RESPONSE SENT:
                            </p>
                            <p className="text-xs text-stone-400 italic font-sans">"{msg.replyText}"</p>
                          </div>
                        )}

                        {/* Trigger replying */}
                        {msg.status === 'Unread' && activeReplyId !== msg.id && (
                          <button
                            onClick={() => {
                              setActiveReplyId(msg.id);
                              setReplyText('');
                            }}
                            className="px-3.5 py-1.5 bg-stone-800 hover:bg-orange-600 hover:text-white text-stone-300 font-bold text-[11px] rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <FileEdit className="w-3.5 h-3.5" /> Compose Reply
                          </button>
                        )}

                        {/* Replying form */}
                        {activeReplyId === msg.id && (
                          <div className="p-4 bg-stone-900 rounded-lg border border-stone-800 space-y-3 animate-fade-in">
                            <label className="block text-[10px] font-bold text-orange-400 uppercase tracking-widest">Type Staff Reply Email</label>
                            <textarea
                              rows={3}
                              placeholder="Type a clinical reply or answer to patient's inquiries..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="w-full bg-stone-950 border border-stone-800 p-2.5 rounded-lg text-xs outline-none focus:border-stone-700 resize-none text-stone-200"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => setActiveReplyId(null)}
                                className="px-3 py-1.5 text-stone-400 hover:text-stone-200 text-xs font-semibold cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSendReply(msg.id)}
                                className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg transition-all cursor-pointer"
                              >
                                Send Response Email
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. NEWSLETTER SUBSCRIBERS */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-stone-950 p-5 rounded-xl border border-stone-800">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider mb-3">Newsletter Subscribers</h3>
                  <p className="text-xs text-stone-500 mb-4">Users who filled out the footer subscription form. These users receive regular clinical news, event announcements, and health package promotions.</p>
                  
                  {subscribers.length === 0 ? (
                    <p className="text-xs text-stone-500 italic p-6 text-center border border-dashed border-stone-800 rounded-lg">
                      No email subscribers registered yet. Try submitting an email in the website footer!
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2" id="subscribers-list">
                      {subscribers.map((email, idx) => (
                        <div 
                          key={idx}
                          className="p-3 bg-stone-900 border border-stone-800 rounded-lg flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-stone-300 select-all">{email}</span>
                          <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded leading-none">Active</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 space-y-2">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">Boutique Clinic Standards</h4>
                    <ul className="text-xs text-stone-400 space-y-1.5 list-disc pl-4 leading-normal">
                      <li>Maintain clean lobby lounges at all times.</li>
                      <li>Consultation duration average: 25 minutes per patient.</li>
                      <li>Coordinate diagnostic updates directly via UHSL main server.</li>
                      <li>Contact inquiries must receive a digital answer within 12 business hours.</li>
                    </ul>
                  </div>

                  <div className="bg-stone-950 p-5 rounded-xl border border-stone-800 flex flex-col justify-center text-center p-6 space-y-3">
                    <BellRing className="w-8 h-8 text-orange-500 mx-auto animate-swing" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Daily Clinic Ingress Checklist</h4>
                      <p className="text-xs text-stone-500 mt-1">Ready to start receptionist shifts? All incoming bookings from website will stream live into this console.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
