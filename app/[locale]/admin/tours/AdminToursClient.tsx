'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { DictType } from '@/app/lib/types/dictType';
import {
  useTours,
  useCreateTour,
  useUpdateTour,
  useDeleteTour,
} from '@/app/lib/hooks/useTours';
import AdminHeader from '../bookings/components/AdminHeader';
import TourModal from './components/TourModal';
import TourTable from './components/TourTable';
import ErrorRetry from '@/app/components/common/ErrorRetry';
import { Plus } from 'lucide-react';
import { Category, Destination, TourWithRelations } from '@/app/lib/types';
import { CreateTourData, UpdateTourData } from '@/app/lib/services/tourService';

interface AdminToursClientProps {
  locale: 'en' | 'vi';
  dictionary: DictType;
  initialTours: TourWithRelations[];
  initialCategories: Category[];
  initialDestinations: Destination[];
}

export default function AdminToursClient({
  locale,
  dictionary,
  initialTours,
  initialCategories,
  initialDestinations,
}: AdminToursClientProps) {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTour, setCurrentTour] = useState<TourWithRelations | null>(
    null
  );
  const [categories, setCategories] = useState<
    Array<{ category_id: number; name: string }>
  >([]);
  const [destinations, setDestinations] = useState<
    Array<{ destination_id: number; name: string; country: string | null }>
  >([]);

  const {
    data: tours = [],
    isLoading: loading,
    error,
    refetch,
  } = useTours(initialTours);

  const createTourMutation = useCreateTour(locale);
  const updateTourMutation = useUpdateTour(locale);
  const deleteTourMutation = useDeleteTour();

  const handleEdit = (tour: TourWithRelations) => {
    setCurrentTour(tour);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentTour(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    setCategories(initialCategories);
    setDestinations(initialDestinations);
  }, [initialCategories, initialDestinations]);

  const handleSave = async (formData: UpdateTourData | CreateTourData) => {
    if (currentTour) {
      await updateTourMutation.mutateAsync({
        tour_id: currentTour.tour_id,
        ...formData,
        locale,
      } as UpdateTourData & { locale: 'en' | 'vi' });
    } else {
      await createTourMutation.mutateAsync({
        ...formData,
        locale,
      } as CreateTourData & { locale: 'en' | 'vi' });
    }
    setIsModalOpen(false);
    setCurrentTour(null);
  };

  const handleDelete = async (tourId: number) => {
    if (
      window.confirm(
        dictionary.admin?.tours?.confirmDelete ||
          'Are you sure you want to delete this tour? This action cannot be undone.'
      )
    ) {
      await deleteTourMutation.mutateAsync(tourId);
    }
  };

  const filteredTours = tours.filter(
    (tour) =>
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.departure_location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminDict = dictionary.admin?.tours || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-slate-500">
          {adminDict.loadingTours || 'Loading tours...'}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorRetry
        message={adminDict.failedToLoadTours || 'Failed to load tours'}
        onRetry={refetch}
      />
    );
  }

  return (
    <>
      <AdminHeader
        dictionary={dictionary}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        title={adminDict.tourPackagesManagement || 'Tour Packages Management'}
        searchPlaceholder={adminDict.searchTours || 'Search tours...'}
      />
      <main className="p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm">
              {adminDict.allTours || 'All Tours'} ({tours.length})
            </button>
          </div>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md flex items-center font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />{' '}
            {adminDict.addNewTour || 'Add New Tour'}
          </button>
        </div>

        <TourTable
          tours={filteredTours}
          dictionary={dictionary}
          locale={locale}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>
      <TourModal
        isSaving={createTourMutation.isPending || updateTourMutation.isPending}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentTour(null);
        }}
        onSave={handleSave}
        tour={currentTour}
        categories={categories}
        destinations={destinations}
        dictionary={dictionary}
      />
    </>
  );
}
