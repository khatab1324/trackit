export interface BackendError {
  error?: string;
  message?: string;
  statusCode?: number;
}

export interface RTKQueryError {
  status: number;
  data: {
    error?: string;
    message?: string;
    validation?: {
      body?: Array<{ message: string }>;
    };
  };
  error: string;
}

export const parseAuthError = (error: any): string => {
  console.log('🔍 Parsing error:', JSON.stringify(error, null, 2));
  
  // Handle RTK Query errors
  if (error && typeof error === 'object') {
    // Check if it's an RTK Query error with status
    if ('status' in error && typeof error.status === 'number') {
      const rtkError = error as RTKQueryError;
      console.log(`📡 RTK Query error with status ${rtkError.status}:`, rtkError.data);
      
      // Handle different HTTP status codes
      switch (rtkError.status) {
        case 400:
          // Validation errors or bad request
          if (rtkError.data && typeof rtkError.data === 'object') {
            const message = rtkError.data.error || rtkError.data.message || "Invalid input data";
            console.log('🚫 400 Error parsed:', message);
            return message;
          }
          console.log('🚫 400 Error - no data, using fallback');
          return "Invalid input data. Please check your information.";
          
        case 401:
          if (rtkError.data && typeof rtkError.data === 'object') {
            const message = rtkError.data.error || rtkError.data.message || "Authentication failed. Please check your credentials.";
            console.log('🔐 401 Error parsed:', message);
            return message;
          }
          console.log('🔐 401 Error - no data, using fallback');
          return "Authentication failed. Please check your credentials.";
          
        case 404:
          if (rtkError.data && typeof rtkError.data === 'object') {
            const message = rtkError.data.error || rtkError.data.message || "User not found. Please check your username.";
            console.log('❌ 404 Error parsed:', message);
            return message;
          }
          console.log('❌ 404 Error - no data, using fallback');
          return "User not found. Please check your username.";
          
        case 409:
          if (rtkError.data && typeof rtkError.data === 'object') {
            const message = rtkError.data.error || rtkError.data.message || "Username or email already exists.";
            console.log('⚠️ 409 Error parsed:', message);
            return message;
          }
          console.log('⚠️ 409 Error - no data, using fallback');
          return "Username or email already exists.";
          
        case 422:
          // Validation errors from Zod
          if (rtkError.data && typeof rtkError.data === 'object') {
            if (rtkError.data.validation) {
              const validationErrors = rtkError.data.validation;
              if (validationErrors.body) {
                const bodyErrors = validationErrors.body;
                if (bodyErrors.length > 0) {
                  const message = bodyErrors[0].message || "Validation error";
                  console.log('📝 422 Validation Error parsed:', message);
                  return message;
                }
              }
            }
            const message = rtkError.data.error || rtkError.data.message || "Validation error";
            console.log('📝 422 Error parsed:', message);
            return message;
          }
          console.log('📝 422 Error - no data, using fallback');
          return "Validation error. Please check your input.";
          
        case 500:
          // Backend errors - try to parse the error message
          if (rtkError.data && typeof rtkError.data === 'object') {
            const errorMessage = rtkError.data.error || rtkError.data.message;
            
            // Parse specific backend error messages
            if (errorMessage) {
              if (errorMessage.includes("user is exist")) {
                console.log('💥 500 Error - user exists detected');
                return "Username or email already exists.";
              }
              if (errorMessage.includes("user is not exist")) {
                console.log('💥 500 Error - user not found detected');
                return "User not found. Please check your username.";
              }
              if (errorMessage.includes("Invalid password")) {
                console.log('💥 500 Error - invalid password detected');
                return "Invalid password. Please try again.";
              }
              if (errorMessage.includes("An error occurred while creating the user")) {
                console.log('💥 500 Error - user creation failed');
                return "Account creation failed. Please try again.";
              }
              if (errorMessage.includes("An error occurred while signing in")) {
                console.log('💥 500 Error - sign in failed');
                return "Sign in failed. Please try again.";
              }
              
              // Return the parsed error message
              console.log('💥 500 Error parsed:', errorMessage);
              return errorMessage;
            }
          }
          console.log('💥 500 Error - no data, using fallback');
          return "Server error. Please try again later.";
          
        default:
          console.log(`❓ Unknown status code ${rtkError.status}, using fallback`);
          return "An unexpected error occurred. Please try again.";
      }
    }
    
    // Handle network errors
    if (error.message && error.message.includes('fetch')) {
      if (error.message.includes('Failed to fetch')) {
        console.log('🌐 Network error - failed to fetch');
        return "Network error. Please check your internet connection.";
      }
      if (error.message.includes('timeout')) {
        console.log('⏰ Network error - timeout');
        return "Request timeout. Please try again.";
      }
    }
    
    // Handle other error types
    if (error.message) {
      console.log('📝 Error with message:', error.message);
      return error.message;
    }
    
    if (error.error) {
      console.log('📝 Error with error property:', error.error);
      return error.error;
    }
  }
  
  // Fallback error message
  console.log('❓ Unknown error type, using fallback');
  return "An unexpected error occurred. Please try again.";
};

export const getFieldSpecificError = (field: string, error: string): string => {
  // Provide field-specific error messages
  switch (field) {
    case 'username':
      if (error.includes("already exists") || error.includes("Username already exists")) {
        return "This username is already taken. Please choose another one.";
      }
      if (error.includes("not found")) {
        return "Username not found. Please check your username.";
      }
      break;
      
    case 'email':
      if (error.includes("already exists") || error.includes("Email already exists")) {
        return "This email is already registered. Please use a different email.";
      }
      if (error.includes("invalid")) {
        return "Please enter a valid email address.";
      }
      break;
      
    case 'password':
      if (error.includes("Invalid password")) {
        return "Incorrect password. Please try again.";
      }
      if (error.includes("too short")) {
        return "Password must be at least 6 characters long.";
      }
      break;
  }
  
  return error;
};

export const isNetworkError = (error: any): boolean => {
  if (!error || typeof error !== 'object') return false;
  
  // Check for network-related error messages
  if (error.message) {
    const message = error.message.toLowerCase();
    return message.includes('fetch') || 
           message.includes('network') || 
           message.includes('timeout') ||
           message.includes('connection');
  }
  
  // Check for RTK Query network errors
  if ('status' in error) {
    return error.status === 0 || error.status === 'FETCH_ERROR';
  }
  
  return false;
};

export const getRetryMessage = (error: any): string => {
  if (isNetworkError(error)) {
    return "Network error. Please check your connection and try again.";
  }
  
  return "Something went wrong. Please try again.";
}; 