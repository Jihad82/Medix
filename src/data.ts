import { Doctor } from './types';

export const doctorsData: Doctor[] = [
  {
    id: 'dr-abul-kalam',
    name: 'Prof. Dr. Md. Abul Kalam',
    title: 'Senior Consultant',
    department: 'United KRS Aesthetic & Plastic Surgery Centre',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400&h=500',
    specialties: ['Aesthetic Surgery', 'Plastic & Reconstructive Surgery', 'Burns Management'],
    education: 'MBBS, FCPS (Surgery), MS (Plastic Surgery), FICS',
    availability: {
      days: ['Saturday', 'Monday', 'Wednesday'],
      slots: ['10:00 AM - 01:00 PM', '04:00 PM - 07:00 PM']
    }
  },
  {
    id: 'dr-rayhana-awwal',
    name: 'Prof. Dr. Rayhana Awwal',
    title: 'Senior Consultant',
    department: 'United KRS Aesthetic & Plastic Surgery Centre',
    imageUrl: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=400&h=500',
    specialties: ['Aesthetic Dermatology', 'Laser Therapy', 'Cosmetic Medicine'],
    education: 'MBBS, DDV, MD (Dermatology), Fellow Laser & Cutaneous Surgery (USA)',
    availability: {
      days: ['Sunday', 'Tuesday', 'Thursday'],
      slots: ['11:00 AM - 02:00 PM', '05:00 PM - 08:00 PM']
    }
  },
  {
    id: 'dr-sazzad-khondoker',
    name: 'Prof. Dr. Md. Sazzad Khondoker',
    title: 'Senior Consultant',
    department: 'Plastic, Aesthetic & Reconstructive Surgery',
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400&h=500',
    specialties: ['Reconstructive Microsurgery', 'Hand Surgery', 'Cleft Lip & Palate Repair'],
    education: 'MBBS, FCPS (Plastic Surgery), WHO Fellow (USA)',
    availability: {
      days: ['Saturday', 'Sunday', 'Tuesday', 'Thursday'],
      slots: ['02:00 PM - 05:00 PM', '06:00 PM - 08:00 PM']
    }
  },
  {
    id: 'dr-hossain-imam',
    name: 'Assoc. Prof. Hossain Imam',
    title: 'Consultant',
    department: 'United KRS Aesthetic & Plastic Surgery Centre',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=500',
    specialties: ['Aesthetic Rhinoplasty', 'Liposuction & Body Contouring', 'Hair Transplant'],
    education: 'MBBS, MS (Plastic Surgery), FACS (USA)',
    availability: {
      days: ['Monday', 'Wednesday', 'Thursday'],
      slots: ['09:00 AM - 12:00 PM', '03:00 PM - 06:00 PM']
    }
  }
];

export const facilitiesData = [
  '21 Modern OPD Consultation Rooms',
  '20-Bed Signature Clinic',
  'Cozy & Comfortable In-Patient Rooms',
  'State-of-the-Art Modular Operation Theatre',
  'United KRS Aesthetic & Plastic Surgery Centre',
  'Dialysis Unit',
  'Gastroenterology Centre',
  'Aesthetic Dermatology & Laser Centre',
  'Gynae, Obs & Infertility Centre',
  'Anesthesia, Critical Care & Pain Medicine',
  'Vaccination Services',
  '24/7 Emergency Care',
  '24/7 Ambulance Service',
  'Home Sample Collection',
  'Pharmacy'
];

export const testimonialsData = [
  {
    name: 'Saiful Hasan',
    role: 'Parent / Patient',
    content: 'Very well maintained facility for paediatric neurology. Clean environment and friendly employees are their specialty.',
    avatar: 'SH'
  },
  {
    name: 'Mohd. Morshed Choudhury',
    role: 'Regular Visitor',
    content: 'Nice neat hospital. Room for improvement in some procedural aspects which I believe will improve soon as they are under supervision of United Healthcare.',
    avatar: 'MC'
  },
  {
    name: 'M.A.R. Tanzil',
    role: 'OPD Patient',
    content: 'Staff support Medix could be your best option. I was able to get hassle free treatment. I would like to recommend Medix to everyone.',
    avatar: 'MT'
  },
  {
    name: 'Mrs. Nusrat Jahan',
    role: 'In-Patient',
    content: 'The room service, clean toilets, and attentive doctors make this truly feel like a boutique hospital, distinct from normal hospital chaos.',
    avatar: 'NJ'
  }
];

export const corporateClientsData = [
  { name: 'UCB', logoText: 'UCB', description: 'United Commercial Bank' },
  { name: 'EBL', logoText: 'EBL', description: 'Eastern Bank Ltd' },
  { name: 'BD Police', logoText: 'BD POLICE', description: 'Bangladesh Police' },
  { name: 'MasterCard', logoText: 'MasterCard', description: 'MasterCard Bangladesh' },
  { name: 'Guardian Life', logoText: 'GUARDIAN', description: 'Guardian Life Insurance' },
  { name: 'LankaBangla', logoText: 'LankaBangla', description: 'LankaBangla Finance' },
  { name: 'Navana Group', logoText: 'NAVANA', description: 'Navana Industrial Group' },
  { name: 'Pragati Life', logoText: 'PRAGATI', description: 'Pragati Life Insurance' }
];

export const faqsData = [
  {
    question: 'What makes Medix a "Boutique Hospital"?',
    answer: 'Unlike regular hospitals with massive crowds and long waiting times, Medix Signature Clinic offers a premium, exclusive environment with a limited daily volume of patients. This ensures personalized attention, highly coordinated care among specialists, and a calm, upscale hospital stay with hotel-like amenities.'
  },
  {
    question: 'How can I book an appointment?',
    answer: 'You can book an appointment online through our "Book Appointment" system, where you select your preferred department, consultant, date, and time slot. You can also call us directly at +8801847-413462.'
  },
  {
    question: 'Are you affiliated with United Healthcare?',
    answer: 'Yes, Medix Signature Clinic is a proud brand of United Healthcare (UHSL), bringing world-class clinical standards, modern diagnostic capabilities, and specialized aesthetic and medical treatments under one trusted name.'
  },
  {
    question: 'Do you offer home sample collection?',
    answer: 'Yes! We offer professional home sample collection services for a wide range of diagnostic tests. Our trained phlebotomists will visit your home ensuring the highest levels of safety and accuracy.'
  },
  {
    question: 'Do you provide 24/7 services?',
    answer: 'Yes, our Emergency Care, Ambulance Services, and in-house Pharmacy are fully functional and staffed 24 hours a day, 7 days a week to handle any urgent healthcare requirements.'
  }
];
