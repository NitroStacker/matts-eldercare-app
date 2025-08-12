const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (replace with real database in production)
const users = new Map();
const userData = new Map(); // Store user-specific data (tasks, appointments, etc.)

// Email transporter (only if email credentials are provided)
let transporter = null;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// Helper function to send welcome email
const sendWelcomeEmail = async (email, name) => {
  if (!transporter) {
    console.log('Email not configured - skipping welcome email for:', email);
    return;
  }
  
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Matt\'s Eldercare App!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007AFF;">Welcome to Matt's Eldercare App!</h2>
          <p>Hello ${name},</p>
          <p>Thank you for signing up for Matt's Eldercare App! We're excited to help you manage your eldercare responsibilities more effectively.</p>
          <p>With our app, you can:</p>
          <ul>
            <li>Create and manage care tasks</li>
            <li>Schedule appointments and reminders</li>
            <li>Track medication schedules</li>
            <li>Manage emergency contacts</li>
            <li>Monitor daily activities</li>
          </ul>
          <p>Your account has been successfully created and you can now start using all the features of our app.</p>
          <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
          <p>Best regards,<br>The Matt's Eldercare Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret', {
    expiresIn: '7d',
  });
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    if (users.has(email)) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = uuidv4();
    const user = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
      },
      preferences: {
        notifications: true,
        theme: 'light',
        language: 'en',
      },
      createdAt: new Date(),
    };

    // Store user
    users.set(email, user);

    // Initialize user data
    userData.set(userId, {
      tasks: [],
      appointments: [],
    });

    // Send welcome email
    await sendWelcomeEmail(email, name);

    // Generate token
    const token = generateToken(userId);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      user: userWithoutPassword,
      token,
      message: 'User created successfully. Welcome email sent!',
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const user = Array.from(users.values()).find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const user = Array.from(users.values()).find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { name, phone, emergencyContact, preferences } = req.body;

    // Update user data
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (emergencyContact) user.emergencyContact = { ...user.emergencyContact, ...emergencyContact };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    // Update in storage
    users.set(user.email, user);

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User data endpoints (tasks, appointments)
app.get('/api/user/tasks', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const data = userData.get(userId) || { tasks: [] };
    res.json({ tasks: data.tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/user/tasks', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const taskData = req.body;
    
    const newTask = {
      id: uuidv4(),
      ...taskData,
      createdAt: new Date(),
    };

    const data = userData.get(userId) || { tasks: [], appointments: [] };
    data.tasks.push(newTask);
    userData.set(userId, data);

    res.status(201).json({ task: newTask });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/user/tasks/:taskId', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { taskId } = req.params;
    const updates = req.body;

    const data = userData.get(userId);
    if (!data) {
      return res.status(404).json({ error: 'User data not found' });
    }

    const taskIndex = data.tasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }

    data.tasks[taskIndex] = { ...data.tasks[taskIndex], ...updates };
    userData.set(userId, data);

    res.json({ task: data.tasks[taskIndex] });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/user/tasks/:taskId', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { taskId } = req.params;

    const data = userData.get(userId);
    if (!data) {
      return res.status(404).json({ error: 'User data not found' });
    }

    data.tasks = data.tasks.filter(task => task.id !== taskId);
    userData.set(userId, data);

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Appointments endpoints
app.get('/api/user/appointments', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const data = userData.get(userId) || { appointments: [] };
    res.json({ appointments: data.appointments });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/user/appointments', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const appointmentData = req.body;
    
    const newAppointment = {
      id: uuidv4(),
      ...appointmentData,
      date: new Date(appointmentData.date),
    };

    const data = userData.get(userId) || { tasks: [], appointments: [] };
    data.appointments.push(newAppointment);
    userData.set(userId, data);

    res.status(201).json({ appointment: newAppointment });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/user/appointments/:appointmentId', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { appointmentId } = req.params;
    const updates = req.body;

    const data = userData.get(userId);
    if (!data) {
      return res.status(404).json({ error: 'User data not found' });
    }

    const appointmentIndex = data.appointments.findIndex(app => app.id === appointmentId);
    if (appointmentIndex === -1) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    data.appointments[appointmentIndex] = { 
      ...data.appointments[appointmentIndex], 
      ...updates,
      date: updates.date ? new Date(updates.date) : data.appointments[appointmentIndex].date,
    };
    userData.set(userId, data);

    res.json({ appointment: data.appointments[appointmentIndex] });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/user/appointments/:appointmentId', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;
    const { appointmentId } = req.params;

    const data = userData.get(userId);
    if (!data) {
      return res.status(404).json({ error: 'User data not found' });
    }

    data.appointments = data.appointments.filter(app => app.id !== appointmentId);
    userData.set(userId, data);

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Eldercare backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Eldercare backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
