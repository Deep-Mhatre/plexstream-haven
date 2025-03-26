
interface User {
  id: string;
  email: string;
  name: string;
  subscription?: {
    plan: 'basic' | 'standard' | 'premium';
    validUntil: Date;
  };
}

interface AuthResponse {
  user: User;
  token: string;
}

// In a real app, these functions would communicate with a backend API
// For now, we'll simulate the behavior with localStorage

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // This is where we would normally call the backend API
  // For demo purposes, we'll use a simple validation
  if (email === 'demo@example.com' && password === 'password') {
    const user: User = {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      subscription: {
        plan: 'standard',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    };
    
    const token = 'demo-jwt-token';
    return { user, token };
  }
  
  // Check if this user exists in our "database" (localStorage)
  const usersStr = localStorage.getItem('users');
  if (usersStr) {
    const users = JSON.parse(usersStr);
    const user = users.find((u: User & { password: string }) => 
      u.email === email && u.password === password
    );
    
    if (user) {
      // Don't include password in the returned user object
      const { password: _, ...userWithoutPassword } = user;
      const token = `jwt-token-${Math.random().toString(36).substr(2, 9)}`;
      return { user: userWithoutPassword, token };
    }
  }
  
  throw new Error('Invalid email or password');
};

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Validate inputs
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }
  
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  // Check if email already exists
  const usersStr = localStorage.getItem('users');
  let users = [];
  
  if (usersStr) {
    users = JSON.parse(usersStr);
    if (users.some((u: User) => u.email === email)) {
      throw new Error('Email already exists');
    }
  }
  
  // Create new user
  const newUser = {
    id: `user-${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    password, // In a real app, this would be hashed
    subscription: {
      plan: 'basic',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days free trial
    },
  };
  
  // Save user to our "database"
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Return user without password and with token
  const { password: _, ...userWithoutPassword } = newUser;
  const token = `jwt-token-${Math.random().toString(36).substr(2, 9)}`;
  
  return { user: userWithoutPassword, token };
};

export const logout = (): void => {
  // Here we would typically invalidate the token on the server
  // For now, we'll just simulate the behavior
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
