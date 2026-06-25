import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, ShieldAlert } from 'lucide-react';
import { ContactMessage } from '../types';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Appointment Inquiry',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your name';
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Please enter your phone number';
    if (!formData.message.trim()) newErrors.message = 'Please write a message';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newMessage: ContactMessage = {
      id: 'MSG-' + Math.floor(100000 + Math.random() * 900000),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      status: 'Unread',
      createdAt: new Date().toISOString()
    };

    // Save to local storage
    const existingMessagesStr = localStorage.getItem('medix_messages');
    const existingMessages: ContactMessage[] = existingMessagesStr ? JSON.parse(existingMessagesStr) : [];
    existingMessages.unshift(newMessage);
    localStorage.setItem('medix_messages', JSON.stringify(existingMessages));

    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: 'Appointment Inquiry',
      message: ''
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="w-full bg-stone-50 border border-stone-200/80 rounded-2xl shadow-sm p-6 sm:p-8" id="contact-form-card">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-stone-900 tracking-tight">Send Us a Message</h3>
        <p className="text-stone-500 text-xs mt-1">
          Have an inquiry about treatments or corporate packages? Fill out the form below and our staff will respond within 24 hours.
        </p>
      </div>

      {submitted ? (
        <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl text-center text-emerald-800 space-y-2 animate-scale-up" id="contact-success-msg">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto border border-emerald-200">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-sm text-stone-900">Message Received Successfully!</h4>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Thank you for contacting Medix Signature Clinic. A copy of your inquiry has been sent to our desk.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Your Name*</label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-xs bg-white outline-none transition-all ${
                  errors.name ? 'border-red-400 focus:border-red-500' : 'border-stone-200 focus:border-orange-500'
                }`}
              />
              {errors.name && <p className="text-red-500 text-[10px] mt-0.5">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Mobile Number*</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+880 1847-XXXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-xs bg-white outline-none transition-all ${
                    errors.phone ? 'border-red-400 focus:border-red-500' : 'border-stone-200 focus:border-orange-500'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-[10px] mt-0.5">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Email Address*</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-3.5 py-2.5 border rounded-lg text-xs bg-white outline-none transition-all ${
                  errors.email ? 'border-red-400 focus:border-red-500' : 'border-stone-200 focus:border-orange-500'
                }`}
              />
              {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">Subject</label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-3 py-2.5 border border-stone-200 bg-white rounded-lg text-xs outline-none focus:border-orange-500 transition-all cursor-pointer"
              >
                <option value="Appointment Inquiry">Appointment Inquiry</option>
                <option value="Aesthetic Consultations">Aesthetic / Laser</option>
                <option value="Home sample service">Home Sample</option>
                <option value="Feedback & Support">Feedback</option>
                <option value="Corporate Packages">Corporate Queries</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">How can we help you?*</label>
            <textarea
              rows={4}
              placeholder="State your medical condition or service questions here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`w-full px-3.5 py-2.5 border rounded-lg text-xs bg-white outline-none transition-all resize-none ${
                errors.message ? 'border-red-400 focus:border-red-500' : 'border-stone-200 focus:border-orange-500'
              }`}
            />
            {errors.message && <p className="text-red-500 text-[10px] mt-0.5">{errors.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            id="send-msg-btn"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Message</span>
          </button>
        </form>
      )}
    </div>
  );
}
