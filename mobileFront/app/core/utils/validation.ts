export const validateEmail = (email: string): { isValid: boolean; message: string } => {
  if (!email.trim()) {
    return { isValid: false, message: "Email is required" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address" };
  }
  
  return { isValid: true, message: "" };
};

export const validateUsername = (username: string): { isValid: boolean; message: string } => {
  if (!username.trim()) {
    return { isValid: false, message: "Username is required" };
  }
  
  if (username.length < 3) {
    return { isValid: false, message: "Username must be at least 3 characters long" };
  }
  
  if (username.length > 30) {
    return { isValid: false, message: "Username must be less than 30 characters" };
  }
  
  // Check for valid characters (alphanumeric, underscore, hyphen)
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: "Username can only contain letters, numbers, underscores, and hyphens" };
  }
  
  return { isValid: true, message: "" };
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long" };
  }
  
  if (password.length > 128) {
    return { isValid: false, message: "Password is too long" };
  }
  
  return { isValid: true, message: "" };
};

export const validatePasswordConfirmation = (password: string, confirmPassword: string): { isValid: boolean; message: string } => {
  if (!confirmPassword) {
    return { isValid: false, message: "Please confirm your password" };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, message: "Passwords do not match" };
  }
  
  return { isValid: true, message: "" };
};

export const validateSignupForm = (data: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  const usernameValidation = validateUsername(data.username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.message;
  }
  
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message;
  }
  
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message;
  }
  
  const confirmPasswordValidation = validatePasswordConfirmation(data.password, data.confirmPassword);
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.message;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateSigninForm = (data: {
  username: string;
  password: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!data.username.trim()) {
    errors.username = "Username or email is required";
  }
  
  if (!data.password) {
    errors.password = "Password is required";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Function to map backend errors to specific fields
export const mapBackendErrorToField = (errorMessage: string): { field: string; message: string } | null => {
  const lowerError = errorMessage.toLowerCase();
  
  if (lowerError.includes("username") && lowerError.includes("already exists")) {
    return { field: "username", message: "This username is already taken" };
  }
  
  if (lowerError.includes("email") && lowerError.includes("already exists")) {
    return { field: "email", message: "This email is already registered" };
  }
  
  if (lowerError.includes("password")) {
    return { field: "password", message: errorMessage };
  }
  
  return null;
};

// Function to get field-specific error message
export const getFieldError = (field: string, backendError: string, validationErrors: Record<string, string>): string => {
  // First check if there's a validation error for this field
  if (validationErrors[field]) {
    return validationErrors[field];
  }
  
  // Then check if the backend error is related to this field
  const fieldError = mapBackendErrorToField(backendError);
  if (fieldError && fieldError.field === field) {
    return fieldError.message;
  }
  
  return "";
}; 