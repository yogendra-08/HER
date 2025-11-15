/**
 * LocalStorage-based Authentication Utility
 * Temporary browser-based storage for user login and signup data
 */

export interface LocalUser {
  id: string;
  name: string;
  email: string;
  password: string; // Stored in plain text for temporary storage (not secure, but for practical purposes)
  phone?: string;
  address?: string;
  createdAt: string;
}

const STORAGE_KEY_USERS = 'vastraverse_users';
const STORAGE_KEY_CURRENT_USER = 'vastraverse_current_user';
const STORAGE_KEY_TOKEN = 'vastraverse_token';

/**
 * Get all registered users from localStorage
 */
export const getStoredUsers = (): LocalUser[] => {
  try {
    const usersJson = localStorage.getItem(STORAGE_KEY_USERS);
    if (!usersJson) return [];
    return JSON.parse(usersJson);
  } catch (error) {
    console.error('Error reading users from localStorage:', error);
    return [];
  }
};

/**
 * Save a new user to localStorage
 */
export const saveUser = (user: LocalUser): void => {
  try {
    const users = getStoredUsers();
    // Check if user with this email already exists
    const existingUser = users.find(u => u.email === user.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    users.push(user);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
    throw error;
  }
};

/**
 * Find a user by email
 */
export const findUserByEmail = (email: string): LocalUser | null => {
  const users = getStoredUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
};

/**
 * Verify user credentials
 */
export const verifyCredentials = (email: string, password: string): LocalUser | null => {
  const user = findUserByEmail(email);
  if (!user) return null;
  if (user.password !== password) return null;
  return user;
};

/**
 * Set current user session
 */
export const setCurrentUser = (user: LocalUser): void => {
  try {
    // Remove password from stored user object for security
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(userWithoutPassword));
    // Generate a simple token (in production, this would be a JWT from the server)
    const token = `local_token_${Date.now()}_${user.id}`;
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
  } catch (error) {
    console.error('Error setting current user:', error);
    throw error;
  }
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): Omit<LocalUser, 'password'> | null => {
  try {
    const userJson = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (!userJson) return null;
    return JSON.parse(userJson);
  } catch (error) {
    console.error('Error reading current user from localStorage:', error);
    return null;
  }
};

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEY_TOKEN);
};

/**
 * Clear current user session
 */
export const clearCurrentUser = (): void => {
  localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  localStorage.removeItem(STORAGE_KEY_TOKEN);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken() && !!getCurrentUser();
};

/**
 * Register a new user
 */
export const registerUser = (userData: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}): { user: Omit<LocalUser, 'password'>; token: string } => {
  // Check if user already exists
  if (findUserByEmail(userData.email)) {
    throw new Error('User with this email already exists');
  }

  // Create new user
  const newUser: LocalUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: userData.name,
    email: userData.email,
    password: userData.password, // In production, this would be hashed
    phone: userData.phone,
    address: userData.address,
    createdAt: new Date().toISOString(),
  };

  // Save user
  saveUser(newUser);

  // Set as current user
  setCurrentUser(newUser);

  const currentUser = getCurrentUser();
  const token = getAuthToken();

  if (!currentUser || !token) {
    throw new Error('Failed to create user session');
  }

  return {
    user: currentUser,
    token,
  };
};

/**
 * Login user
 */
export const loginUser = (email: string, password: string): { user: Omit<LocalUser, 'password'>; token: string } => {
  const user = verifyCredentials(email, password);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Set as current user
  setCurrentUser(user);

  const currentUser = getCurrentUser();
  const token = getAuthToken();

  if (!currentUser || !token) {
    throw new Error('Failed to create user session');
  }

  return {
    user: currentUser,
    token,
  };
};

/**
 * Logout user
 */
export const logoutUser = (): void => {
  clearCurrentUser();
};

