export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: Number(process.env.HTTP_BAD_REQUEST_STATUS) || 400,
  UNAUTHORIZED: Number(process.env.HTTP_UNAUTHORIZED_STATUS) || 401,
  NOT_FOUND: Number(process.env.HTTP_NOT_FOUND_STATUS) || 404,
  SERVER_ERROR: Number(process.env.HTTP_SERVER_ERROR_STATUS) || 500,
} as const;

export const TAILWIND = {
  CONTAINER: 'max-w-3xl mx-auto py-12 px-4',
  ICON_SIZE: 'w-4 h-4',
  BUTTON_PRIMARY: 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded',
  BUTTON_DANGER: 'bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded',
} as const;

export const REQUEST_TIMEOUT = 5000; // in milliseconds

export const TOAST_DURATION = 4000; // in milliseconds

export const CONTENT_TYPES = {
  JSON: 'application/json',
  PLAIN_TEXT: 'text/plain',
} as const;

export const POST_DETAIL_CONTENT = {
  NOT_FOUND: 'Post not found',
  NO_TITLE: 'No Title',
  NO_CONTENT: 'No content',
  REQUEST_TIMEOUT: 'Request timed out. Please try again.',
  DELETE_FAILED: 'Failed to delete post. Please try again.',
  DELETE_SUCCESS: 'Post deleted successfully.',
  EDIT_SUCCESS: 'Post edited successfully.',
  BACK_TO_POSTS: 'Back to Posts',
  EDIT: 'Edit',
  DELETE: 'Delete',
  CONFIRM_DELETE: 'Are you sure you want to delete this post?',
  CONFIRM: 'Confirm',
  DELETING: 'Deleting...',
  CANCEL: 'Cancel',
  LOADING: 'Loading post...',
};

export const POSTCARD_CONTENT = {
  READ_MORE: 'Read More →',
  NO_CONTENT: 'No content',
  NO_TITLE: 'No Title',
};

export const POSTS_CONTENT = {
  LOADING: 'Loading posts...',
};

export const POST_LIST_CONTENT = {
  NO_POSTS: 'No posts available. Please add a new post.',
  LOADING: 'Loading posts...',
  ERROR: 'Failed to load posts. Please try again later.',
  NO_CONTENT: 'No content available.',
  NO_TITLE: 'Posts',
  ADD_POST: 'Add Post',
};

export const AUTH_MESSAGES = {
  LOGIN_SUCCESSFUL: 'Login successful',
  INVALID_EMAIL_OR_PASSWORD: 'Invalid email or password',
  LOGIN_FAILED: 'Login failed',
  REGISTRATION_SUCCESSFUL: 'Registration successful',
  REGISTRATION_FAILED: 'Registration failed',
  GOOGLE_SIGN_IN_FAILED: 'Google sign in failed',
  MULTIPLE_ERRORS: 'Multiple errors found:',
} as const;

export const AUTH_LABELS = {
  EMAIL: 'Email',
  PASSWORD: 'Password',
  FULL_NAME: 'Full Name',
  CONFIRM_PASSWORD: 'Confirm Password',
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Sign Up',
  SIGNING_IN: 'Signing in',
  SIGNING_UP: 'Signing up',
  SIGNING_IN_WITH_DOTS: 'Signing in...',
  REGISTER: 'Register',
  CREATE_YOUR_ACCOUNT: 'Create your account',
} as const;

export const AUTH_PLACEHOLDERS = {
  EMAIL: 'ban@email.com',
  EMAIL_EXAMPLE: 'john.doe@example.com',
  PASSWORD: '••••••••',
  FULL_NAME: 'John Doe',
} as const;

export const AUTH_ERROR_MESSAGES = {
  LOGIN_ERROR: 'Login error:',
  GOOGLE_SIGN_IN_ERROR: 'Google sign in error:',
} as const;
