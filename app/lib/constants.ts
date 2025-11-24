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

export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0';

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

export const AUTH_LOGIN_CONSTANTS = {
  SIGN_IN_PROVIDER: 'credentials',
  INVALID_CREDENTIALS: 'Invalid credentials',
  LOGIN_SUCCESSFUL: 'Login successful',
  DEFAULT_TITLE: 'Login',
  DEFAULT_SUBTITLE: 'Login to your account',
  EMAIL_LABEL: 'Email',
  EMAIL_PLACEHOLDER: 'ban@email.com',
  PASSWORD_LABEL: 'Password',
  PASSWORD_PLACEHOLDER: '••••••••',
  SIGNING_IN: 'Signing in...',
  SIGN_IN: 'Sign In',
  USER_HOME_PATH: '/user/home',
  ADMIN_HOME_PATH: '/admin/bookings',
  LOGIN_ERROR_PREFIX: 'Login error:',
  LOGIN_FAILED_MESSAGE: 'Login failed',
} as const;

export const AUTH_REGISTER_CONSTANTS = {
  ERROR_TEXT_CLASS: 'text-red-500 text-sm mt-1',
  PASSWORD_PLACEHOLDER: '********',
  DEFAULT_TITLE: 'Create Account',
  DEFAULT_SUBTITLE: 'Sign up to get started',
  FULL_NAME_LABEL: 'Full Name',
  FULL_NAME_PLACEHOLDER: 'John Doe',
  EMAIL_LABEL: 'Email',
  EMAIL_PLACEHOLDER: 'john.doe@example.com',
  PASSWORD_LABEL: 'Password',
  CONFIRM_PASSWORD_LABEL: 'Confirm Password',
  SIGNING_UP: 'Signing up...',
  SIGN_UP: 'Sign Up',
  SUCCESS_MESSAGE: 'Registration successful',
} as const;

export const HERO_SECTION_CONSTANTS = {
  FIND_TOUR: 'Find Tour',
  WHERE_TO_LABEL: 'Where to?',
  DATE_LABEL: 'Date',
  GUESTS_LABEL: 'Guests',
  WHERE_TO_PLACEHOLDER: 'Where to? (e.g., Switzerland)',
  DEFAULT_TITLE: "No matter where you're going to, we'll take you there.",
  DEFAULT_GREETING: 'Explore new places, create unforgettable memories.',
  LOADING: 'Loading destinations...',
  SEARCHING: 'Searching...',
  SEARCH_RESULTS: 'Search Results',
  NO_RESULTS: 'No tours found matching your criteria.',
  BACK_TO_HOME: 'Back to Home',
  DESTINATION_LABEL: 'Destination',
  DAY: 'day',
  DAYS: 'days',
  MAX_GUESTS: 'Max',
  AN_ERROR_OCCURRED: 'An error occurred',
  FILTER_BY_PRICE: 'Filter By Price',
  FILTER_BY_CATEGORIES: 'Filter By Categories',
  APPLY_FILTERS: 'Apply Filters',
  BUILD_YOUR_OWN_PACKAGE: 'Build Your Own Package',
  PRICE: 'Price',
  MIN_PRICE: 'Min Price',
  MAX_PRICE: 'Max Price',
  SORT_BY: 'Sort By',
  PRICE_LOW: 'Price (Low)',
  PRICE_HIGH: 'Price (High)',
  NAME_AZ: 'Name (A-Z)',
  PREVIOUS: 'Previous',
  NEXT: 'Next',
} as const;

export const SERVICES_SECTION_CONSTANTS = {
  CATEGORY: 'CATEGORY',
  DEFAULT_TITLE: 'We Offer Best Services',
  GUIDED_TOURS: 'Guided Tours',
  GUIDED_TOURS_DESCRIPTION:
    "Professional guided tours to explore the world's most iconic destinations.",
  BEST_FLIGHTS_OPTIONS: 'Best Flights Options',
  BEST_FLIGHTS_OPTIONS_DESCRIPTION:
    'Best flight options with competitive pricing and flexible booking.',
  RELIGIOUS_TOURS: 'Religious Tours',
  RELIGIOUS_TOURS_DESCRIPTION:
    'Religious tours to sacred sites and cultural heritage.',
  MEDICAL_INSURANCE: 'Medical Insurance',
  MEDICAL_INSURANCE_DESCRIPTION:
    'Comprehensive medical insurance for your journey.',
} as const;

