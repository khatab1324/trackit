# Authentication Error Handling System

This document describes the comprehensive error handling system implemented for the authentication screens (Sign In and Sign Up) in the mobile app.

## Overview

The error handling system provides:
- **Frontend validation**: Real-time form validation with field-specific error messages
- **Backend error parsing**: Intelligent parsing of backend error responses
- **User-friendly messages**: Clear, actionable error messages for users
- **Consistent UI**: Uniform error display across all authentication screens
- **Field-specific errors**: Backend errors mapped to specific form fields

## Components

### 1. Error Handler Utility (`core/utils/errorHandler.ts`)

Centralized error handling that parses different types of errors:

- **RTK Query errors**: Handles HTTP status codes and response data
- **Backend errors**: Parses specific error messages from the backend
- **Network errors**: Detects and handles connection issues
- **Validation errors**: Processes Zod validation failures

#### Key Functions

- `parseAuthError(error)`: Main error parsing function
- `isNetworkError(error)`: Detects network-related errors
- `getRetryMessage(error)`: Provides appropriate retry messages

#### RTK Query Error Structure

The error handler expects RTK Query errors in this format:
```typescript
{
  status: 401,
  data: {
    error: "Invalid password",
    message: "The password you entered is incorrect"
  }
}
```

### 2. Validation Utility (`core/utils/validation.ts`)

Comprehensive form validation for authentication inputs:

- **Email validation**: Format and required field validation
- **Username validation**: Length, character restrictions, and required field
- **Password validation**: Length requirements and confirmation matching
- **Form validation**: Complete form validation with detailed error mapping
- **Field error mapping**: Maps backend errors to specific form fields

#### Validation Rules

- Username: 3-30 characters, alphanumeric + underscore + hyphen
- Email: Valid email format
- Password: Minimum 6 characters, maximum 128 characters
- Password confirmation: Must match password

#### New Functions

- `mapBackendErrorToField(errorMessage)`: Maps backend error messages to specific fields
- `getFieldError(field, backendError, validationErrors)`: Gets field-specific error messages

### 3. Updated Authentication Screens

Both `SigninScreen.tsx` and `SignupScreen.tsx` now include:

- **Field-level errors**: Individual error messages below each input field
- **General error display**: Centralized error message for backend/network errors
- **Real-time validation**: Errors clear as users type
- **Visual feedback**: Red borders on invalid fields
- **Loading states**: Disabled buttons during API calls
- **Backend error mapping**: Backend errors displayed on relevant fields

## Error Types Handled

### Frontend Validation Errors
- Empty required fields
- Invalid email format
- Username length/character restrictions
- Password length requirements
- Password confirmation mismatch

### Backend Errors
- **409 Conflict**: Username/email already exists
  - `username_exists`: Username already taken
  - `email_exists`: Email already registered
- **404 Not Found**: User not found during sign in
- **401 Unauthorized**: Invalid password
- **400 Bad Request**: Validation failures (Zod)
- **500 Internal Server Error**: Server-side errors

### Network Errors
- Connection failures
- Request timeouts
- Fetch errors

## Error Display

### Field-Level Errors
- Small red text below each input field
- Red border around invalid fields
- Errors clear automatically when user starts typing
- **NEW**: Backend errors now appear on specific fields

### General Errors
- Red background box with border
- Centered error message
- Appears below form fields
- Handles backend and network errors

## Backend Improvements

The backend auth controller now returns appropriate HTTP status codes:

- **201 Created**: Successful user creation
- **200 OK**: Successful sign in
- **409 Conflict**: Duplicate user (with specific field information)
  - `Username already exists`
  - `Email already exists`
- **404 Not Found**: User not found
- **401 Unauthorized**: Invalid credentials
- **500 Internal Server Error**: Server errors

### Enhanced Signup Flow

The signup process now checks for both username and email existence:

1. **Username Check**: Verifies username is not already taken
2. **Email Check**: Verifies email is not already registered
3. **Specific Errors**: Returns field-specific error messages
4. **Proper Status Codes**: Uses 409 Conflict for duplicate data

## Usage Example

```typescript
import { parseAuthError } from '../core/utils/errorHandler';
import { validateSignupForm, getFieldError } from '../core/utils/validation';

// Validate form before submission
const validation = validateSignupForm({
  username, email, password, confirmPassword
});

if (!validation.isValid) {
  setFieldErrors(validation.errors);
  return;
}

// Handle API errors
try {
  const result = await signup(data);
  if ("error" in result) {
    const errorMessage = parseAuthError(result.error);
    setErrorMessage(errorMessage);
    
    // Map backend errors to specific fields
    const usernameError = getFieldError("username", errorMessage, {});
    if (usernameError) {
      setFieldErrors(prev => ({ ...prev, username: usernameError }));
    }
  }
} catch (error) {
  setErrorMessage("An unexpected error occurred");
}
```

## Error Response Format

### Backend Error Response
```json
{
  "error": "Email already exists",
  "message": "This email is already registered. Please use a different email address."
}
```

### RTK Query Error Structure
```typescript
{
  status: 409,
  data: {
    error: "Email already exists",
    message: "This email is already registered. Please use a different email address."
  }
}
```

## Field-Specific Error Mapping

### Username Errors
- **Frontend**: Length, character restrictions
- **Backend**: Already exists, invalid format

### Email Errors
- **Frontend**: Invalid format, required field
- **Backend**: Already registered, invalid format

### Password Errors
- **Frontend**: Length requirements, confirmation mismatch
- **Backend**: Invalid password, too weak

## Benefits

1. **Better User Experience**: Clear, actionable error messages
2. **Reduced Support**: Users understand what went wrong
3. **Consistent Behavior**: Uniform error handling across screens
4. **Maintainable Code**: Centralized error handling logic
5. **Better Debugging**: Structured error information for developers
6. **Field-Specific Feedback**: Users know exactly which field has an issue
7. **Improved Signup Flow**: Prevents duplicate accounts with clear feedback

## Future Enhancements

- Add retry mechanisms for network errors
- Implement error analytics and reporting
- Add accessibility features for screen readers
- Support for multiple languages
- Error recovery suggestions
- Real-time availability checking for username/email 