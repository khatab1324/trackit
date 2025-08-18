import { parseAuthError } from './errorHandler';

// Test the error handler with the actual error structure from your app
describe('parseAuthError', () => {
  it('should parse 401 error with nested data structure', () => {
    const error = {
      status: 401,
      data: {
        error: "Invalid password",
        message: "The password you entered is incorrect"
      }
    };
    
    const result = parseAuthError(error);
    expect(result).toBe("Invalid password");
  });

  it('should parse 409 error for duplicate user', () => {
    const error = {
      status: 409,
      data: {
        error: "Username or email already exists",
        message: "A user with this username or email already exists"
      }
    };
    
    const result = parseAuthError(error);
    expect(result).toBe("Username or email already exists");
  });

  it('should parse 404 error for user not found', () => {
    const error = {
      status: 404,
      data: {
        error: "User not found",
        message: "No user found with the provided username"
      }
    };
    
    const result = parseAuthError(error);
    expect(result).toBe("User not found");
  });

  it('should handle 500 server errors', () => {
    const error = {
      status: 500,
      data: {
        error: "An error occurred while creating the user",
        message: "Please try again later"
      }
    };
    
    const result = parseAuthError(error);
    expect(result).toBe("An error occurred while creating the user");
  });

  it('should fallback to generic message for unknown status codes', () => {
    const error = {
      status: 418,
      data: {
        error: "I'm a teapot"
      }
    };
    
    const result = parseAuthError(error);
    expect(result).toBe("An unexpected error occurred. Please try again.");
  });

  it('should handle errors without data property', () => {
    const error = {
      status: 400
    };
    
    const result = parseAuthError(error);
    expect(result).toBe("Invalid input data. Please check your information.");
  });

  it('should handle network errors', () => {
    const error = {
      message: "Failed to fetch"
    };
    
    const result = parseAuthError(error);
    expect(result).toBe("Network error. Please check your internet connection.");
  });
}); 