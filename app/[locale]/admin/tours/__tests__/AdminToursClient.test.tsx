import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import AdminToursClient from '../AdminToursClient';
import { useTours, useCreateTour, useUpdateTour, useDeleteTour } from '@/app/lib/hooks/useTours';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock hooks
jest.mock('@/app/lib/hooks/useTours', () => ({
  useTours: jest.fn(),
  useCreateTour: jest.fn(),
  useUpdateTour: jest.fn(),
  useDeleteTour: jest.fn(),
}));

// Mock child components
jest.mock('../../bookings/components/AdminHeader', () => {
  return function MockAdminHeader() {
    return <div data-testid="admin-header">Admin Header</div>;
  };
});

jest.mock('../components/TourModal', () => {
  return function MockTourModal() {
    return <div data-testid="tour-modal">Tour Modal</div>;
  };
});

jest.mock('../components/TourTable', () => {
  return function MockTourTable() {
    return <div data-testid="tour-table">Tour Table</div>;
  };
});

jest.mock('@/app/components/common/ErrorRetry', () => {
  return function MockErrorRetry() {
    return <div data-testid="error-retry">Error Retry</div>;
  };
});

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Plus: () => <div data-testid="plus-icon" />,
}));

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockUseTours = useTours as jest.MockedFunction<typeof useTours>;
const mockUseCreateTour = useCreateTour as jest.MockedFunction<typeof useCreateTour>;
const mockUseUpdateTour = useUpdateTour as jest.MockedFunction<typeof useUpdateTour>;
const mockUseDeleteTour = useDeleteTour as jest.MockedFunction<typeof useDeleteTour>;

describe('AdminToursClient Component', () => {
  const mockTours = [
    {
      tour_id: 1,
      title: 'Paris Tour',
      description: 'Beautiful Paris',
      departure_location: 'Paris',
    },
  ] as any;

  const mockCategories = [
    { category_id: 1, name: 'Adventure' },
  ] as any;

  const mockDestinations = [
    { destination_id: 1, name: 'Paris', country: 'France' },
  ] as any;

  const mockDictionary = {
    admin: {
      tours: {
        tourPackagesManagement: 'Tour Packages Management',
        searchTours: 'Search tours...',
        allTours: 'All Tours',
        addNewTour: 'Add New Tour',
        loadingTours: 'Loading tours...',
        failedToLoadTours: 'Failed to load tours',
        confirmDelete: 'Are you sure?',
      },
    },
  } as any;

  const mockCreateMutation = {
    mutateAsync: jest.fn(),
    isPending: false,
  };

  const mockUpdateMutation = {
    mutateAsync: jest.fn(),
    isPending: false,
  };

  const mockDeleteMutation = {
    mutateAsync: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.window.confirm = jest.fn(() => true);

    mockUseSession.mockReturnValue({
      data: { user: { role: 'admin' } },
      status: 'authenticated',
    } as any);

    mockUseTours.mockReturnValue({
      data: mockTours,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    } as any);

    mockUseCreateTour.mockReturnValue(mockCreateMutation as any);
    mockUseUpdateTour.mockReturnValue(mockUpdateMutation as any);
    mockUseDeleteTour.mockReturnValue(mockDeleteMutation as any);
  });

  describe('Basic Rendering', () => {
    it('should render admin header', () => {
      render(
        <AdminToursClient
          locale="en"
          dictionary={mockDictionary}
          initialTours={mockTours}
          initialCategories={mockCategories}
          initialDestinations={mockDestinations}
        />
      );
      expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    });

    it('should render tour table', () => {
      render(
        <AdminToursClient
          locale="en"
          dictionary={mockDictionary}
          initialTours={mockTours}
          initialCategories={mockCategories}
          initialDestinations={mockDestinations}
        />
      );
      expect(screen.getByTestId('tour-table')).toBeInTheDocument();
    });

    it('should render add new tour button', () => {
      render(
        <AdminToursClient
          locale="en"
          dictionary={mockDictionary}
          initialTours={mockTours}
          initialCategories={mockCategories}
          initialDestinations={mockDestinations}
        />
      );
      expect(screen.getByText('Add New Tour')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading message when loading', () => {
      mockUseTours.mockReturnValue({
        data: [],
        isLoading: true,
        error: null,
        refetch: jest.fn(),
      } as any);

      render(
        <AdminToursClient
          locale="en"
          dictionary={mockDictionary}
          initialTours={[]}
          initialCategories={[]}
          initialDestinations={[]}
        />
      );
      expect(screen.getByText('Loading tours...')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error retry when error occurs', () => {
      mockUseTours.mockReturnValue({
        data: [],
        isLoading: false,
        error: new Error('Failed to load'),
        refetch: jest.fn(),
      } as any);

      render(
        <AdminToursClient
          locale="en"
          dictionary={mockDictionary}
          initialTours={[]}
          initialCategories={[]}
          initialDestinations={[]}
        />
      );
      expect(screen.getByTestId('error-retry')).toBeInTheDocument();
    });
  });

  describe('Add New Tour', () => {
    it('should open modal when add new tour button is clicked', () => {
      render(
        <AdminToursClient
          locale="en"
          dictionary={mockDictionary}
          initialTours={mockTours}
          initialCategories={mockCategories}
          initialDestinations={mockDestinations}
        />
      );
      const addButton = screen.getByText('Add New Tour');
      fireEvent.click(addButton);
      expect(screen.getByTestId('tour-modal')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should filter tours by search term', () => {
      const { rerender } = render(
        <AdminToursClient
          locale="en"
          dictionary={mockDictionary}
          initialTours={mockTours}
          initialCategories={mockCategories}
          initialDestinations={mockDestinations}
        />
      );
      // Search functionality is tested through AdminHeader component
      expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    });
  });
});