export const TRENDING_PACKAGES_SECTION_CONSTANTS = {
  PROMOTION: 'PROMOTION',
  DEFAULT_TITLE: 'Our Trending Tour Packages',
  BOOK_NOW: 'Book Now',
  NO_TRENDING_TOURS: 'No trending tours available',
  COMING_SOON: 'Coming Soon',
  ERROR_MESSAGE: 'Unable to load trending packages. Please try again.',
  RETRY_LABEL: 'Try Again',
} as const;

export const FOOTER_CONSTANTS = {
  DESCRIPTION: 'Travel helps companies manage payments easily.',
  COMPANY: 'Company',
  ABOUT_US: 'About Us',
  CAREERS: 'Careers',
  BLOG: 'Blog',
  PRICING: 'Pricing',
  MALDIVES: 'Maldives',
  LOS_ANGELES: 'Los Angeles',
  LAS_VEGAS: 'Las Vegas',
  TORONTO: 'Toronto',
  JOIN_OUR_NEWSLETTER: 'Join Our Newsletter',
  NEWSLETTER_DESCRIPTION:
    'Will send you weekly updates for your better tour packages.',
  SUBSCRIBE: 'Subscribe',
  COPYRIGHT: 'Travel. All Rights Reserved.',
  DESTINATIONS: 'Destinations',
} as const;

export const HEADER_AUTH_SECTION_CONSTANTS = {
  GET_IN_TOUCH: 'Get in Touch',
  LOGIN: 'Login',
  SIGN_UP: 'Sign Up',
  LOGOUT: 'Logout',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  LOGOUT_FAILED: 'Logout failed',
} as const;

export const SEARCH_TOURS_CONSTANTS = {
  DEFAULT_IMAGE: '/images/home_bg.jpg',
  DEFAULT_LIMIT: 50,
  LOCALE_VI: 'vi-VN',
  LOCALE_EN: 'en-US',
  ITEMS_PER_PAGE: 10,
  MIN_PRICE: 100,
  MAX_PRICE: 3600,
  DEFAULT_MIN_PRICE: 100,
  DEFAULT_MAX_PRICE: 3600,
  UNKNOWN_DESTINATION: 'Unknown',
  DAY: 'Day',
  DAYS: 'Days',
} as const;

export const SORT_CRITERIA = {
  PRICE_ASC: 'priceAsc',
  PRICE_DESC: 'priceDesc',
  NAME_ASC: 'nameAsc',
} as const;

export const URL_SEARCH_PARAMS = {
  MIN_PRICE: 'minPrice',
  MAX_PRICE: 'maxPrice',
  CATEGORIES: 'categories',
  SORT_BY: 'sortBy',
  PAGE: 'page',
  DESTINATION: 'destination',
  DATE: 'date',
  GUESTS: 'guests',
} as const;

export const IMAGE_DIMENSIONS = {
  HERO_WIDTH: 1920,
  HERO_HEIGHT: 600,
} as const;

export const TOAST_DURATIONS = {
  ERROR: 5000,
  DEFAULT: 4000,
} as const;

export const AUTH_CONFIG = {
  MIN_PASSWORD_LENGTH: 6,
  SESSION_COOKIE_NAME: 'next-auth.session-token',
} as const;

export const QUERY_CONFIG = {
  STALE_TIME_5_MIN: 5 * 60 * 1000,
  ENABLED: true,
} as const;

export const TOUR_SEARCH_CONTENT = {
  LOADING: 'Loading tours...',
} as const;

// Tab IDs
export const TAB_IDS = {
  INFORMATION: 'information',
  TOUR_PLAN: 'tourplan',
  LOCATION: 'location',
  GALLERY: 'gallery',
} as const;

