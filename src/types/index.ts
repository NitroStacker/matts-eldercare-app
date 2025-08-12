export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: Date;
  assignedTo?: string;
  category: 'medication' | 'appointment' | 'personal-care' | 'household' | 'other';
  createdAt: Date;
  completedAt?: Date;
}

export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: number; // in minutes
  provider: string;
  location: string;
  type: 'doctor' | 'therapy' | 'social' | 'other';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Provider {
  id: string;
  name: string;
  type: 'doctor' | 'nurse' | 'therapist' | 'caregiver' | 'specialist';
  phone: string;
  email: string;
  address: string;
  specialties: string[];
  rating: number;
  isAvailable: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  preferences: {
    notifications: boolean;
    theme: 'light' | 'dark';
    language: string;
  };
}
