export interface Doctor {
  id: string;
  name: string;
  title: string;
  department: string;
  imageUrl: string;
  specialties: string[];
  education: string;
  availability: {
    days: string[];
    slots: string[];
  };
}

export interface Booking {
  id: string;
  doctorName: string;
  doctorId: string;
  department: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  date: string;
  timeSlot: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  symptoms?: string;
  age?: number;
  gender?: string;
  notes?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'Unread' | 'Read' | 'Replied';
  replyText?: string;
  createdAt: string;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
}