// Default values
export const DEFAULT_VALUES = {
  BOOK_NOW: 'Book Now',
  BOOKING_ERROR: 'Failed to submit booking. Please try again.',
  NOT_AVAILABLE: 'N/A',
  LOGIN_TO_BOOK: 'Please login to book this tour',
  BOOKING_SUCCESS: 'Booking request submitted successfully!',
  BOOKING_PROCESSING: 'Processing your booking...',
  BOOKING: 'Booking...',
  TRAVEL_DESTINATION: 'Travel Destination',
  DEFAULT_GUESTS: 2,
  DEFAULT_GUEST_MIN: 1,
  LOCATION_DESCRIPTION: 'The tour covers major destinations:',
  LOCATION_NOTE:
    'Please see the map below for main meeting points and hotel zones.',
  NO_GALLERY_IMAGES: 'No gallery images available',
} as const;

// Routes
export const ROUTES = {
  TOURS_SEARCH: '/tours/search',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  UNABLE_TO_LOAD_MAP: 'Unable to load map',
  NO_LOCATION_INFO: 'No location information available',
  UNAUTHORIZED: 'Unauthorized',
  VALIDATION_FAILED: 'Validation failed',
  PROFILE_UPDATED: 'Profile updated successfully',
  PROFILE_UPDATE_FAILED: 'Failed to update profile',
  UNKNOWN_ERROR: 'Unknown error',
} as const;

// Google Maps
export const GOOGLE_MAPS = {
  SEARCH_BASE_URL: 'https://www.google.com/maps/search/?api=1&query=',
} as const;

// Form field names
export const FORM_FIELDS = {
  LOCALE: 'locale',
  TOUR_ID: 'tourId',
  NAME: 'name',
  EMAIL: 'email',
  PHONE: 'phone',
  DATE: 'date',
  GUESTS: 'guests',
  MESSAGE: 'message',
} as const;

// Booking validation messages (fallback messages)
export const BOOKING_VALIDATION_MESSAGES = {
  TOUR_ID_REQUIRED: 'Tour ID is required',
  TOUR_ID_MUST_BE_INTEGER: 'Tour ID must be an integer',
  TOUR_ID_MUST_BE_POSITIVE: 'Tour ID must be positive',
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_SHORT: 'Name must be at least 2 characters',
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',
  PHONE_REQUIRED: 'Phone number is required',
  PHONE_INVALID: 'Please enter a valid phone number',
  DATE_REQUIRED: 'Departure date is required',
  DATE_MUST_BE_FUTURE: 'Departure date must be in the future',
  GUESTS_REQUIRED: 'Number of guests is required',
  GUESTS_MUST_BE_INTEGER: 'Number of guests must be an integer',
  GUESTS_MIN: 'At least 1 guest is required',
  GUESTS_MAX: (maxGuests: number) => `Maximum ${maxGuests} guests allowed`,
  FILL_ALL_FIELDS: 'Please fill in all required fields',
  TOUR_NOT_FOUND: 'Tour not found',
  DUPLICATE_BOOKING: 'You have already booked this tour for this date.',
  BOOKING_SUCCESS: 'Booking request submitted successfully!',
  BOOKING_ERROR: 'Failed to create booking. Please try again.',
} as const;

// Booking status values
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;

// Default locale
export const DEFAULT_LOCALE = 'en' as const;

// Locale strings for date formatting
export const LOCALE_STRINGS = {
  VIETNAMESE: 'vi-VN',
  ENGLISH: 'en-US',
} as const;

// Placeholder image URLs
export const PLACEHOLDER_IMAGES = {
  TOUR: 'https://placehold.co/60x40/1e40af/ffffff?text=Tour',
  ADMIN_AVATAR: 'https://placehold.co/40x40/3b82f6/ffffff?text=AD',
} as const;

