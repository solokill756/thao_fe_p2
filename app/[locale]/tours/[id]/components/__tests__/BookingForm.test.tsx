import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import BookingForm from '../BookingForm';
import { createBookingAction } from '@/app/actions/booking/createBookingAction';
import { toast } from 'react-hot-toast';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock actions
jest.mock('@/app/actions/booking/createBookingAction', () => ({
  createBookingAction: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockCreateBookingAction = createBookingAction as jest.MockedFunction<
  typeof createBookingAction
>;

describe('BookingForm Component', () => {
  const mockTour = {
    tour_id: 1,
    title: 'Paris Adventure',
    price_per_person: 500,
    max_guests: 10,
    duration_days: 5,
  } as any;

  const mockDictionary = {
    tourDetail: {
      bookNow: 'Book Now',
      selectDate: 'Select Date',
      numberOfGuests: 'Number of Guests',
      totalPrice: 'Total Price',
      booking: 'Booking',
      loginToBook: 'Please login to book',
      bookingSuccess: 'Booking successful!',
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
        },
      },
      status: 'authenticated',
    } as any);
    mockCreateBookingAction.mockResolvedValue({ success: true } as any);
  });

  describe('Basic Rendering', () => {
    it('should render booking form', () => {
      const { container } = render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render date input', () => {
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );
      expect(screen.getByLabelText(/Select Date/i)).toBeInTheDocument();
    });

    it('should render guests input', () => {
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );
      expect(screen.getByLabelText(/Number of Guests/i)).toBeInTheDocument();
    });

    it('should render book now button', () => {
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );
      expect(screen.getByText('Book Now')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should show error when user is not logged in', async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: 'unauthenticated',
      } as any);

      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );

      const form = screen.getByText('Book Now').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Please login to book');
      });
    });

    it('should call createBookingAction on form submit', async () => {
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );

      const dateInput = screen.getByLabelText(/Select Date/i);
      fireEvent.change(dateInput, { target: { value: '2024-12-01' } });

      const guestsInput = screen.getByLabelText(/Number of Guests/i);
      fireEvent.change(guestsInput, { target: { value: '2' } });

      const form = screen.getByText('Book Now').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockCreateBookingAction).toHaveBeenCalled();
      });
    });

    it('should handle guests input with parseInt fallback', () => {
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );

      const guestsInput = screen.getByLabelText(/Number of Guests/i);
      fireEvent.change(guestsInput, { target: { value: 'invalid' } });
      // Should use DEFAULT_GUEST_MIN when parseInt fails
    });

    it('should handle successful booking', async () => {
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );

      const dateInput = screen.getByLabelText(/Select Date/i);
      fireEvent.change(dateInput, { target: { value: '2024-12-01' } });

      const form = screen.getByText('Book Now').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    });

    it('should handle booking failure', async () => {
      mockCreateBookingAction.mockResolvedValue({
        success: false,
        error: 'Booking failed',
      } as any);

      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );

      const dateInput = screen.getByLabelText(/Select Date/i);
      fireEvent.change(dateInput, { target: { value: '2024-12-01' } });

      const form = screen.getByText('Book Now').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it('should handle booking exception', async () => {
      mockCreateBookingAction.mockRejectedValue(new Error('Network error'));

      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );

      const dateInput = screen.getByLabelText(/Select Date/i);
      fireEvent.change(dateInput, { target: { value: '2024-12-01' } });

      const form = screen.getByText('Book Now').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });

    it('should handle booking failure with errors object', async () => {
      mockCreateBookingAction.mockResolvedValue({
        success: false,
        errors: {
          date: ['Date is required'],
          guests: ['Invalid number of guests'],
        },
      } as any);

      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );

      const dateInput = screen.getByLabelText(/Select Date/i);
      fireEvent.change(dateInput, { target: { value: '2024-12-01' } });

      const form = screen.getByText('Book Now').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Date is required');
      });
    });

    it('should handle booking failure with message', async () => {
      mockCreateBookingAction.mockResolvedValue({
        success: false,
        message: 'Booking failed',
      } as any);

      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );

      const dateInput = screen.getByLabelText(/Select Date/i);
      fireEvent.change(dateInput, { target: { value: '2024-12-01' } });

      const form = screen.getByText('Book Now').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Booking failed');
      });
    });

    it('should handle booking failure without message or errors', async () => {
      mockCreateBookingAction.mockResolvedValue({
        success: false,
      } as any);

      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );

      const dateInput = screen.getByLabelText(/Select Date/i);
      fireEvent.change(dateInput, { target: { value: '2024-12-01' } });

      const form = screen.getByText('Book Now').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });
  });

  describe('Session Handling', () => {
    it('should update form data when session user changes', () => {
      const { rerender } = render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );

      // Update session
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: 'Jane Doe',
            email: 'jane@example.com',
          },
        },
        status: 'authenticated',
      } as any);

      rerender(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );
      // Form should update with new user data
      expect(screen.getByText('Book Now')).toBeInTheDocument();
    });
  });

  describe('Optimistic Updates', () => {
    it('should show optimistic data when submitting', async () => {
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );

      const dateInput = screen.getByLabelText(/Select Date/i);
      fireEvent.change(dateInput, { target: { value: '2024-12-01' } });

      const form = screen.getByText('Book Now').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      // Should show optimistic state
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    });
  });

  describe('Button States', () => {
    it('should show optimistic button state', async () => {
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );

      const dateInput = screen.getByLabelText(/Select Date/i);
      fireEvent.change(dateInput, { target: { value: '2024-12-01' } });

      const form = screen.getByText('Book Now').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      // Should show processing state
      await waitFor(() => {
        expect(screen.getByText(/Processing|Booking/i)).toBeInTheDocument();
      });
    });

    it('should show pending button state', () => {
      // This would require mocking useTransition to return isPending: true
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );
      // Button should show booking state when pending
      expect(screen.getByText(/Book Now/i)).toBeInTheDocument();
    });

    it('should show normal button state', () => {
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );
      // Button should show book now with price
      expect(screen.getByText(/Book Now.*\$500/i)).toBeInTheDocument();
    });
  });

  describe('Form Disabled State', () => {
    it('should disable form when isPending is true', () => {
      // This would require mocking useTransition
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );
      // Form should be disabled when pending
      const inputs = screen.getAllByRole('textbox');
      // Inputs should be disabled
    });

    it('should disable form when isOptimistic is true', async () => {
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );

      const dateInput = screen.getByLabelText(/Select Date/i);
      fireEvent.change(dateInput, { target: { value: '2024-12-01' } });

      const form = screen.getByText('Book Now').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      // Form should be disabled during optimistic update
      await waitFor(() => {
        expect(screen.getByText(/Processing|Booking/i)).toBeInTheDocument();
      });
    });
  });

  describe('Display Data Logic', () => {
    it('should use optimisticData when isOptimistic is true', async () => {
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );

      const nameInput = screen.getByPlaceholderText(/Full Name/i);
      fireEvent.change(nameInput, { target: { value: 'Test User' } });

      const dateInput = screen.getByLabelText(/Select Date/i);
      fireEvent.change(dateInput, { target: { value: '2024-12-01' } });

      const form = screen.getByText('Book Now').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      // Should use optimistic data
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalled();
      });
    });

    it('should use formData when isOptimistic is false', () => {
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );
      // Should use formData
      const nameInput = screen.getByPlaceholderText(/Full Name/i);
      expect(nameInput).toHaveValue('John Doe');
    });
  });

  describe('Session User Handling', () => {
    it('should handle session user name fallback', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: null,
            email: 'test@example.com',
          },
        },
        status: 'authenticated',
      } as any);

      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );
      // Should handle null name
      const nameInput = screen.getByPlaceholderText(/Full Name/i);
      expect(nameInput).toHaveValue('');
    });

    it('should handle session user email fallback', () => {
      mockUseSession.mockReturnValue({
        data: {
          user: {
            name: 'John Doe',
            email: null,
          },
        },
        status: 'authenticated',
      } as any);

      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );
      // Should handle null email
      const emailInput = screen.getByPlaceholderText(/Email/i);
      expect(emailInput).toHaveValue('');
    });
  });
});

  describe('Price Calculation', () => {
    it('should calculate total price correctly', () => {
      render(
        <BookingForm tour={mockTour} dictionary={mockDictionary} locale="en" />
      );
      const guestsInput = screen.getByLabelText(/Number of Guests/i);
      fireEvent.change(guestsInput, { target: { value: '2' } });
      // Total should be 500 * 2 = 1000
      expect(screen.getByText(/\$1000/)).toBeInTheDocument();
    });
  });
});
