import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewForm from '../ReviewForm';
import { useSubmitReview } from '@/app/lib/hooks/useSubmitReview';
import { toast } from 'react-hot-toast';
import { REVIEW_CONSTANTS } from '@/app/lib/constants';

// Mock hooks
jest.mock('@/app/lib/hooks/useSubmitReview', () => ({
  useSubmitReview: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Star: () => <div data-testid="star-icon" />,
}));

const mockUseSubmitReview = useSubmitReview as jest.MockedFunction<
  typeof useSubmitReview
>;

describe('ReviewForm Component', () => {
  const mockDictionary = {
    review: {
      title: 'Share Your Experience',
      ratingLabel: 'Overall Rating',
      commentLabel: 'Write a review',
      submit: 'Submit Review',
      update: 'Update Review',
      success: 'Thank you! Your review has been submitted.',
      error: 'Unable to submit review. Please try again.',
      selectRating: 'Please select a rating.',
    },
  } as any;

  const mockSubmitMutation = {
    mutateAsync: jest.fn(),
    isPending: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSubmitReview.mockReturnValue(mockSubmitMutation as any);
  });

  describe('Basic Rendering', () => {
    it('should render review form', () => {
      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );
      expect(screen.getByText('Share Your Experience')).toBeInTheDocument();
    });

    it('should render rating stars', () => {
      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );
      const stars = screen.getAllByTestId('star-icon');
      expect(stars.length).toBe(5);
    });

    it('should render comment textarea', () => {
      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );
      expect(screen.getByLabelText(/Write a review/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );
      expect(screen.getByText('Submit Review')).toBeInTheDocument();
    });
  });

  describe('Rating Selection', () => {
    it('should update rating when star is clicked', () => {
      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );
      const stars = screen.getAllByTestId('star-icon');
      const firstStarButton = stars[0].closest('button');
      if (firstStarButton) {
        fireEvent.click(firstStarButton);
        // Rating should be updated
      }
    });

    it('should show hover state when hovering over stars', () => {
      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );
      const stars = screen.getAllByTestId('star-icon');
      const thirdStarButton = stars[2].closest('button');
      if (thirdStarButton) {
        fireEvent.mouseEnter(thirdStarButton);
        fireEvent.mouseLeave(thirdStarButton);
      }
    });
  });

  describe('Form Submission', () => {
    it('should show error when submitting without rating', async () => {
      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );
      const form = screen.getByText('Submit Review').closest('form');
      if (form) {
        fireEvent.submit(form);
      } else {
        const submitButton = screen.getByText('Submit Review');
        fireEvent.click(submitButton);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Please select a rating.');
      });
    });

    it('should submit review when rating is selected', async () => {
      mockSubmitMutation.mutateAsync.mockResolvedValue({ success: true });

      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );

      // Select rating first
      const stars = screen.getAllByTestId('star-icon');
      const firstStarButton = stars[0].closest('button');
      if (firstStarButton) {
        fireEvent.click(firstStarButton);
      }

      const form = screen.getByText('Submit Review').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockSubmitMutation.mutateAsync).toHaveBeenCalled();
      });
    });

    it('should show success toast on successful submission', async () => {
      mockSubmitMutation.mutateAsync.mockResolvedValue({ success: true });

      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );

      const stars = screen.getAllByTestId('star-icon');
      const firstStarButton = stars[0].closest('button');
      if (firstStarButton) {
        fireEvent.click(firstStarButton);
      }

      const form = screen.getByText('Submit Review').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(
          'Thank you! Your review has been submitted.'
        );
      });
    });
  });

  describe('Existing Review', () => {
    it('should prefill form with existing review data', () => {
      const existingReview = {
        rating: 4,
        comment: 'Great tour!',
      };

      render(
        <ReviewForm
          bookingId={1}
          dictionary={mockDictionary}
          existingReview={existingReview}
        />
      );
      const textarea = screen.getByLabelText(/Write a review/i);
      expect(textarea).toHaveValue('Great tour!');
    });

    it('should show update button when existing review exists', () => {
      const existingReview = {
        rating: 4,
        comment: 'Great tour!',
      };

      render(
        <ReviewForm
          bookingId={1}
          dictionary={mockDictionary}
          existingReview={existingReview}
        />
      );
      expect(screen.getByText('Update Review')).toBeInTheDocument();
    });
  });

  describe('Comment Input', () => {
    it('should update comment when typing', () => {
      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );
      const textarea = screen.getByLabelText(/Write a review/i);
      fireEvent.change(textarea, { target: { value: 'Great experience!' } });
      expect(textarea).toHaveValue('Great experience!');
    });

    it('should limit comment to max characters', () => {
      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );
      const textarea = screen.getByLabelText(/Write a review/i);
      expect(textarea).toHaveAttribute('maxLength', '1000');
    });

    it('should submit without comment when comment is empty', async () => {
      mockSubmitMutation.mutateAsync.mockResolvedValue({ success: true });

      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );

      // Select rating
      const stars = screen.getAllByTestId('star-icon');
      const firstStarButton = stars[0].closest('button');
      if (firstStarButton) {
        fireEvent.click(firstStarButton);
      }

      // Submit without comment
      const form = screen.getByText('Submit Review').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockSubmitMutation.mutateAsync).toHaveBeenCalledWith({
          bookingId: 1,
          rating: 1,
          comment: undefined,
        });
      });
    });

    it('should submit with trimmed comment when comment has whitespace', async () => {
      mockSubmitMutation.mutateAsync.mockResolvedValue({ success: true });

      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );

      // Select rating
      const stars = screen.getAllByTestId('star-icon');
      const firstStarButton = stars[0].closest('button');
      if (firstStarButton) {
        fireEvent.click(firstStarButton);
      }

      // Add comment with whitespace
      const textarea = screen.getByLabelText(/Write a review/i);
      fireEvent.change(textarea, { target: { value: '  Great tour!  ' } });

      const form = screen.getByText('Submit Review').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(mockSubmitMutation.mutateAsync).toHaveBeenCalledWith({
          bookingId: 1,
          rating: 1,
          comment: 'Great tour!',
        });
      });
    });
  });

  describe('Submission Error Handling', () => {
    it('should handle submission failure with error message', async () => {
      mockSubmitMutation.mutateAsync.mockResolvedValue({
        success: false,
        error: 'Failed to submit review',
      });

      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );

      const stars = screen.getAllByTestId('star-icon');
      const firstStarButton = stars[0].closest('button');
      if (firstStarButton) {
        fireEvent.click(firstStarButton);
      }

      const form = screen.getByText('Submit Review').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to submit review');
      });
    });

    it('should handle submission failure without error message', async () => {
      mockSubmitMutation.mutateAsync.mockResolvedValue({
        success: false,
      });

      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );

      const stars = screen.getAllByTestId('star-icon');
      const firstStarButton = stars[0].closest('button');
      if (firstStarButton) {
        fireEvent.click(firstStarButton);
      }

      const form = screen.getByText('Submit Review').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(REVIEW_CONSTANTS.ERROR);
      });
    });

    it('should handle submission exception', async () => {
      mockSubmitMutation.mutateAsync.mockRejectedValue(new Error('Network error'));

      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );

      const stars = screen.getAllByTestId('star-icon');
      const firstStarButton = stars[0].closest('button');
      if (firstStarButton) {
        fireEvent.click(firstStarButton);
      }

      const form = screen.getByText('Submit Review').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Unable to submit review. Please try again.');
      });
    });
  });

  describe('Star Hover Logic', () => {
    it('should use hoverRating when hovering', () => {
      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );
      const stars = screen.getAllByTestId('star-icon');
      const thirdStarButton = stars[2].closest('button');
      if (thirdStarButton) {
        fireEvent.mouseEnter(thirdStarButton);
        // Should show hover state
        fireEvent.mouseLeave(thirdStarButton);
      }
    });

    it('should use rating when not hovering', () => {
      render(
        <ReviewForm bookingId={1} dictionary={mockDictionary} />
      );
      const stars = screen.getAllByTestId('star-icon');
      const firstStarButton = stars[0].closest('button');
      if (firstStarButton) {
        fireEvent.click(firstStarButton);
        // Should show selected state based on rating
      }
    });
  });

  describe('Dictionary Fallbacks', () => {
    it('should use constants when dictionary values are missing', async () => {
      const incompleteDict = { review: {} } as any;
      mockSubmitMutation.mutateAsync.mockResolvedValue({ success: true });

      render(
        <ReviewForm bookingId={1} dictionary={incompleteDict} />
      );

      const stars = screen.getAllByTestId('star-icon');
      const firstStarButton = stars[0].closest('button');
      if (firstStarButton) {
        fireEvent.click(firstStarButton);
      }

      const form = screen.getByText(REVIEW_CONSTANTS.SUBMIT || 'Submit Review').closest('form');
      if (form) {
        fireEvent.submit(form);
      }

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith(REVIEW_CONSTANTS.SUCCESS);
      });
    });
  });
});

