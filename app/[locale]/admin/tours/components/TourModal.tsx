'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, Upload, Plus, Trash2, Calendar } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import type { DictType } from '@/app/lib/types/dictType';
import type { TourWithRelations } from '@/app/actions/admin/getToursAction';
import type { GalleryItem, TourPlan } from '@/app/lib/types/tourTypes';
import type {
  CreateTourData,
  UpdateTourData,
} from '@/app/lib/services/tourService';
import { generateTempId } from '@/app/lib/utils/tempID';

interface TourPlanForm {
  id: string;
  day_number: number;
  title: string;
  description: string;
  inclusions: string[];
}

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: CreateTourData | UpdateTourData) => void;
  tour: TourWithRelations | null;
  categories: Array<{ category_id: number; name: string }>;
  destinations: Array<{
    destination_id: number;
    name: string;
    country: string | null;
  }>;
  dictionary: DictType;
  isSaving: boolean;
}

export default function TourModal({
  isOpen,
  onClose,
  onSave,
  tour,
  categories,
  destinations,
  dictionary,
  isSaving,
}: TourModalProps) {
  const adminDict = dictionary.admin?.tours || {};
  const allowedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ];
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price_per_person: '',
    duration_days: '',
    max_guests: '',
    cover_image_url: '',
    departure_location: '',
    departure_time: '',
    return_time: '',
    start_date: '',
    category_ids: [] as number[],
    destination_ids: [] as number[],
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [tourPlans, setTourPlans] = useState<TourPlanForm[]>([]);
  const [whatIncluded, setWhatIncluded] = useState<string[]>([]);
  const [whatNotIncluded, setWhatNotIncluded] = useState<string[]>([]);

  useEffect(() => {
    if (tour) {
      setFormData({
        title: tour.title || '',
        description: tour.description || '',
        price_per_person: tour.price_per_person.toString() || '',
        duration_days: tour.duration_days.toString() || '',
        max_guests: tour.max_guests.toString() || '',
        cover_image_url: tour.cover_image_url || '',
        departure_location: tour.departure_location || '',
        departure_time: tour.departure_time?.toString() || '',
        return_time: tour.return_time?.toString() || '',
        start_date: tour.start_date
          ? new Date(tour.start_date).toISOString().split('T')[0]
          : '',
        category_ids:
          tour.categories.map(
            (c: { category: { category_id: number } }) => c.category.category_id
          ) || [],
        destination_ids:
          tour.destinations.map(
            (d: { destination: { destination_id: number } }) =>
              d.destination.destination_id
          ) || [],
      });
      setImagePreview(tour.cover_image_url || null);
      setGalleryItems(
        tour.gallery?.map((image) => ({
          id: `${image.image_id}`,
          url: image.image_url,
          preview: image.image_url,
          uploading: false,
        })) || []
      );

      if (tour.what_included) {
        let includedArray: string[] = [];
        if (Array.isArray(tour.what_included)) {
          includedArray = tour.what_included
            .map((item: unknown) => {
              if (typeof item === 'string') return item;
              if (typeof item === 'number' || typeof item === 'boolean')
                return String(item);
              return null;
            })
            .filter((item): item is string => item !== null);
        } else if (
          typeof tour.what_included === 'object' &&
          tour.what_included !== null
        ) {
          includedArray = Object.values(tour.what_included)
            .map((item: unknown) => {
              if (typeof item === 'string') return item;
              if (typeof item === 'number' || typeof item === 'boolean')
                return String(item);
              return null;
            })
            .filter((item): item is string => item !== null);
        }
        setWhatIncluded(includedArray);
      } else {
        setWhatIncluded([]);
      }

      if (tour.what_not_included) {
        let notIncludedArray: string[] = [];
        if (Array.isArray(tour.what_not_included)) {
          notIncludedArray = tour.what_not_included
            .map((item: unknown) => {
              if (typeof item === 'string') return item;
              if (typeof item === 'number' || typeof item === 'boolean')
                return String(item);
              return null;
            })
            .filter((item): item is string => item !== null);
        } else if (
          typeof tour.what_not_included === 'object' &&
          tour.what_not_included !== null
        ) {
          notIncludedArray = Object.values(tour.what_not_included)
            .map((item: unknown) => {
              if (typeof item === 'string') return item;
              if (typeof item === 'number' || typeof item === 'boolean')
                return String(item);
              return null;
            })
            .filter((item): item is string => item !== null);
        }
        setWhatNotIncluded(notIncludedArray);
      } else {
        setWhatNotIncluded([]);
      }

      if (tour.plans && Array.isArray(tour.plans)) {
        setTourPlans(
          tour.plans.map((plan: TourPlan) => {
            let inclusionsArray: string[] = [];

            if (plan.inclusions) {
              if (Array.isArray(plan.inclusions)) {
                inclusionsArray = plan.inclusions
                  .map((inc) => {
                    if (typeof inc === 'string') return inc;
                    if (typeof inc === 'number' || typeof inc === 'boolean')
                      return String(inc);
                    return null;
                  })
                  .filter((inc): inc is string => inc !== null);
              } else if (
                typeof plan.inclusions === 'object' &&
                plan.inclusions !== null
              ) {
                inclusionsArray = Object.values(plan.inclusions)
                  .map((inc) => {
                    if (typeof inc === 'string') return inc;
                    if (typeof inc === 'number' || typeof inc === 'boolean')
                      return String(inc);
                    return null;
                  })
                  .filter((inc): inc is string => inc !== null);
              }
            }

            return {
              id: `${plan.plan_day_id}`,
              day_number: plan.day_number,
              title: plan.title,
              description: plan.description,
              inclusions: inclusionsArray,
            } as TourPlanForm;
          })
        );
      } else {
        setTourPlans([]);
      }
    } else {
      setFormData({
        title: '',
        description: '',
        price_per_person: '',
        duration_days: '',
        max_guests: '',
        cover_image_url: '',
        departure_location: '',
        departure_time: '',
        return_time: '',
        start_date: '',
        category_ids: [],
        destination_ids: [],
      });
      setImagePreview(null);
      setGalleryItems([]);
      setTourPlans([]);
      setWhatIncluded([]);
      setWhatNotIncluded([]);
    }
  }, [tour, isOpen]);

  if (!isOpen) return null;

  const hasGalleryUploading = galleryItems.some((item) => item.uploading);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData({
      ...formData,
      category_ids: formData.category_ids.includes(categoryId)
        ? formData.category_ids.filter((id) => id !== categoryId)
        : [...formData.category_ids, categoryId],
    });
  };

  const handleDestinationChange = (destinationId: number) => {
    setFormData({
      ...formData,
      destination_ids: formData.destination_ids.includes(destinationId)
        ? formData.destination_ids.filter((id) => id !== destinationId)
        : [...formData.destination_ids, destinationId],
    });
  };

  const uploadImage = async (file: File) => {
    const uploadForm = new FormData();
    uploadForm.append('file', file);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: uploadForm,
    });
    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || adminDict.uploadError || 'Failed to upload image'
      );
    }

    return data.url as string;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      toast.error(
        adminDict.invalidFileType ||
          'Only images (JPEG, PNG, WEBP, GIF) are allowed'
      );
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(adminDict.fileTooLarge || 'File size is too large (max 5MB)');
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);
    setIsUploading(true);

    try {
      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        cover_image_url: imageUrl,
      }));
      setImagePreview(imageUrl);
      toast.success(adminDict.uploadSuccess || 'Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      const fallbackMessage = adminDict.uploadError || 'Failed to upload image';
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : fallbackMessage
      );
      setImagePreview(tour?.cover_image_url || null);
    } finally {
      setIsUploading(false);
      URL.revokeObjectURL(localPreview);
      e.target.value = '';
    }
  };

  const handleGalleryFilesChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files?.length) return;

    for (const file of Array.from(files)) {
      if (!allowedImageTypes.includes(file.type)) {
        toast.error(
          adminDict.invalidFileType ||
            'Only images (JPEG, PNG, WEBP, GIF) are allowed'
        );
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(
          adminDict.fileTooLarge || 'File size is too large (max 5MB)'
        );
        continue;
      }

      const tempId = generateTempId();
      const localPreview = URL.createObjectURL(file);

      setGalleryItems((prev) => [
        ...prev,
        {
          id: tempId,
          url: null,
          preview: localPreview,
          uploading: true,
        },
      ]);

      try {
        const imageUrl = await uploadImage(file);
        setGalleryItems((prev) => {
          const exists = prev.some((item) => item.id === tempId);
          if (!exists) {
            return prev;
          }
          return prev.map((item) =>
            item.id === tempId
              ? {
                  ...item,
                  url: imageUrl,
                  preview: imageUrl,
                  uploading: false,
                }
              : item
          );
        });
        toast.success(
          adminDict.uploadSuccess || 'Image uploaded successfully!'
        );
      } catch (error) {
        console.error('Error uploading gallery image:', error);
        const fallbackMessage =
          adminDict.uploadError || 'Failed to upload image';
        toast.error(
          error instanceof Error && error.message
            ? error.message
            : fallbackMessage
        );
        setGalleryItems((prev) => prev.filter((item) => item.id !== tempId));
      } finally {
        URL.revokeObjectURL(localPreview);
      }
    }

    e.target.value = '';
  };

  const removeGalleryImage = (id: string) => {
    setGalleryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearImage = () => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setFormData((prev) => ({
      ...prev,
      cover_image_url: '',
    }));
  };

  const addTourPlan = () => {
    const maxDayNumber =
      tourPlans.length > 0
        ? Math.max(...tourPlans.map((p) => p.day_number))
        : 0;
    setTourPlans([
      ...tourPlans,
      {
        id: generateTempId(),
        day_number: maxDayNumber + 1,
        title: '',
        description: '',
        inclusions: [],
      },
    ]);
  };

  const removeTourPlan = (id: string) => {
    setTourPlans(tourPlans.filter((plan) => plan.id !== id));
  };

  const updateTourPlan = (
    id: string,
    field: keyof TourPlanForm,
    value: string | number | string[]
  ) => {
    setTourPlans(
      tourPlans.map((plan) =>
        plan.id === id ? { ...plan, [field]: value } : plan
      )
    );
  };

  const addInclusion = (planId: string) => {
    setTourPlans(
      tourPlans.map((plan) =>
        plan.id === planId
          ? { ...plan, inclusions: [...plan.inclusions, ''] }
          : plan
      )
    );
  };

  const updateInclusion = (planId: string, index: number, value: string) => {
    setTourPlans(
      tourPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              inclusions: plan.inclusions.map((inc, i) =>
                i === index ? value : inc
              ),
            }
          : plan
      )
    );
  };

  const removeInclusion = (planId: string, index: number) => {
    setTourPlans(
      tourPlans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              inclusions: plan.inclusions.filter((_, i) => i !== index),
            }
          : plan
      )
    );
  };

  const addWhatIncluded = () => {
    setWhatIncluded([...whatIncluded, '']);
  };

  const updateWhatIncluded = (index: number, value: string) => {
    setWhatIncluded(
      whatIncluded.map((item, i) => (i === index ? value : item))
    );
  };

  const removeWhatIncluded = (index: number) => {
    setWhatIncluded(whatIncluded.filter((_, i) => i !== index));
  };

  const addWhatNotIncluded = () => {
    setWhatNotIncluded([...whatNotIncluded, '']);
  };

  const updateWhatNotIncluded = (index: number, value: string) => {
    setWhatNotIncluded(
      whatNotIncluded.map((item, i) => (i === index ? value : item))
    );
  };

  const removeWhatNotIncluded = (index: number) => {
    setWhatNotIncluded(whatNotIncluded.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploading || hasGalleryUploading) {
      toast.error(
        adminDict.waitUploadFinish || 'Please wait until the upload finishes'
      );
      return;
    }
    const galleryUrls = galleryItems
      .filter((item) => !!item.url)
      .map((item) => item.url!) as string[];

    const plansData = tourPlans
      .filter((plan) => plan.title.trim() && plan.description.trim())
      .map((plan) => ({
        day_number: plan.day_number,
        title: plan.title,
        description: plan.description,
        inclusions:
          plan.inclusions.filter((inc) => inc.trim()).length > 0
            ? plan.inclusions.filter((inc) => inc.trim())
            : undefined,
      }));

    const whatIncludedData =
      whatIncluded.filter((item) => item.trim()).length > 0
        ? whatIncluded.filter((item) => item.trim())
        : undefined;
    const whatNotIncludedData =
      whatNotIncluded.filter((item) => item.trim()).length > 0
        ? whatNotIncluded.filter((item) => item.trim())
        : undefined;

    onSave({
      ...formData,
      gallery_images: galleryUrls,
      tour_plans: plansData,
      what_included: whatIncludedData,
      what_not_included: whatNotIncludedData,
      price_per_person: parseFloat(formData.price_per_person),
      duration_days: parseInt(formData.duration_days),
      max_guests: parseInt(formData.max_guests),
      start_date: formData.start_date
        ? new Date(formData.start_date)
        : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
          <h3 className="text-lg font-bold text-gray-800">
            {tour
              ? adminDict.editTourPackage || 'Edit Tour Package'
              : adminDict.createNewTour || 'Create New Tour'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {adminDict.tourName || 'Tour Name'}
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder={
                  adminDict.tourNamePlaceholder ||
                  'e.g. Switzerland Alps Adventure'
                }
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {adminDict.description || 'Description'}
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder={
                  adminDict.descriptionPlaceholder || 'Tour description...'
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {adminDict.departureLocation || 'Departure Location'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="departure_location"
                  value={formData.departure_location}
                  onChange={handleChange}
                  className="w-full p-2.5 border border-gray-300 rounded-lg pl-9 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={
                    adminDict.departureLocationPlaceholder || 'City, Country'
                  }
                />
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {adminDict.price || 'Price ($)'}
              </label>
              <input
                type="number"
                name="price_per_person"
                required
                min="0"
                step="0.01"
                value={formData.price_per_person}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {adminDict.duration || 'Duration (Days)'}
              </label>
              <input
                type="number"
                name="duration_days"
                required
                min="1"
                value={formData.duration_days}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Days"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {adminDict.maxGuests || 'Max Guests'}
              </label>
              <input
                type="number"
                name="max_guests"
                required
                min="1"
                value={formData.max_guests}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="Max guests"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {adminDict.startDate || 'Start Date'}
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {adminDict.coverImageUrl || 'Cover Image URL'}
              </label>
              <div className="space-y-3">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2" />
                        <p className="text-sm text-gray-500">
                          {adminDict.uploading || 'Uploading...'}
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            {adminDict.clickToUpload || 'Click to upload'}
                          </span>{' '}
                          {adminDict.orDragDrop || 'or drag & drop'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {adminDict.fileRequirements ||
                            'PNG, JPG, WEBP, GIF (max 5MB)'}
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept={allowedImageTypes.join(',')}
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>

                {imagePreview && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={imagePreview}
                      alt="Cover preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      unoptimized
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <input
                  type="hidden"
                  name="cover_image_url"
                  value={formData.cover_image_url}
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {adminDict.galleryImages || 'Gallery Images'}
              </label>
              <p className="text-sm text-gray-500 mb-3">
                {adminDict.addGalleryImages || 'Add gallery images'}
              </p>

              {galleryItems.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {galleryItems.map((item) => (
                    <div
                      key={item.id}
                      className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200"
                    >
                      <Image
                        src={item.preview}
                        alt="Gallery preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        unoptimized={item.preview.startsWith('blob:')}
                      />
                      {item.uploading && (
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-xs">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mb-2" />
                          {adminDict.uploading || 'Uploading...'}
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(item.id)}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black transition disabled:opacity-50"
                        disabled={item.uploading}
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-gray-200 rounded-lg p-4 text-sm text-gray-500 bg-gray-50 mb-4">
                  {adminDict.noGalleryImages || 'No gallery images added yet'}
                </div>
              )}

              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                  <Upload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">
                      {adminDict.clickToUpload || 'Click to upload'}
                    </span>{' '}
                    {adminDict.orDragDrop || 'or drag & drop'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {adminDict.fileRequirements ||
                      'PNG, JPG, WEBP, GIF (max 5MB)'}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept={allowedImageTypes.join(',')}
                  multiple
                  onChange={handleGalleryFilesChange}
                  disabled={hasGalleryUploading}
                />
              </label>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {adminDict.categories || 'Categories'}
              </label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                {categories.map((category) => (
                  <label
                    key={category.category_id}
                    className="flex items-center space-x-2 cursor-pointer mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.category_ids.includes(
                        category.category_id
                      )}
                      onChange={() =>
                        handleCategoryChange(category.category_id)
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {adminDict.destinations || 'Destinations'}
              </label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                {destinations.map((destination) => (
                  <label
                    key={destination.destination_id}
                    className="flex items-center space-x-2 cursor-pointer mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.destination_ids.includes(
                        destination.destination_id
                      )}
                      onChange={() =>
                        handleDestinationChange(destination.destination_id)
                      }
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {destination.name}
                      {destination.country && `, ${destination.country}`}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {adminDict.whatIncluded || "What's Included"}
              </label>
              <p className="text-sm text-gray-500 mb-3">
                {adminDict.whatIncludedDescription ||
                  'List what is included in the tour package'}
              </p>
              <div className="space-y-2 mb-4">
                {whatIncluded.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateWhatIncluded(idx, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder={
                        adminDict.whatIncludedPlaceholder ||
                        'e.g. Breakfast, Accommodation, Guide'
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeWhatIncluded(idx)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {whatIncluded.length === 0 && (
                  <p className="text-xs text-gray-400 italic">
                    {adminDict.noWhatIncluded ||
                      'No items added yet. Click "Add Item" to get started.'}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={addWhatIncluded}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Plus className="w-4 h-4" />
                {adminDict.addWhatIncluded || 'Add Item'}
              </button>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {adminDict.whatNotIncluded || "What's Not Included"}
              </label>
              <p className="text-sm text-gray-500 mb-3">
                {adminDict.whatNotIncludedDescription ||
                  'List what is not included in the tour package'}
              </p>
              <div className="space-y-2 mb-4">
                {whatNotIncluded.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) =>
                        updateWhatNotIncluded(idx, e.target.value)
                      }
                      className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder={
                        adminDict.whatNotIncludedPlaceholder ||
                        'e.g. Flights, Travel Insurance, Personal Expenses'
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeWhatNotIncluded(idx)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {whatNotIncluded.length === 0 && (
                  <p className="text-xs text-gray-400 italic">
                    {adminDict.noWhatNotIncluded ||
                      'No items added yet. Click "Add Item" to get started.'}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={addWhatNotIncluded}
                className="flex items-center gap-1 px-3 py-1.5 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                <Plus className="w-4 h-4" />
                {adminDict.addWhatNotIncluded || 'Add Item'}
              </button>
            </div>

            <div className="col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {adminDict.tourPlan || 'Tour Plan'}
                </label>
                <button
                  type="button"
                  onClick={addTourPlan}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  {adminDict.addDay || 'Add Day'}
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-3">
                {adminDict.tourPlanDescription ||
                  'Add detailed itinerary for each day of the tour'}
              </p>

              <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {tourPlans.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    {adminDict.noTourPlans ||
                      'No tour plans added yet. Click "Add Day" to get started.'}
                  </div>
                ) : (
                  tourPlans
                    .sort((a, b) => a.day_number - b.day_number)
                    .map((plan) => (
                      <div
                        key={plan.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-700">
                              {adminDict.day || 'Day'} {plan.day_number}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTourPlan(plan.id)}
                            className="text-red-600 hover:text-red-800 transition"
                            title={adminDict.delete || 'Delete'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              {adminDict.title || 'Title'}
                            </label>
                            <input
                              type="text"
                              value={plan.title}
                              onChange={(e) =>
                                updateTourPlan(plan.id, 'title', e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder={
                                adminDict.planTitlePlaceholder ||
                                'e.g. Arrival & Welcome Dinner'
                              }
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              {adminDict.description || 'Description'}
                            </label>
                            <textarea
                              value={plan.description}
                              onChange={(e) =>
                                updateTourPlan(
                                  plan.id,
                                  'description',
                                  e.target.value
                                )
                              }
                              rows={3}
                              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder={
                                adminDict.planDescriptionPlaceholder ||
                                'Describe the activities for this day...'
                              }
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <label className="block text-xs font-medium text-gray-600">
                                {adminDict.inclusions || 'Inclusions'}
                              </label>
                              <button
                                type="button"
                                onClick={() => addInclusion(plan.id)}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                {adminDict.addInclusion || 'Add'}
                              </button>
                            </div>
                            <div className="space-y-2">
                              {plan.inclusions.map((inclusion, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="text"
                                    value={inclusion}
                                    onChange={(e) =>
                                      updateInclusion(
                                        plan.id,
                                        idx,
                                        e.target.value
                                      )
                                    }
                                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={
                                      adminDict.inclusionPlaceholder ||
                                      'e.g. Breakfast included'
                                    }
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeInclusion(plan.id, idx)
                                    }
                                    className="text-red-600 hover:text-red-800 transition"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              {plan.inclusions.length === 0 && (
                                <p className="text-xs text-gray-400 italic">
                                  {adminDict.noInclusions ||
                                    'No inclusions added yet'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              {adminDict.cancel || 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading || hasGalleryUploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading || hasGalleryUploading
                ? adminDict.uploading || 'Uploading...'
                : isSaving
                  ? adminDict.saving || 'Saving...'
                  : tour
                    ? adminDict.saveChanges || 'Save Changes'
                    : adminDict.createTour || 'Create Tour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
