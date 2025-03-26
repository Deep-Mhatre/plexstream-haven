
import { User } from '@/context/AuthContext';

// Simulated user database
const USERS_STORAGE_KEY = 'plexstream_users';
const CURRENT_USER_KEY = 'plexstream_current_user';
const USER_TOKEN_KEY = 'plexstream_auth_token';

// Helper to get users from localStorage
const getUsers = (): User[] => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

// Helper to save users to localStorage
const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

// Helper to save the current user to localStorage
const saveCurrentUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Generate a simple JWT token (simulated)
const generateToken = (user: User): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  const payload = {
    userId: user.id,
    email: user.email,
    exp: new Date().getTime() + 24 * 60 * 60 * 1000 // 24 hours
  };
  
  // In a real app, these would be properly signed
  const token = `${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}.signature`;
  localStorage.setItem(USER_TOKEN_KEY, token);
  return token;
};

// Validate token (simulated)
export const validateToken = (): boolean => {
  const token = localStorage.getItem(USER_TOKEN_KEY);
  if (!token) return false;
  
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    
    // Check if token is expired
    return payload.exp > new Date().getTime();
  } catch (error) {
    return false;
  }
};

// Register a new user
export const register = async (
  name: string,
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const users = getUsers();
  
  // Check if user already exists
  if (users.some(user => user.email === email)) {
    throw new Error('User already exists');
  }
  
  // Create new user
  const newUser: User = {
    id: `user_${Date.now()}`,
    name,
    email,
    subscription: {
      plan: 'basic',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days trial
    }
  };
  
  // Save user
  users.push(newUser);
  saveUsers(users);
  saveCurrentUser(newUser);
  
  // Generate token
  const token = generateToken(newUser);
  
  return { user: newUser, token };
};

// Login user
export const login = async (
  email: string,
  password: string
): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const users = getUsers();
  
  // Find user
  const user = users.find(user => user.email === email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // In a real app, we would validate the password
  // For demo purposes, we're just checking if the user exists
  
  saveCurrentUser(user);
  
  // Generate token
  const token = generateToken(user);
  
  return { user, token };
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem(USER_TOKEN_KEY);
};

// Update user subscription
export const updateSubscription = (
  userId: string,
  plan: 'basic' | 'standard' | 'premium'
): User => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  // Update user subscription
  users[userIndex].subscription = {
    plan,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  };
  
  saveUsers(users);
  saveCurrentUser(users[userIndex]);
  
  return users[userIndex];
};
