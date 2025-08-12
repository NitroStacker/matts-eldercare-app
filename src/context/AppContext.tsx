import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Task, Appointment, User } from '../types';
import apiService, { User as ApiUser, Task as ApiTask, Appointment as ApiAppointment } from '../services/api';

interface AppContextType {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  showWelcome: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<boolean>;
  completeWelcome: () => void;
  
  // Tasks state
  tasks: Task[];
  addTask: (taskData: Omit<Task, 'id' | 'createdAt'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskStatus: (taskId: string) => Promise<void>;
  
  // Appointments state
  appointments: Appointment[];
  addAppointment: (appointmentData: Omit<Appointment, 'id'>) => Promise<void>;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (appointmentId: string) => Promise<void>;
  
  // Stats
  getTodayTasks: () => Task[];
  getUpcomingAppointments: () => Appointment[];
  getCompletedToday: () => Task[];
  getPendingTasks: () => Task[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = user !== null;

  // Check for existing authentication on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (apiService.isAuthenticated()) {
          const { user: profile } = await apiService.getProfile();
          setUser(convertApiUserToUser(profile));
          
          // Load user data
          const { tasks: userTasks } = await apiService.getTasks();
          const { appointments: userAppointments } = await apiService.getAppointments();
          
          setTasks(userTasks.map(convertApiTaskToTask));
          setAppointments(userAppointments.map(convertApiAppointmentToAppointment));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // If there's an error, clear the token
        await apiService.logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Helper functions to convert API types to app types
  const convertApiUserToUser = (apiUser: ApiUser): User => ({
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    phone: apiUser.phone,
    emergencyContact: apiUser.emergencyContact,
    preferences: apiUser.preferences,
  });

  const convertApiTaskToTask = (apiTask: ApiTask): Task => ({
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description,
    priority: apiTask.priority,
    status: apiTask.status,
    dueDate: new Date(apiTask.dueDate),
    category: apiTask.category,
    createdAt: new Date(apiTask.createdAt),
    completedAt: apiTask.completedAt ? new Date(apiTask.completedAt) : undefined,
  });

  const convertApiAppointmentToAppointment = (apiAppointment: ApiAppointment): Appointment => ({
    id: apiAppointment.id,
    title: apiAppointment.title,
    description: apiAppointment.description,
    date: new Date(apiAppointment.date),
    duration: apiAppointment.duration,
    provider: apiAppointment.provider,
    location: apiAppointment.location,
    type: apiAppointment.type,
    status: apiAppointment.status,
    notes: apiAppointment.notes,
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login({ email, password });
      setUser(convertApiUserToUser(response.user));
      setShowWelcome(true);
      
      // Load user data
      const { tasks: userTasks } = await apiService.getTasks();
      const { appointments: userAppointments } = await apiService.getAppointments();
      
      setTasks(userTasks.map(convertApiTaskToTask));
      setAppointments(userAppointments.map(convertApiAppointmentToAppointment));
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setShowWelcome(false);
      setTasks([]);
      setAppointments([]);
    }
  };

  const completeWelcome = () => {
    setShowWelcome(false);
  };

  const signup = async (userData: { name: string; email: string; password: string; phone?: string }): Promise<boolean> => {
    try {
      const response = await apiService.signup(userData);
      setUser(convertApiUserToUser(response.user));
      setShowWelcome(true);
      
      // Initialize empty user data
      setTasks([]);
      setAppointments([]);
      
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const apiTaskData = {
        ...taskData,
        dueDate: taskData.dueDate.toISOString(),
      };
      
      const { task: newApiTask } = await apiService.createTask(apiTaskData);
      const newTask = convertApiTaskToTask(newApiTask);
      setTasks(prev => [newTask, ...prev]);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const apiUpdates = {
        ...updates,
        dueDate: updates.dueDate ? updates.dueDate.toISOString() : undefined,
        completedAt: updates.completedAt ? updates.completedAt.toISOString() : undefined,
      };
      
      const { task: updatedApiTask } = await apiService.updateTask(taskId, apiUpdates);
      const updatedTask = convertApiTaskToTask(updatedApiTask);
      
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await apiService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const toggleTaskStatus = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const newCompletedAt = newStatus === 'completed' ? new Date() : undefined;

      await updateTask(taskId, {
        status: newStatus,
        completedAt: newCompletedAt,
      });
    } catch (error) {
      console.error('Error toggling task status:', error);
      throw error;
    }
  };

  const addAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
    try {
      const apiAppointmentData = {
        ...appointmentData,
        date: appointmentData.date.toISOString(),
      };
      
      const { appointment: newApiAppointment } = await apiService.createAppointment(apiAppointmentData);
      const newAppointment = convertApiAppointmentToAppointment(newApiAppointment);
      setAppointments(prev => [newAppointment, ...prev]);
    } catch (error) {
      console.error('Error adding appointment:', error);
      throw error;
    }
  };

  const updateAppointment = async (appointmentId: string, updates: Partial<Appointment>) => {
    try {
      const apiUpdates = {
        ...updates,
        date: updates.date ? updates.date.toISOString() : undefined,
      };
      
      const { appointment: updatedApiAppointment } = await apiService.updateAppointment(appointmentId, apiUpdates);
      const updatedAppointment = convertApiAppointmentToAppointment(updatedApiAppointment);
      
      setAppointments(prev => prev.map(appointment => 
        appointment.id === appointmentId ? updatedAppointment : appointment
      ));
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    try {
      await apiService.deleteAppointment(appointmentId);
      setAppointments(prev => prev.filter(appointment => appointment.id !== appointmentId));
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  };

  const getTodayTasks = (): Task[] => {
    const today = new Date();
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === today.toDateString();
    });
  };

  const getUpcomingAppointments = (): Appointment[] => {
    const now = new Date();
    return appointments.filter(appointment => appointment.date > now);
  };

  const getCompletedToday = (): Task[] => {
    const today = new Date();
    return tasks.filter(task => {
      if (task.status !== 'completed' || !task.completedAt) return false;
      const completedDate = new Date(task.completedAt);
      return completedDate.toDateString() === today.toDateString();
    });
  };

  const getPendingTasks = (): Task[] => {
    return tasks.filter(task => task.status === 'pending' || task.status === 'in-progress');
  };

  const value: AppContextType = {
    user,
    isAuthenticated,
    showWelcome,
    loading,
    login,
    logout,
    signup,
    completeWelcome,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getTodayTasks,
    getUpcomingAppointments,
    getCompletedToday,
    getPendingTasks,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
