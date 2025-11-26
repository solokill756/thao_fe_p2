import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import ProfileForm from '../ProfileForm';
import { useUpdateUserProfile } from '@/app/lib/hooks/useUpdateUserProfile';
import { useUserProfileStore } from '@/app/lib/stores/userProfileStore';
import { toast } from 'react-hot-toast';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock hooks
jest.mock('@/app/lib/hooks/useUpdateUserProfile', () => ({
  useUpdateUserProfile: jest.fn(),
}));

jest.mock('@/app/lib/stores/userProfileStore', () => ({
  useUserProfileStore: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockUseUpdateUserProfile = useUpdateUserProfile as jest.MockedFunction<
  typeof useUpdateUserProfile
>;
const mockUseUserProfileStore = useUserProfileStore as jest.MockedFunction<
  typeof useUserProfileStore
>;

describe('ProfileForm Component', () => {
  const mockUser = {
    name: 'John Doe',
    email: 'john@example.com',
    image: 'https://example.com/avatar.jpg',
  };

  const mockDictionary = {
    useProfile: {
      fullName: 'Full Name',
      phoneNumber: 'Phone Number',
      saveChanges: 'Save Changes',
      profileUpdated: 'Profile updated successfully',
      saving: 'Saving...',
    },
  } as any;

  const mockUpdateMutation = {
    mutateAsync: jest.fn(),
    isPending: false,
  };

  const mockUpdateName = jest.fn();
  const mockUpdatePhoneNumber = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSession.mockReturnValue({
      data: { user: mockUser },
      status: 'authenticated',
    } as any);

    mockUseUpdateUserProfile.mockReturnValue(mockUpdateMutation as any);

    mockUseUserProfileStore.mockReturnValue({
      name: null,
      phoneNumber: null,
      updateName: mockUpdateName,
      updatePhoneNumber: mockUpdatePhoneNumber,
    } as any);
  });

  describe('Basic Rendering', () => {
    it('should render form with user data', () => {
      render(
        <ProfileForm
          dictionary={mockDictionary}
          locale="en"
          user={mockUser}
        />
      );
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    });

    it('should prefill form with user name', () => {
      render(
        <ProfileForm
          dictionary={mockDictionary}
          locale="en"
          user={mockUser}
        />
      );
      const nameInput = screen.getByLabelText(/Full Name/i);
      expect(nameInput).toHaveValue('John Doe');
    });

    it('should render save button', () => {
      render(
        <ProfileForm
          dictionary={mockDictionary}
          locale="en"
          user={mockUser}
        />
      );
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('should call updateUserProfile on form submit', async () => {
      mockUpdateMutation.mutateAsync.mockResolvedValue({ success: true });

      render(
        <ProfileForm
          dictionary={mockDictionary}
          locale="en"
          user={mockUser}
        />
      );

      const form = screen.getByRole('form') || screen.getByText('Save Changes').closest('form');
      if (form) {
        fireEvent.submit(form);
      } else {
        const saveButton = screen.getByText('Save Changes');
        fireEvent.click(saveButton);
      }

      await waitFor(() => {
        expect(mockUpdateMutation.mutateAsync).toHaveBeenCalled();
      });
    });

    it('should show success toast on successful update', async () => {
      mockUpdateMutation.mutateAsync.mockResolvedValue({ success: true });

      render(
        <ProfileForm
          dictionary={mockDictionary}
          locale="en"
          user={mockUser}
        />
      );

      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Profile updated successfully');
      });
    });

    it('should show error toast on failed update', async () => {
      mockUpdateMutation.mutateAsync.mockResolvedValue({
        success: false,
        errors: { fullName: ['Name is required'] },
      });

      render(
        <ProfileForm
          dictionary={mockDictionary}
          locale="en"
          user={mockUser}
        />
      );

      const saveButton = screen.getByText('Save Changes');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled();
      });
    });
  });

  describe('Store Integration', () => {
    it('should use store name when available', () => {
      mockUseUserProfileStore.mockReturnValue({
        name: 'Store Name',
        phoneNumber: '123456789',
        updateName: mockUpdateName,
        updatePhoneNumber: mockUpdatePhoneNumber,
      } as any);

      render(
        <ProfileForm
          dictionary={mockDictionary}
          locale="en"
          user={mockUser}
        />
      );
      const nameInput = screen.getByLabelText(/Full Name/i);
      expect(nameInput).toHaveValue('Store Name');
    });
  });

  describe('Loading State', () => {
    it('should disable save button when saving', () => {
      mockUpdateMutation.isPending = true;
      render(
        <ProfileForm
          dictionary={mockDictionary}
          locale="en"
          user={mockUser}
        />
      );
      const saveButton = screen.getByText('Saving...');
      expect(saveButton).toBeDisabled();
    });
  });
});