// Admin Bookings Constants
export const ADMIN_BOOKINGS_CONSTANTS = {
  ADMIN_BADGE: 'ADMIN',
  MAIN_MENU: 'Main Menu',
  CONTENT_AND_STATS: 'Content & Stats',
  ADMIN_USER: 'Admin User',
  ADMIN_EMAIL: 'admin@travel.com',
  BOOKING_REQUESTS: 'Booking Requests',
  SEARCH_PLACEHOLDER: 'Search bookings...',
  PENDING_REQUESTS: 'Pending Requests',
  CONFIRMED_BOOKINGS: 'Confirmed Bookings',
  TOTAL_REVENUE: 'Total Revenue',
  VS_LAST_MONTH: 'vs last month',
  FILTER: 'Filter',
  EXPORT: 'Export',
  BOOKING_ID: 'Booking ID',
  USER_INFO: 'User Info',
  TOUR_DETAILS: 'Tour Details',
  DATES_AND_GUESTS: 'Dates & Guests',
  TOTAL_AND_PAYMENT: 'Total & Payment',
  STATUS: 'Status',
  ACTIONS: 'Actions',
  APPROVE: 'Approve',
  REJECT: 'Reject',
  NO_BOOKINGS_FOUND: 'No bookings found',
  TRY_ADJUSTING_SEARCH: 'Try adjusting your search or filters.',
  LOADING_BOOKINGS: 'Loading bookings...',
  GUEST: 'Guest',
  GUESTS: 'Guests',
  UNKNOWN_TOUR: 'Unknown Tour',
  NOT_AVAILABLE: 'N/A',
  SHOWING_ENTRIES: 'Showing {from} to {to} of {total} entries',
  PREVIOUS: 'Previous',
  NEXT: 'Next',
  DASHBOARD: 'Dashboard',
  MANAGE_BOOKINGS: 'Manage Bookings',
  MANAGE_TOURS: 'Manage Tours',
  MANAGE_USERS: 'Manage Users',
  USER_REVIEWS: 'User Reviews',
  CATEGORIES: 'Categories',
  REVENUE: 'Revenue',
  REPORTS: 'Reports',
  UNPAID: 'Unpaid',
  PAID: 'Paid',
  FAILED: 'Failed',
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  ALL: 'All',
  BANKING: 'Banking',
  CREDIT_CARD: 'Credit Card',
  PAID_BANKING: 'Paid (Banking)',
  PAID_CREDIT_CARD: 'Paid (Credit Card)',
  BOOKING_HAS_BEEN: 'Booking {id} has been {status}!',
  FAILED_TO_UPDATE: 'Failed to update booking status',
  FAILED_TO_LOAD_BOOKINGS: 'Failed to load bookings',
} as const;

// User Profile Constants
export const USER_PROFILE_CONSTANTS = {
  MY_BOOKINGS: 'My Bookings',
  PROFILE_SETTINGS: 'Profile Settings',
  PERSONAL_INFORMATION: 'Personal Information',
  FULL_NAME: 'Full Name',
  EMAIL_ADDRESS: 'Email Address',
  PHONE_NUMBER: 'Phone Number',
  ADDRESS: 'Address',
  SAVE_CHANGES: 'Save Changes',
  MEMBER_SINCE: 'Member since',
  ITEMS: 'items',
  ALL: 'All',
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  BOOKING_ID: 'Booking ID',
  START: 'Start',
  GUEST: 'Guest',
  GUESTS: 'Guests',
  DETAILS: 'Details',
  CANCEL: 'Cancel',
  NO_BOOKINGS: 'No bookings found',
  LOADING_BOOKINGS: 'Loading bookings...',
  FAILED_TO_LOAD_BOOKINGS: 'Failed to load bookings',
  LOGOUT: 'Log Out',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  LOGOUT_FAILED: 'Logout failed',
  PLEASE_LOGIN: 'Please login to view your profile',
  GO_TO_LOGIN: 'Go to Login',
  USER: 'User',
  TOUR: 'Tour',
  UNKNOWN_TOUR: 'Unknown Tour',
  PHONE_PLACEHOLDER: '+84 123 456 789',
  ADDRESS_PLACEHOLDER: 'Ho Chi Minh City, Vietnam',
  BOOKING_DELETED: 'Booking deleted successfully',
  BOOKING_DELETION_FAILED: 'Failed to delete booking',
  BOOKING_CANCELLED: 'Booking cancelled successfully',
  BOOKING_CANCELLATION_FAILED: 'Failed to cancel booking',
  CANCELLING: 'Cancelling...',
  PROFILE_UPDATED: 'Profile updated successfully',
  PROFILE_UPDATE_FAILED: 'Failed to update profile',
  SAVING: 'Saving...',
  EMAIL_CANNOT_BE_CHANGED: 'Email cannot be changed',
  FULL_NAME_TOO_SHORT: 'Full name must be at least 2 characters',
  FULL_NAME_TOO_LONG: 'Full name must be less than 100 characters',
  PHONE_NUMBER_TOO_LONG: 'Phone number must be less than 20 characters',
  PAY_NOW: 'Pay Now',
} as const;

// Payment Constants
export const PAYMENT_CONSTANTS = {
  BACK: 'Back',
  HAS_PAID: 'Has Paid',
  PAYMENT: 'Payment',
  CONFIRM_AND_PAY: 'Confirm and Pay',
  PAYMENT_SUCCESSFUL: 'Payment Successful!',
  PAYMENT_FAILED: 'Payment Failed',
  PROCESSING: 'Processing...',
  PAYMENT_METHOD: 'Payment Method',
  PAY_WITH: 'Pay with',
  CREDIT_DEBIT_CARD: 'Credit/Debit Card',
  INTERNET_BANKING: 'Internet Banking',
  CARD_NUMBER: 'Card Number',
  EXPIRATION: 'Expiration',
  CVC: 'CVC',
  SCAN_QR_CODE: 'Scan QR Code to Pay via Banking App',
  SUPPORTED_BANKS: 'Supported Banks: Vietcombank, Techcombank, ACB...',
  PAYMENTS_SECURE: 'Payments are secure and encrypted.',
  YOUR_TRIP: 'Your Trip',
  DATES: 'Dates',
  PRICE_DETAILS: 'Price Details',
  TAXES_FEES: 'Taxes & Fees',
  TOTAL: 'Total',
  FREE_CANCELLATION: 'Free Cancellation',
  FREE_CANCELLATION_DESC:
    'up to 48 hours before the trip. Book now to secure your spot!',
  GO_TO_MY_BOOKINGS: 'Go to My Bookings',
  BACK_TO_HOME: 'Back to Home',
  BACK_TO_TOUR_DETAILS: 'Back to Tour Details',
  TOUR_PACKAGE: 'Tour Package',
  PAYMENT_SUCCESS_MESSAGE:
    'Thank you for your booking. Your tour has been confirmed.',
  PAYMENT_PROCESSING: 'Processing payment...',
  PAYMENT_ERROR:
    'An error occurred while processing your payment. Please try again.',
  BOOKING_NOT_FOUND: 'Booking not found',
  BOOKING_NOT_CONFIRMED: 'Booking is not confirmed',
  PAYMENT_ALREADY_COMPLETED: 'Payment already completed',
  LOADING: 'Loading...',
  CARD_DATA_REQUIRED: 'Please fill in all card details',
  DAY: 'day',
  DAYS: 'days',
  GUEST: 'Guest',
  GUESTS: 'Guests',
} as const;

// Locale Constants
export const LOCALE_CODES = {
  VIETNAMESE: 'vi-VN',
  ENGLISH: 'en-US',
} as const;

// Placeholder Image URLs
export const PLACEHOLDER_IMAGE_URLS = {
  TOUR: 'https://placehold.co/100x100/1e40af/ffffff?text=Tour',
  QR_CODE: 'https://placehold.co/180x180/000000/ffffff?text=QR+CODE',
} as const;

// Payment Method Constants
export const PAYMENT_METHODS = {
  CARD: 'card',
  INTERNET_BANKING: 'internet_banking',
} as const;

// Booking Status Color Classes
export const BOOKING_STATUS_COLORS = {
  CONFIRMED: 'text-green-600 bg-green-50 border-green-200',
  PENDING: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  CANCELLED: 'text-red-600 bg-red-50 border-red-200',
  DEFAULT: 'text-gray-600 bg-gray-50 border-gray-200',
} as const;
